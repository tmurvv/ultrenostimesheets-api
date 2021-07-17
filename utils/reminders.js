const { timesheetReminder } = require('../assets/emailTemplates/timesheetReminder');
const {Timesheets} = require('../schemas/TimesheetsSchema');
const {Users} = require('../schemas/UserSchema');

function sendEmails() {
    console.log('00000000000000000000000000000000000000000');
    const today = new Date();
    // if (today.getDay()>0&&today.getDay()<7) {
        console.log('outside try')
        Users
            .find()
            .then(function(items) {console.log('FOUND'); console.log(items[0]);})
            .catch(function(err) {console.log('oops', err.message)});
        // const userList = Users.find().then(()=>console.log('after await userList:', userList))
        // try {
        //     console.log('inside try')
        //     // get users and timesheets
        //     const userList = await Users.find();
        //     console.log('after await userList:', userList)
        //     const timesheetList = await Timesheets.find();
        //     // filter Timesheets for last three business days
        //     const recentSheets = [];
        //     // adjust 3 days ago to 3 business days ago
        //     let workdayMillies = 3*60*60*24*1000;
        //     if (new Date().getDay()===1) workdayMillies=5*60*60*24*1000;
        //     if (new Date().getDay()===2) workdayMillies=4*60*60*24*1000;
        //     console.log('workdayMillies:', workdayMillies)
        //     // get timesheets entered within the last 3 business days
        //     timesheetList.map(sheet=>{
        //         if (new Date().getTime() - new Date(sheet.timesubmitted).getTime() < workdayMillies) recentSheets.push(sheet);
        //     });
        //     // check if active users have a timesheet in the last 3 business days
        //     let found;
        //     userList.map(async user=>{
        //         console.log('1111111111111111111111111111111111')
        //         found=false;
        //         recentSheets.map(sheet=>{
        //             if (sheet.userid === user.email) found=true;
        //         });
        //         // send email if one not sent within the last day
        //         // if (!found&&user.reminderLastSent!==undefined&&(new Date().getTime())-(new Date(user.reminderLastSent).getTime())>=86400000) {
        //         if (user.email==='tmurv@shaw.ca') {
        //             console.log('2222222222222222222222222222222222222222222')
        //             if (timesheetReminder(user)) await Users.findOneAndUpdate({email: user.email}, {reminderLastSent: new Date()});
        //         }
        //     });
    
        // } catch (e) {
        //     // this should catch all exceptions
        // }
    // }   
};
sendEmails();