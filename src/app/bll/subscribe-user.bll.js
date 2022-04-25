const SubscribeUser = require('../models/user.model');
const { v4: uuid } = require('uuid');
const errorLogBLL = require('./error-log.bll.js');
const mediumBLL = require('./medium.bll');

class subscribeUserBLL {

    async subscribeUser(subscribeUserObject) {
        try {
            let errorArray = [];
            if(!await this.validateEmail(subscribeUserObject.email)){
                errorArray.push('Incorrect Email');
            }

            if (!await this.validateMobileNumber(subscribeUserObject.primary_mobile)) {
                errorArray.push('Incorrect Primary Number');
            }
            
            if (subscribeUserObject?.secondary_mobile && !await this.validateMobileNumber(subscribeUserObject.secondary_mobile)) {
                errorArray.push('Incorrect Secondary Number');
            }
            
            if(errorArray.length > 0){
                return {
                    status : false,
                    error : errorArray
                }
            }
            else{
                subscribeUserObject['subscribed_medium_uids'] = subscribeUserObject?.subscribed_medium_uids?.length > 0 ?
            await this.validateSubscribedMediumUids(subscribeUserObject.subscribed_medium_uids) : [];
                const subscribeUserObj = await this.getUserByEmailAndMobile(subscribeUserObject.email,subscribeUserObject.primary_mobile);
                // check if user is already exists
                if(subscribeUserObj.length > 0){
                    subscribeUserObj[0].firstName = subscribeUserObject?.firstName || null;
                    subscribeUserObj[0].lastName = subscribeUserObject?.lastName || null;
                    subscribeUserObj[0].secondary_mobile = subscribeUserObject?.secondary_mobile || null;
                    subscribeUserObj[0].subscribed_medium_uids = subscribeUserObject.subscribed_medium_uids;
                    const result = await SubscribeUser.findOneAndUpdate({uid : subscribeUserObj[0].uid, isDeleted : false}, subscribeUserObj[0]);
                    return {
                        status : true,
                        result : result
                    }
                }
                else{
                    const user = new SubscribeUser({
                        uid: uuid(),
                        firstName: subscribeUserObject?.firstName || null,
                        lastName: subscribeUserObject?.lastName || null,
                        email: subscribeUserObject.email,
                        primary_mobile: subscribeUserObject.primary_mobile,
                        secondary_mobile: subscribeUserObject?.secondary_mobile || null,
                        subscribed_medium_uids: subscribeUserObject.subscribed_medium_uids,
                        isDeleted: false,
                        createdAt: new Date(),
                        updatedAt: null,
                        deletedAt: null
                    });
                    
                    const result = await user.save();
                    return {
                        status : true,
                        result : result
                    };
                }
            }
        } catch (error) {
            await new errorLogBLL().logError('subscribeUserBLL', 'subscribeUser', error);
            return {
                status : false,
                error : error.message
            };
        }
    }

    async getAllUsersByUids(usersUidsArr){
        try {
            const result = await SubscribeUser.find({ uid: { "$in" : usersUidsArr} });
            return {
                status : true,
                result : result
            };
        } catch (error) {
            await new errorLogBLL().logError('subscribeUserBLL', 'getAllUsers', error);
            return {
                status : false,
                error : error.message
            }
        }
    }

    async getUserByEmailAndMobile(email, mobile){
        try {
            const result = await SubscribeUser.find({email:email, primary_mobile: mobile});
            return result;
        } catch (error) {
            await new errorLogBLL().logError('subscribeUserBLL', 'getUserByEmailAndMobile', error);
            throw new Error(`Method : getUserByEmailAndMobile, Class : subscribeUserBLL, Error : ${error.message}`);
        }
    }

    async validateEmail(email){
        try {
            const mail = /\S+@\S+\.\S+/;
            return mail.test(email);
        } catch (error) {
            await new errorLogBLL().logError('subscribeUserBLL', 'validateEmail', error);
            throw new Error(`Method : validateEmail, Class : subscribeUserBLL, Error : ${error.message}`);
        }
    }

    async validateMobileNumber(mobileNumberStr){
        try {
            const mobile = /^\d{10}$/;
            return mobile.test(mobileNumberStr);
        } catch (error) {
            await new errorLogBLL().logError('subscribeUserBLL', 'validateEvalidateMobileNumbermail', error);
            throw new Error(`Method : validateMobileNumber, Class : subscribeUserBLL, Error : ${error.message}`);
        }
    }

    async validateSubscribedMediumUids(SubscribedMediumUids){
        try {
            let validSubscribedMediumUids = [];
            let mediumUids = await new mediumBLL().getAllMedium();
            mediumUids = await mediumUids.result.filter(data => data.isDeleted == false).map(result => result.uid);
            SubscribedMediumUids.forEach(async element => {
                if(mediumUids.indexOf(element) >= 0){
                    await validSubscribedMediumUids.push(element);
                }
            });
            return validSubscribedMediumUids;
        } catch (error) {
            await new errorLogBLL().logError('subscribeUserBLL', 'validateSubscribedMediumUids', error);
            throw new Error(`Method : validateSubscribedMediumUids, Class : subscribeUserBLL, Error : ${error.message}`);
        }
    }
}

module.exports = subscribeUserBLL;