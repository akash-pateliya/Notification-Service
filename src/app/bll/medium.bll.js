const Medium = require('../models/medium.model.js');
const { v4: uuid } = require('uuid');
const errorLogBLL = require('./error-log.bll.js');

class mediumBLL {

    async insertMedium(mediumObject) {
        try {
            const medium = new Medium({
                uid: uuid(),
                medium_name: mediumObject.medium_name,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null
            });
            
            const result = await medium.save();
            return {
                status : true,
                result : result
            };
        } catch (error) {
            await new errorLogBLL().logError('mediumBLL', 'insertMedium', error);
            return {
                status : false,
                error : error.message
            }
        }
    }

    async getAllMedium(){
        try {
            const result = await Medium.find();
            return {
                status : true,
                result : result
            };
        } catch (error) {
            await new errorLogBLL().logError('mediumBLL', 'getAllMedium', error);
            return {
                status : false,
                error : error.message
            }
        }
    }

    async getMediumByUid(uuid) {
        try {
            const result = await Medium.findOne({ uid: uuid });
            return {
                status : true,
                result : result
            };
        } catch (error) {
            await new errorLogBLL().logError('mediumBLL', 'getMediumByUid', error);
            return {
                status : false,
                error : error.message
            }
        }
    }
}

module.exports = mediumBLL;