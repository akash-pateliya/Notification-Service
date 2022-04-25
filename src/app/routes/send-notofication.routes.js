module.exports = (app) => {
    const SendNotification = require('../controllers/send-notification.controller');

    app.post('/send-notification', SendNotification.sendNotification);
}