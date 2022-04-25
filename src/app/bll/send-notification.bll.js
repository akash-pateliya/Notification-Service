const eMedium = require('../enum/medium.enum');
const mediumBLL = require('./medium.bll');
const mailgun = require("mailgun-js");
const subscribeUserBLL = require('./subscribe-user.bll');
const errorLogBLL = require('./error-log.bll.js');
require('dotenv').config();

class sendNotificationBLL {

    async sendNotification(usersUidsArr, mediumsUidsArr, notificationSubject, notificationContent) {
        try {
            let finalResult = {};
            const mediums = await new mediumBLL().getMediumByUids(mediumsUidsArr);
            const users = await new subscribeUserBLL().getAllUsersByUids(usersUidsArr);
            mediums.result.forEach(async medium => {
                switch (medium.medium_name) {
                    case eMedium.Text:
                        const textResult = await this.sendNotificationToText(users.result, notificationContent);
                        finalResult[eMedium.Text] = {
                            success: textResult.success,
                            error: textResult.error
                        }
                        break;
                    case eMedium.Email:
                        const emailResult = await this.sendNotificationToEmail(users.result, notificationSubject, notificationContent);
                        finalResult[eMedium.Email] = {
                            success: emailResult.success,
                            error: emailResult.error
                        }
                        break;
                    case eMedium.Whatsapp:
                        const whatsappResult = await this.sendNotificationToWhatsapp(users.result, notificationContent);
                        finalResult[eMedium.Whatsapp] = {
                            success: whatsappResult.success,
                            error: whatsappResult.error
                        }
                        break;
                    case eMedium.Slack:
                        const slackResult = await this.sendNotificationToSlack(users.result, notificationContent);
                        finalResult[eMedium.Slack] = {
                            success: slackResult.success,
                            error: slackResult.error
                        }
                        break;
                    default:
                        break;
                }
            });
            return {
                status: true,
                result: finalResult
            };
        } catch (error) {
            await new errorLogBLL().logError('sendNotificationBLL', 'sendNotification', error);
            return {
                status: false,
                error: error.message
            };
        }
    }

    async sendNotificationToText(usersArr, notificationContent) {
        try {
            let textResult = {
                 success : [],
                 error : []
                }
            usersArr.forEach(async user => {
                const primaryMobile = user.primary_mobile;
                const secondaryMobile = user.secondary_mobile;

                let result = await this.sendText(user.primary_mobile, notificationContent);
                if(!result.status){
                    result = await this.sendText(user.secondary_mobile, notificationContent);
                }

                if(result.status){
                    await textResult.success.push(result.mobile);
                }
                else{
                    await textResult.error.push(result.mobile);
                }
            })
            
            return textResult;
        } catch (error) {
            await new errorLogBLL().logError('sendNotificationBLL', 'sendNotificationToText', error);
            throw new Error(`Method : sendNotificationToText, Class : sendNotificationBLL, Error : ${error.message}`);
        }
    }

    async sendNotificationToEmail(usersArr, notificationSubject, notificationContent) {
        try {
            let emailResult = {
                success: [],
                error: []
            };
            usersArr.forEach(async user => {
                const email = user.email;
                const result = await this.sendEmail(email, notificationSubject, notificationContent);
                if (result.status) {
                    await emailResult.success.push(result.email);
                }
                else {
                    await emailResult.error.push(result.email);
                }
            })
            return emailResult;
        } catch (error) {
            await new errorLogBLL().logError('sendNotificationBLL', 'sendNotificationToEmail', error);
            throw new Error(`Method : sendNotificationToEmail, Class : sendNotificationBLL, Error : ${error.message}`);
        }
    }

    async sendNotificationToWhatsapp(users, notificationContent) {
        try {
            // will implement later
            return {
                success: [],
                error: []
            }
        } catch (error) {
            await new errorLogBLL().logError('sendNotificationBLL', 'sendNotificationToWhatsapp', error);
            throw new Error(`Method : sendNotificationToWhatsapp, Class : sendNotificationBLL, Error : ${error.message}`);
        }
    }

    async sendNotificationToSlack(users, notificationContent) {
        try {
            // will implement later
            return {
                success: [],
                error: []
            }
        } catch (error) {
            await new errorLogBLL().logError('sendNotificationBLL', 'sendNotificationToSlack', error);
            throw new Error(`Method : sendNotificationToSlack, Class : sendNotificationBLL, Error : ${error.message}`);
        }
    }

    async sendEmail(email, subject, content) {
        try {
            const DOMAIN = process.env.MAIL_DOMAIN;
            const api_key = process.env.MAIL_API_KEY;
            const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
            const data = {
                from: process.env.MAIL_FROM,
                to: email,
                subject: subject,
                text: content
            };
            const res = await mg.messages().send(data)
            const result = {
                status: res?.id ? true : false,
                email: email
            }
            return result;
        } catch (error) {
            await new errorLogBLL().logError('sendNotificationBLL', 'sendEmail', error);
            throw new Error(`Method : sendEmail, Class : sendNotificationBLL, Error : ${error.message}`);
        }
    }

    async sendText(mobile, content){
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        const res = await client.messages.create({
             body: content,
             from: process.env.TWILIO_MOBILE_NUMBER,
             to: mobile
           })
        
        const result = {
            status : res?.sid ? true : false,
            mobile : mobile
        }
        return result;
    }
}

module.exports = sendNotificationBLL;