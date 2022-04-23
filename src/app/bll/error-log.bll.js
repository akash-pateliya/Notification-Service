const ErrorLog = require('../models/error-log.model');
const { v4: uuid } = require('uuid');

class errorLogBLL {

    async logError(methodName, className, errorMessage) {
        try {
            const error = new ErrorLog({
                uid: uuid(),
                class_name: className,
                method_name: methodName,
                error: errorMessage
            });
            await error.save();
        } catch (error) {
            throw new Error(`Method : logError, Class : errorLogBLL, Error : ${error}`);
        }
    }
}

module.exports = errorLogBLL;