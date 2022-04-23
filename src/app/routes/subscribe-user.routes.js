module.exports = (app) => {
    const SubscribeUser = require('../controllers/subscribe-user.controller');

    app.post('/subscribe-user', SubscribeUser.subscribe);
}