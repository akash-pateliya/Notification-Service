const mongoose = require('mongoose');
const eModel = require('../enum/model.enum');

const MediumSchema = mongoose.Schema({
    uid: String,
    medium_name: String,
    isDeleted: Boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model(eModel.LibMedium, MediumSchema, eModel.LibMedium);