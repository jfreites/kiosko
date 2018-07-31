require('dotenv').config();

var express = require('express'),
	bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cors = require('cors'),
	app = express();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
var router = express.Router();

// EXPRESS CONFIG
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

// paypal config
var paypal = require('paypal-rest-sdk');
paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': process.env.PAYPAL_CLIENT_ID,
	'client_secret': process.env.PAYPAL_SECRET
  });

// mailgun config
var domain = 'jonathanfreites.mailgunapp.com';
// var mailcomposer = require('mailcomposer');
var mailgun = require('mailgun-js')({ 
	apiKey: process.env.MAILGUN_API_KEY, 
	domain: domain 
});

// ROUTES
router.post('/charge', function(req, res){

	/*var newCharge = {
		amount: 23500,
		currency: "usd",
		source: req.body.token_from_stripe, // obtained with Stripe.js
		description: req.body.engravingText,
		receipt_email: req.body.email,
		shipping: {
			name: req.body.name,
			address: {
				line1: req.body.address.street,
				city: req.body.address.city,
				state: req.body.address.state,
				postal_code: req.body.address.zip,
				country: 'US'
			}
		}
	};*/

	var createPayment = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://return.url",
			"cancel_url": "http://cancel.url"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "item",
					"sku": "item",
					"price": "15.00",
					"currency": "USD",
					"quantity": 1
				}],
				"shipping_address": {
					"recipient_name": req.body.name,
                    "line1": req.body.address.street,
                    "city": req.body.address.city,
                    "country_code": "US",
                    "postal_code": req.body.address.zip,
                    "state": req.body.address.state
				}
			},
			"amount": {
				"currency": "USD",
				"total": "20.00",
				"details": {
                    "subtotal": "15.00",
                    "tax": "0.00",
                    "shipping": "5.00",
                    "handling_fee": "0.00",
                    "shipping_discount": "0.00",
                    "insurance": "0.00"
                }
			},
			"description": req.body.engravingText,
			"custom": "SEVENSTARS_MX_1234567890"
		}]
	}

	// Paypal charge
	paypal.payment.create(createPayment, function (error, charge) {
		if (error) {
			console.error(error);
			res.json({ error: error, charge: false });
		} else {
			console.log("Create Payment Response");
			console.log(charge);
			res.json({error: false, charge: charge})
		}
	});

	// trigger charge
	/*stripe.charges.create(newCharge, function(err, charge) {
		// send response
		if (err){
			console.error(err);
			res.json({ error: err, charge: false });
		} else {
			// format for email
			var emailTemplate = `Hello ${newCharge.shipping.name}, \n
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
				to: req.body.email,
				subject: 'Bundle of Sticks Receipt - ' + charge.id,
				text: emailTemplate
			};

			// send email to customer
			mailgun.messages().send(emailData);

			emailData['to'] = 'your_support_email@gmail.com';
			emailData['subject'] = `New Order: Bundle of Sticks - ${charge.id}`;

			// send email to supplier
			mailgun.messages().send(emailData);

			// send response with charge data
			res.json({ error: false, charge: charge });
		}
	});*/
});

// get data for charge by id
router.get('/charge/:id', function(req, res){

	paypal.payment.get(req.params.id, function (error, payment) {
		if (error) {
			console.log(error);
			//throw error;
			res.json({ error: err, charge: false });
		} else {
			console.log("Get Payment Response");
			console.log(JSON.stringify(payment));
			res.json({ error: false, charge: payment });
		}
	
	});
});

app.use('/', router);

// Start server
app.listen(port, function(){
  console.log('Server listening on port ' + port)
});