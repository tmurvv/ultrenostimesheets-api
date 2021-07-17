const { timesheetReminder } = require('../assets/emailTemplates/timesheetReminder');
const {Timesheets} = require('../schemas/TimesheetsSchema');
const {Users} = require('../schemas/UserSchema');

function sendEmails() {
    const today = new Date();
    let userList;
    let timesheetList;
    // Heroku Scheduler not running async await portions of code so promises used instead
    if (today.getDay()>0&&today.getDay()<6) {
        // Get Users
        Users
            .find()
            .then(function(items) {
                userList=items;
                const sheets = Timesheets.find()
                // Get timesheets within last 3 business days
                .then(function(timesheets){
                    timesheetList=timesheets;
                    // filter Timesheets for last three business days
                    const recentSheets = [];
                    // adjust 3 days ago to 3 BUSINESS days ago
                    let workdayMillies = 3*60*60*24*1000;
                    if (new Date().getDay()===1) workdayMillies=5*60*60*24*1000;
                    if (new Date().getDay()===2) workdayMillies=4*60*60*24*1000;
                    // get timesheets entered within the last 3 business days
                    timesheetList.map(sheet=>{
                        if (new Date().getTime() - new Date(sheet.timesubmitted).getTime() < workdayMillies) recentSheets.push(sheet);
                    });
                    // check if active users have a timesheet in the last 3 business days
                    let found; 
                    userList.map(async user=>{
                        found=false;
                        recentSheets.map(sheet=>{
                            if (sheet.userid === user.email) found=true;
                        });
                        // if no recent timesheet, send email (if one not already sent within the last day)
                        if (!found&&user.reminderLastSent!==undefined&&(new Date().getTime())-(new Date(user.reminderLastSent).getTime())>=86400000) {
                            if (timesheetReminder(user)) {
                                // update user field lastReminderSent to today's date
                                Users.findOneAndUpdate({email: user.email}, {reminderLastSent: new Date()})
                                .then(()=>console.log(`Success sending reminder email and updating reminderLastSent for ${user.email}`))
                                .catch(()=>console.log(`Error updating reminderLastSent for ${user.email}`));
                            }
                        }
                    });
                });
            })
            .catch(function(err) {
                console.log('Error sending reminder email', err.message);
            });
    }
};
sendEmails();
