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
        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
};