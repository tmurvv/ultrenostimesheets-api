const {google} = require("googleapis");
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { gmail } = require("googleapis/build/src/apis/gmail");
const uuid = require('uuid');
const fs = require("fs");
const multer = require('multer');
const {Joblist} = require('../schemas/JoblistSchema');
const {Timesheets} = require('../schemas/TimesheetsSchema');


// const upload = multer({
//     dest: '.tmp', // this saves your file into a directory called "uploads"
//     onError : function(err, next) {
//         console.log('error', err);
//         res.redirect('http://localhost:3006/?success=false');
//     }
// }); 
// app.get('/api/v1/admin/uploadwips', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
// // It's very crucial that the file name matches the name attribute in your html
// app.post('/api/v1/ultrenostimesheets/admin/uploadwips', upload.single('file-to-upload'), (req, res) => {
//     // res.redirect('http://localhost:3006/?success=true');
//     res.redirect('https://ultrenostimesheets.herokuapp.com/?success=true');
// });


// exports.uploadJobList = async (req, res) => {
//     upload.single('file-to-upload')
//     // res.redirect('http://localhost:3006/?success=true');
//     // res.redirect('https://ultrenostimesheets.herokuapp.com/?success=true');
//     // fs.readFile('')
//     //remove id
//     res.status(200).json({
//         title: 'Ultimate Renovations | Upload Job List',
//         status: 'success',
//         // data: updatedtimesheet
//     });
//     // try {
//     //     const updatedtimesheet = await Timesheets.findByIdAndUpdate(req.body.id, req.body);
//     //     console.log('updatedtimesheet:', updatedtimesheet)
//     //     res.status(200).json({
//     //         title: 'ultrenostimesheets | Update Timesheet',
//     //         status: 'success',
//     //         data: updatedtimesheet
//     //     });
//     // } catch(e) {
//     //     console.log(e.message);
//     //     return res.status(500).json({
//     //         title: 'ultrenostimesheets | Timesheet Update',
//     //         status: 'fail',
//     //         error: e.message
//     //     });
//     // }
// }

exports.numTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheets.find({downloaded: false});
        
        res.status(200).json({
            title: 'ultrenostimesheets | Update Timesheet',
            status: 'success',
            numsheets: timesheets.length
        });
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Number of Timesheets',
            status: 'fail',
            error: e.message
        });
    }
}
exports.downloadTimesheets = async (req, res) => {
    function getMinutesWorked(starttime, endtime, lunchtime) {
        // shortcut if endtime before starttime
        if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
        // calculate time worked
        const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
        const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
        // short cut is lunchtime greater than time worked
        if (milliesWorked<=0) return -2;
        //return minutes worked
        return Math.round((milliesWorked/60)/1000);
    }
    function minutesToDigital(minutes) {
        const m = minutes % 60;  
        const h = (minutes-m)/60;   
        const dec = parseInt((m/6)*10, 10);
        return parseFloat(parseInt(h, 10) + '.' + (dec<10?'0':'') + dec);
    }
    function getDateWorked(entry) {
        const entryDate = new Date(entry);
        const month=(entryDate.getMonth()+1)<10?`0${entryDate.getMonth()+1}`:entryDate.getMonth()+1;
        const date=(entryDate.getDate())<10?`0${entryDate.getDate()}`:entryDate.getDate();
        return `${entryDate.getFullYear()}-${month}-${date}`
    }

    try {
        const timesheets = await Timesheets.find({downloaded: false});
        if (!timesheets) throw new Error('No new timesheets to download.')        
        let timesheetcsv = 'First Name, Last Name, Date of Work, Start, Finish, Lunch, Hours Worked, Job Id, Job Name, task, notes\n';

        timesheets.map(sheet=> {
            timesheetcsv=`${timesheetcsv}${sheet.firstname},${sheet.lastname},${getDateWorked(sheet.starttime)},${(new Date(sheet.starttime).getHours())}:${(new Date(sheet.starttime).getMinutes())},${(new Date(sheet.endtime).getHours())}:${(new Date(sheet.endtime).getMinutes())},${sheet.lunchtime},${minutesToDigital(getMinutesWorked(sheet.starttime, sheet.endtime, sheet.lunchtime))},${sheet.jobid},${sheet.jobname},${sheet.task},${sheet.notes}\n`
        })
        // Query and stream
        const data = await JSON.stringify(timesheets);
        const date=new Date();
        const file = `timesheets-${date.getFullYear()}${date.getMonth()+1}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}.csv`;
        fs.writeFile(file, timesheetcsv, ()=>{
            res.download(file);
        })
        try {
            timesheets.map(async sheet=>{
                await Timesheets.findByIdAndUpdate(sheet._id, {downloaded: true});
            });
        } catch (e) {
            throw new Error("Error marking timesheets downloaded");
        }
        res.status(200, {
            status: 'success',
            title: 'Ultimate Renovations | Download Timesheets'
        });   
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Download Timesheets',
            status: 'fail',
            error: e.message
        });
    }
}
