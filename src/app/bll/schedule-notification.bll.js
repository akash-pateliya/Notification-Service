const { v4: uuid } = require('uuid');
const errorLogBLL = require('./error-log.bll.js');
const sendNotificationBLL = require('./send-notification.bll.js');

class scheduleNotificationBLL {

    async scheduleNotification(usersUidArr, mediumsUidArr, date, time,notificationSubject, notificationContent) {
        try {
            const isValidDate = await this.validateDate(date);
            const isValidTime = await this.validateTime(time);
            if(!isValidDate || !isValidTime){
                return {
                    status : false,
                    error : 'Invalid Date or Time!'
                }
            }
            const givenDate = new Date(date);
            const year = givenDate.getFullYear();
            const month = givenDate.getMonth();
            const date = givenDate.getDate();
            const hours = moment.duration(time).hours();
            const minutes = moment.duration(time).minutes();
            const seconds = moment.duration(time).seconds();

            const schedule = require('node-schedule');
            const dateObj = new Date(year, month, date, hours, minutes, seconds);

            await schedule.scheduleJob(dateObj, function(){
                await new sendNotificationBLL().sendNotification(usersUidArr, mediumsUidArr, notificationSubject, notificationContent);
                return {
                    status : true,
                    result : result
                };
            });
        } catch (error) {
            await new errorLogBLL().logError('scheduleNotificationBLL', 'scheduleNotification', error);
            return {
                status : false,
                error : error.message
            }
        }
    }

    async validateDate(date){
        return moment(date, "MM/DD/YYYY", true).isValid();
    }

    async validateTime(time){
            const isValidTime = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
            return isValidTime;
          }
}



module.exports = scheduleNotificationBLL;