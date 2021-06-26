// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  // to allow scraping of webstores with invalid ssl
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

// security
// const EventEmitter = require('events');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');
// const xss = require('xss-clean');
// const hpp = require('hpp');
// const helmet = require('helmet');
const express = require('express');

// internal
const viewRouter = require('./routes/viewRoutes');
const timesheetRouter = require('./routes/timesheetRoutes');
const supportListRouter = require('./routes/supportListRoutes');

// program setup
const app = express();
// const emitter = new EventEmitter;
// emitter.setMaxListeners(50);

//security setup ** see commented code below
// app.use(helmet());
// app.use(xss());
// app.use(hpp());
// app.use('/api', rateLimit.apply({
//     max: 300,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many requests from this IP, please try again in an hour.'
// }));

//CORS
app.use(cors());
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

//Serve static image files
express.static('assets');
app.use(express.static('img'));
app.use(express.static(".")); // put in for Stripe test

//utilities ** see commented code below
app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({extended: true}));


//Router
app.use('/', viewRouter); 
app.use('/api/v1/ultrenostimesheets', timesheetRouter);
app.use('/api/v1/ultrenostimesheets/supportlists', supportListRouter);

//parser for pug
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Catch invalid routes
app.all('*', (req,res,next) => {
    next(console.log(`Web address 'findaharp-api${req.originalUrl}' not found. Please see findaharp-api docs for valid addresses.`, 404));
});

// app.use(globalErrorHandler);

module.exports = app;




































// const express = require("express");
// const cors = require('cors');



// // create application/x-www-form-urlencoded parser
// const timesheetRouter = require('./routes/timesheetRoutes');
// const supportListRouter = require('./routes/supportListRoutes');

// const app = express();

// //CORS
// app.use(cors());
// app.all('/', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next()
// });

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
  
// //   app.get('/', function(req, res, next) {
// //     // Handle the get for this route
// //   });
  
// //   app.post('/', function(req, res, next) {
// //    // Handle the post for this route
// //   });


// // console.log(req.body)


const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log("server running"));
