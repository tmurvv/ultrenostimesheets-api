const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = "mongodb+srv://tmurvv:caEhq0cvjVtSjatA@cluster0-uf5qd.mongodb.net/ultrenos?retryWrites=true&w=majority";
const {timesheetReminder} = require('../assets/emailTemplates/timesheetReminder');
const {Timesheets} = require('../schemas/TimesheetsSchema');
const {Users} = require('../schemas/UserSchema');

(async function sendEmails() {
    // initiate variables
    let userList;
    let timesheetList;
    // create connection
    try {
        await mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('connection established')
    } catch (e) {
        console.log('error establishing connection', e.message);
    }
    // get users
    try {
        userList = await Users.find();
        console.log('userList:', userList.length)
    } catch (e) {
        console.log('error fetching users', e.message);
    }
    // get timesheets
    try {
        timesheetList = await Timesheets.find();
        console.log('timesheetList:', timesheetList.length)
    } catch (e) {
        console.log('error fetching users', e.message);
    }
    // filter Timesheets for last three business days
    const recentSheets = [];
    // adjust 1 and 3 days ago to 1 and 3 BUSINESS days ago
    let threeWorkdayMillies = 3*60*60*24*1000;
    let oneWorkdayMillies = 1*60*60*24*1000;
    if (new Date().getDay()===1) {threeWorkdayMillies=5*60*60*24*1000;oneWorkdayMillies=3*60*60*24*1000}
    if (new Date().getDay()===2) {threeWorkdayMillies=4*60*60*24*1000;oneWorkdayMillies=2*60*60*24*1000}
    // filter for timesheets entered within the last 3 business days
    timesheetList.map(sheet=>{
        if (new Date().getTime() - new Date(sheet.timesubmitted).getTime() < threeWorkdayMillies) recentSheets.push(sheet);
    });
    // check if active users have a timesheet in the last 3 business days
    let found; 
    let updated=[];
    userList.map(user=>{
        found=false;
        if (user.email!=='admin@admin.com') {
            // check for recent timesheet
            recentSheets.map(sheet=>{
                if (sheet.userid === user.email) found=true; updated.push(user._id);
            });
            // if not found, send timesheet reminder email
            if (!found&&user.reminderLastSent!==undefined&&((new Date().getTime())-(new Date(user.reminderLastSent).getTime())>=oneWorkdayMillies)) timesheetReminder(user);
        }
    });
    // if user sent reminder email, update user.reminderLastSent to today's date
    try {
        await Users.updateMany(
            { _id: { $in: updated } }, 
            { $set: { reminderLastSent: new Date() } }, 
            console.log(`Success sending reminder email and updating reminderLastSent.`)
        );
    } catch (e) {
        console.log(`Error updating reminderLastSent. ${e.message}`);
    }
    // close connection
    mongoose.connection.close();
})();
