const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const util = require("util");
const btoa = require('btoa');

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
const {Tasklist} = require('./schemas/TasklistSchema');
const { json } = require('body-parser');

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

const upload = multer({
    dest: './tmp', // this saves your file into a directory called "uploads"
    onError : function(err, next) {
        console.log('error', err);
        if (process.env.NODE_ENV==='local') res.redirect(`${process.env.FE_LOCAL}/?success=false`);
        if (process.env.NODE_ENV==='staging') res.redirect(`${process.env.FE_STAGING}/?success=false`);
        if (process.env.NODE_ENV==='production') res.redirect(`${process.env.FE}/?success=false`);
    }
});
// JOB LIST Uploads not working in controller files Be sure the file name matches the name attribute in your html
app.post('/api/v1/ultrenostimesheets/admin/uploadjoblist', upload.single('file-to-upload'), async (req, res) => {
    upload.single('file-to-upload')
    const filename=req.file.filename;
    function readTextFile(file) {
        var content;
        fs.readFile(path.join(__dirname, "tmp", filename), 'utf8', async function (err, data) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            content = util.format(data,'');
            var contentArray = content.split('\n');
            await Joblist.updateMany({current: true, current: false})
            for (const item of contentArray) {
                try {
                    if (item.indexOf('\t')>0) {
                        const appendItem = {jobid: item.split('\t')[0], jobname: (item.split('\t')[1])&&(item.split('\t')[1]).replace('\r',''), current: true};
                        await Joblist.create(appendItem);
                    } else if(item.indexOf(' ')>0) {
                        const appendItem = {jobid: item.split(' ')[0], jobname: (item.split(' ')[1])&&(item.split(' ')[1]).replace('\r',''), current: true};
                        await Joblist.create(appendItem);
                    } else {
                        // continue
                    }
                } catch(e) {
                    console.log('error on create', e.message)
                }                 
            }
        });
    }
     
    readTextFile(`download/${filename}`);
    //remove id 
    if (process.env.NODE_ENV==='local') res.redirect(`${process.env.FE_LOCAL}/?success=true&user=${btoa(req.body.user)}`);
    if (process.env.NODE_ENV==='staging') res.redirect(`${process.env.FE_STAGING}/?success=true&user=${btoa(req.body.user)}`);
    if (process.env.NODE_ENV==='production') res.redirect(`${process.env.FE}/?success=true&user=${btoa(req.body.user)}`);
});
// TASK LIST - Uploads not working in controller files. Be sure the file name matches the name attribute in your html
app.post('/api/v1/ultrenostimesheets/admin/uploadtasklist', upload.single('file-to-upload'), async (req, res) => {
    upload.single('file-to-upload')
    const user = await JSON.parse(req.body.user);
    const filename=req.file.filename;
    function readTextFile(file) {
        var content;
        fs.readFile(path.join(__dirname, "tmp", filename), 'utf8', async function (err, data) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            content = util.format(data,'');
            var contentArray = content.split('\n');
            await Tasklist.updateMany({current: true, current: false})
            for (const item of contentArray) {
                const appendItem = {task: item.replace('\r',''), current: true};
                try {
                    await Tasklist.create(appendItem);
                } catch(e) {
                    console.log('error on create', e.message)
                }  
            }
        });
    }
     
    readTextFile(`download/${filename}`);
    
    if (process.env.NODE_ENV==='local') res.redirect(`${process.env.FE_LOCAL}/?success=true&user=${btoa(req.body.user)}`);
    if (process.env.NODE_ENV==='staging') res.redirect(`${process.env.FE_STAGING}/?success=true&user=${btoa(req.body.user)}`);
    if (process.env.NODE_ENV==='production') res.redirect(`${process.env.FE}/?success=true&user=${btoa(req.body.user)}`);
});

//Router 
app.use('/api/v1/ultrenostimesheets', timesheetRouter);
app.use('/api/v1/ultrenostimesheets/supportlists', supportListRouter);
app.use('/api/v1/ultrenostimesheets/users', userRouter);
app.use('/api/v1/ultrenostimesheets/admin', adminRouter);

// Catch invalid routes
app.all('*', (req,res,next) => {
    next(console.log(`Web address not found.`, 404));
});

/************ 
*Connect DB
*************/
let DB;
if (process.env.NODE_ENV==='production') DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
// staging uses portfolio db
if (process.env.NODE_ENV==='staging') DB = process.env.DATABASE_STAGING.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
// local uses portfolio db
if (process.env.NODE_ENV==='local') DB = process.env.DATABASE_STAGING.replace(
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
    .then(() => console.log(`DB connection successful. Mode: ${process.env.NODE_ENV}. DB: ${DB}`))
    .catch(() => console.log(`DB NOT CONNECTING. PLEASE CHECK NETWORK. Mode: ${process.env.NODE_ENV}. DB: ${DB} `));

let port;

if (process.env.NODE_ENV==='staging') {
    port = 7051
} else {
    port = process.env.PORT || 7050;
}
app.listen(port, (req, res) => console.log(`server running on port ${port}`));
