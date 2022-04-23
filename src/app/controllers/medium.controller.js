const { StatusCodes } = require('http-status-codes');
const mediumBLL = require('../bll/medium.bll.js');
const eResponse = require('../enum/response.enum.js');

exports.create = async (req, res) => {
    try {
        if(!req.body?.medium_name) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                message: eResponse.EmptyContent
            });
        }
        const result = await new mediumBLL().insertMedium(req.body);
        if (result.status) {
            res.status(StatusCodes.OK).send(result);
        }
        else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(result);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
};

exports.findAll = async(req, res) => {
    try {
        const result = await new mediumBLL().getAllMedium();
        if (result.status) {
            res.status(StatusCodes.OK).send(result);
        }
        else{
            res.status(StatusCodes.NOT_FOUND).send(result);
        }
        
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
}

exports.findOne = async(req, res) => {
    try {
        const result = await new mediumBLL().getMediumByUid(req.params.uid);
    if (result.status) {
        res.status(StatusCodes.OK).send(result);
    }
    else{
        res.status(StatusCodes.NOT_FOUND).send(result);
    }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
}