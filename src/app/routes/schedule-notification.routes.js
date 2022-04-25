module.exports = (app) => {
    const scheduleNotification = require('../controllers/schedule-notification.controller');

    app.post('/schedule-notification', scheduleNotification.scheduleNotification);
}