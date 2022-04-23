const Medium = require('../models/medium.model.js');
const { v4: uuid } = require('uuid');
const errorLogBLL = require('./error-log.bll.js');

class mediumBLL {

    async insertMedium(mediumObject) {
        try {
            const medium = new Medium({
                uid: uuid(),
                medium_name: mediumObject.medium_name,
                isDeleted: true,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null
            });
            
            const result = await medium.save();
            return result;
        } catch (error) {
            await new errorLogBLL().logError('mediumBLL', 'insertMedium', error);
            throw new Error(`Method : insertMedium, Class : mediumBLL, Error : ${error}`);
        }
    }
}

module.exports = mediumBLL;