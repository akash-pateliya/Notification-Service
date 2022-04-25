const { StatusCodes } = require('http-status-codes');
const sendNotificationBLL = require('../bll/send-notification.bll');
const eErrorMessage = require('../enum/error-message.enum');

exports.sendNotification = async (req, res) => {
    try {
        if(!Object.keys(req.body).length) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                message: eErrorMessage.EmptyContent
            });
        }

        if(Boolean(!req.body?.users) || req.body.users?.length == 0 || Boolean(!req.body?.mediums) || req.body.mediums?.length == 0){
            return res.status(StatusCodes.BAD_REQUEST).send({
                message: eErrorMessage.UsersAndMediumCanNotBeEmpty
            })
        }
        const result = await new sendNotificationBLL().sendNotification(req.body.users, req.body.mediums, req.body?.notificationSubject,req.body?.notificationContent);
        if (result.status) {
            return res.status(StatusCodes.OK).send(result);
        }
        else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(result);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
};