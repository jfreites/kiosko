/*var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks');*/

// paypal config
var paypal = require('paypal-rest-sdk');
paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': process.env.PAYPAL_CLIENT_ID,
	'client_secret': process.env.PAYPAL_SECRET
  });

// mailgun config
var domain = process.env.MAILGUN_DOMAIN;
// var mailcomposer = require('mailcomposer');
var mailgun = require('mailgun-js')({ 
	apiKey: process.env.MAILGUN_API_KEY, 
	domain: domain 
});

exports.create_payment = function(req, res) {
    //console.log(req.body);
    var createPayment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "transactions": [
            {
                "amount": {
                    "total": "20.00",
                    "currency": "USD",
                    "details": {
                        "subtotal": "15.00",
                        "tax": "0.00",
                        "shipping": "5.00",
                        "handling_fee": "0.00",
                        "shipping_discount": "0.00",
                        "insurance": "0.00"
                    }
                },
                "description": "The payment transaction description.",
                "custom": "STORE_MX_1234567890",
                "invoice_number": "48787589673",
                "item_list": {
                    "items": [
                        {
                            "name": "super product",
                            "sku": "item-1",
                            "price": "15.00",
                            "currency": "USD",
                            "quantity": 1
                        }
                    ],
                    "shipping_address": {
                        "recipient_name": req.body.name,
                        "line1": req.body.address.street,
                        "line2": "N/A",
                        "city": req.body.address.city,
                        "country_code": "MX",
                        "postal_code": req.body.address.zip,
                        "phone": "+525566319658",
                        "state": req.body.address.state
                    }
                }
            }
        ],
        "note_to_payer": "Contact us for any questions on your order.",
        "redirect_urls": {
            "return_url": "http://return.url",
            "cancel_url": "http://cancel.url"
        }
    }

	// Paypal charge
    console.log("Create Payment Response");
	paypal.payment.create(createPayment, function (error, charge) {
		if (error) {
			console.error(error);
			res.json({ error: error, charge: false });
		} else {
            console.log(charge);
            sendEmail(createPayment, charge, req.body.email)
			res.json({error: false, charge: charge})
		}
    });
}

function sendEmail(newCharge, charge, email) {
    console.log('Simulated email sending to ' + email)
    // format for email
	/*var emailTemplate = `Hello ${newCharge.shipping.name}, \n
            Congratulations on ordering a hand picked Bundle of Sticks! \n
            Engraving: ${newCharge.description} \n
            Shipping Info: ${newCharge.shipping.address.line1}, ${newCharge.shipping.address.city}, ${newCharge.shipping.address.state} ${newCharge.shipping.address.postal_code} \n
            Amount: ${newCharge.amount} \n
            Your full order details are available at stickly.io/#/order-complete/${charge.id} \n
            For questions contact your_support_email@gmail.com \n 
            Thank you!`;
        // compose email
    var emailData = {
        from: 'Your Name <your_support_email@gmail.com>',
        to: email,
        subject: 'Bundle of Sticks Receipt - ' + charge.id,
        text: emailTemplate
    };

    // send email to customer
    mailgun.messages().send(emailData);

    emailData['to'] = 'your_support_email@gmail.com';
    emailData['subject'] = `New Order: Bundle of Sticks - ${charge.id}`;

    // send email to supplier
    return mailgun.messages().send(emailData);*/
}

exports.read_payment = function(req, res) {
    paypal.payment.get(req.params.id, function (error, payment) {
		if (error) {
			console.log(error);
			res.json({ error: error, charge: false });
		} else {
			console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
			res.json({ error: false, charge: payment });
		}
	
	});
};