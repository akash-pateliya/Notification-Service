const Medium = require('../models/medium.model.js');
const { v4: uuid } = require('uuid');

class mediumBLL {

    async insertMedium(mediumObject) {
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
    }
}

module.exports = mediumBLL;