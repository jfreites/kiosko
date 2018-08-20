'use strict';

module.exports = function(app) {
    var payment = require('../controllers/paymentController');

    app.route('/charge')
        .post(payment.create_payment);

    app.route('/charge/:id')
        .get(payment.read_payment);
}