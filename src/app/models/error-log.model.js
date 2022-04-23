const mongoose = require('mongoose');
const eModel = require('../enum/model.enum');

const ErrorLogSchema = mongoose.Schema({
    uid: String,
    class_name: String,
    method_name: String,
    error: String,
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model(eModel.ErrorLog, ErrorLogSchema, eModel.ErrorLog);