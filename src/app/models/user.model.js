const mongoose = require('mongoose');
const eModel = require('../enum/model.enum');

const SubscribeUserSchema = mongoose.Schema({
    uid: String,
    firstName: String,
    lastName: String,
    email: String,
    primary_mobile: String,
    secondary_mobile: String,
    subscribed_medium_uids: [[String]],
    isDeleted: Boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model(eModel.SubscribeUser, SubscribeUserSchema, eModel.SubscribeUser);