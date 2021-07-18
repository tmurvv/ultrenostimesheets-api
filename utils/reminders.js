const { timesheetReminder } = require('../assets/emailTemplates/timesheetReminder');
const {Timesheets} = require('../schemas/TimesheetsSchema');
const {Users} = require('../schemas/UserSchema');

function sendEmails() {
    console.log('in sendEmails')
    const today = new Date();
    let userList;
    let timesheetList;
    // Heroku Scheduler not running async await portions of code so promises used instead
    // if (today.getDay()>0&&today.getDay()<6) {
        // Get Users
        Users.find()
            .then(function(items) {
                console.log('items (users):', items.length)
                userList=items;
                const sheets = Timesheets.find()
                // Get timesheets within last 3 business days
                .then(function(timesheets){
                    console.log('timesheets:', timesheets.length)
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
                    userList.map(async user=>{
                        found=false;
                        recentSheets.map(sheet=>{
                            // console.log('recent sheets map', sheet.userid, user.email)
                            if (sheet.userid === user.email) {found=true;}
                        });
                        if (user.email==='tisha@findaharp.com'&&user.reminderLastSent!==undefined) console.log('NOT FOUND', user.email);
                        if (user.email==='tisha@findaharp.com'&&user.reminderLastSent!==undefined) console.log(new Date().getTime());
                        if (user.email==='tisha@findaharp.com'&&user.reminderLastSent!==undefined) console.log(user.reminderLastSent);
                        if (user.email==='tisha@findaharp.com'&&user.reminderLastSent!==undefined) console.log(new Date(user.reminderLastSent).getTime());
                        if (user.email==='tisha@findaharp.com'&&user.reminderLastSent!==undefined) console.log((new Date().getTime())-(new Date(user.reminderLastSent).getTime()), oneWorkdayMillies);
                        // if no recent timesheet, send email (if one not already sent within the last day)
                        // if (!found&&user.reminderLastSent!==undefined&&((new Date().getTime())-(new Date(user.reminderLastSent).getTime())>=oneWorkdayMillies)) {
                        if (user.email==='tisha@findaharp.com'&&user.reminderLastSent!==undefined&&((new Date().getTime())-(new Date(user.reminderLastSent).getTime())>=oneWorkdayMillies)) {
                            if (timesheetReminder(user)) {
                                console.log('timesheetreminder success', user.email);
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
    // }
};
sendEmails();
