// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  // to allow scraping of webstores with invalid ssl
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const util = require("util");


// security
// const EventEmitter = require('events');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');
// const xss = require('xss-clean');
// const hpp = require('hpp');
// const helmet = require('helmet');
const express = require('express');
const multer = require('multer');

// internal
const timesheetRouter = require('./routes/timesheetRoutes');
const supportListRouter = require('./routes/supportListRoutes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const {Joblist} = require('./schemas/JoblistSchema');

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

//utilities ** see commented code below
app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({extended: true}));

const writefile = util.promisify(fs.writeFile);

const upload = multer({
    dest: '/app/uploads', // this saves your file into a directory called "uploads"
    onError : function(err, next) {
        console.log('error', err);
        // res.redirect('http://localhost:3006/?success=false');
        res.redirect('https://ultrenostimesheets.herokuapp.com/?success=false');
    }
}); 
// app.get('/api/v1/admin/uploadjoblist', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
// Be sure the file name matches the name attribute in your html
app.post('/api/v1/ultrenostimesheets/admin/uploadjoblist', upload.single('file-to-upload'), async (req, res) => {
    console.log('inupload')
    upload.single('file-to-upload')
    
    const filename=req.file.filename;
    function readTextFile(file) {
        var content;
        fs.readFile(path.join(__dirname, "uploads", filename), 'utf8', async function (err, data) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            content = util.format(data,'');
            var contentArray = content.split('\n');
            await Joblist.updateMany({current: true, current: false})
            console.log('here')
            for (const item of contentArray) {
                
                const appendItem = {jobid: item.split('\t')[0], jobname: (item.split('\t')[1])&&(item.split('\t')[1]).replace('\r',''), current: true};
                console.log('appendItem:', appendItem)
                try {
                    await Joblist.create(appendItem);
                } catch(e) {
                    console.log('error on create', e.message)
                }
                  
            }
        });
    }
     
    readTextFile(`download/${filename}`);
    // fs.readFile('')
    //remove id 
    // res.redirect('http://localhost:3006/?success=true');
    res.redirect('https://ultrenostimesheets.herokuapp.com/?success=true');
});

//Router 
app.use('/api/v1/ultrenostimesheets', timesheetRouter);
app.use('/api/v1/ultrenostimesheets/supportlists', supportListRouter);
app.use('/api/v1/ultrenostimesheets/users', userRouter);
app.use('/api/v1/ultrenostimesheets/admin', adminRouter);
// app.post('/api/v1/ultrenostimesheets/users/signup', async (req, res) => {
//     console.log('insignup', req.body)
//     // // const saltRounds=10;
//     // // const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
//     // const user = Object.assign({ 
//     //     contactId: uuid(), 
//     //     firstname: req.body.firstname, 
//     //     lastname: req.body.lastname, 
//     //     emailphone: req.body.emailphone,
//     //     password: req.body.password,
//     //     _date_created: Date.now(),
//     //     passwordChangedAt: req.body.passwordChangedAt
//     // });
//     // try {
//     //     const addeduser = await Users.create(user);

//     //     // createSendToken(addeduser, 201, res);
        
//     // } catch (e) {
//     //     res.status(500).json({
//     //         title: 'Ultimate Renovations | Signup',
//     //         status: 'fail',
//     //         data: {
//     //             message: e.message
//     //         }
//     //     });
//     // }
//     res.status(200).json({
//         title: 'signup',
//         status: 'success'
//     });
// });

// //parser for pug
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Catch invalid routes
app.all('*', (req,res,next) => {
    next(console.log(`Web address 'take2tech.herokuapp.com${req.originalUrl}' not found. Please see take2tech-api docs for valid addresses.`, 404));
});

// app.use(globalErrorHandler);


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

/************ 
*Connect DB
*************/
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
// const DEVDB = process.env.DEV_DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DEV_DATABASE_PASSWORD
// );

// const PORTDB = process.env.PORTFOLIO_DATABASE.replace(
//     '<PASSWORD>',
//     process.env.PORTFOLIO_DATABASE_PASSWORD
// );

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log("server running"));
