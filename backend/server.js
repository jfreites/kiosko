require('dotenv').config();

var express = require('express'),
	bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cors = require('cors'),
	app = express();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
//var router = express.Router();

// EXPRESS CONFIG
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

var routes = require('./api/routes/paymentRoutes');
routes(app);
//app.use('/', router);

// Start server
app.listen(port, function(){
  console.log('Shopty API server started on port ' + port)
});