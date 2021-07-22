const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = "mongodb+srv://tmurvv:caEhq0cvjVtSjatA@cluster0-uf5qd.mongodb.net/ultrenos?retryWrites=true&w=majority";
const {timesheetReminder} = require('../assets/emailTemplates/timesheetReminder');
const {Timesheets} = require('../schemas/TimesheetsSchema');
const {Users} = require('../schemas/UserSchema');

function sendEmails() {
    const today = new Date();
    let userList;
    let timesheetList;

    // TESTING AREA
    mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(
        Users.find()
        .then(function(items) {
            userList=items;
            Timesheets.find()
            // Get timesheets within last 3 business days
            .then(function(timesheets){
                timesheetList=timesheets;
                // filter Timesheets for last three business days
                const recentSheets = [];
                // adjust 3 days ago to 3 BUSINESS days ago
                let threeWorkdayMillies = 3*60*60*24*1000;
                let oneWorkdayMillies = 1*60*60*24*1000;
                if (new Date().getDay()===1) {threeWorkdayMillies=5*60*60*24*1000;oneWorkdayMillies=3*60*60*24*1000}
                if (new Date().getDay()===2) {threeWorkdayMillies=4*60*60*24*1000;oneWorkdayMillies=2*60*60*24*1000}
                // get timesheets entered within the last 3 business days
                timesheetList.map(sheet=>{
                    if (new Date().getTime() - new Date(sheet.timesubmitted).getTime() < threeWorkdayMillies) recentSheets.push(sheet);
                });
                // check if active users have a timesheet in the last 3 business days
                let found; 
                userList.map(user=>{
                    found=false;
                    recentSheets.map(sheet=>{
                        if (sheet.userid === user.email) found=true;
                    });
                    // if no recent timesheet, send email (if one not already sent within the last day)
                    if (!found&&user.reminderLastSent!==undefined&&((new Date().getTime())-(new Date(user.reminderLastSent).getTime())>=oneWorkdayMillies)) {
                        if (timesheetReminder(user)) {
                            // update user field lastReminderSent to today's date
                            Users.findOneAndUpdate({email: user.email}, {reminderLastSent: new Date()})
                            .then(()=>console.log(`Success sending reminder email and updating reminderLastSent for ${user.email}`))
                            .catch(()=>console.log(`Error updating reminderLastSent for ${user.email}`));
                        }
                    }
                });
            })
            .catch((e)=>console.log('error from timesheet fetch', e.message))
        })
        .catch((e)=>console.log('error from user fetch', e.message))
    )
    .catch((e)=>console.log('error with connection', e.message))
};
sendEmails();
