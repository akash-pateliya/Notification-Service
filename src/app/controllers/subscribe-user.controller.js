const { StatusCodes } = require('http-status-codes');
const subscribeUserBLL = require('../bll/subscribe-user.bll');
const eErrorMessage = require('../enum/error-message.enum');

exports.subscribe = async (req, res) => {
    try {
        if(!Object.keys(req.body).length) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                message: eErrorMessage.EmptyContent
            });
        }

        if(Boolean(!req.body?.email) || Boolean(!req.body?.primary_mobile)){
            return res.status(StatusCodes.BAD_REQUEST).send({
                message: eErrorMessage.EmailOrPrimaryNumberIsRequired
            })
        }
        const result = await new subscribeUserBLL().subscribeUser(req.body);
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