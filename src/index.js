const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/mongo.db');
const eSuccessMessage = require('./app/enum/success-message.enum'); 
const eErrorMessage = require('./app/enum/error-message.enum');
require('dotenv').config()

// create express app
const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(eSuccessMessage.DbSuccessMessage);
}).catch(err => {
    console.log(eErrorMessage.DbErrorMessage, err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Notification Service. Send and schedule notification quickly."});
});

require('./app/routes/medium.routes.js')(app);
require('./app/routes/subscribe-user.routes')(app);
require('./app/routes/send-notofication.routes')(app);
require('./app/routes/schedule-notification.routes')(app);

// listen for requests
app.listen(process.env.NODE_PORT, () => {
    console.log("Server is listening on port ",process.env.NODE_PORT);
});