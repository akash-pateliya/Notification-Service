module.exports = (app) => {
    const medium = require('../controllers/medium.controller.js');

    app.post('/add-medium', medium.create);
    app.get('/get-medium', medium.findAll);
    app.get('/get-medium/:uid', medium.findOne);
}