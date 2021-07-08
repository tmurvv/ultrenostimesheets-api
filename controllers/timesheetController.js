const {google} = require("googleapis");
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { gmail } = require("googleapis/build/src/apis/gmail");
const uuid = require('uuid');
const fs = require("fs");
const {Timesheets} = require('../schemas/TimesheetSchema');

function hoursWorked() {
    return 'lots'
}
exports.viewTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheets.find();
        res.status(200).json({
            title: 'ultrenostimesheets | Get All Timesheets',
            status: 'success',
            data: timesheets
        });
    } catch(e) {
        console.log(e.message);
        res.status(500).json({
            title: 'ultrenostimesheets | Get All Timesheets',
            status: 'fail',
            error: e.message
        });
    }
}
exports.viewTimesheetsByUser = async (req, res) => {
    console.log(req.body)
    try {
        const timesheets = await Timesheets.find({userid: req.body.userid});
        
        res.status(200).json({
            title: 'Ultimate Renovations | View Timesheets By User',
            status: 'success',
            num_returned: timesheets.length,
            data: timesheets
        });
    } catch(e) {
        console.log(e.message);
        res.status(500).json({
            title: 'Ultimate Renovations | View Timesheets By User',
            status: 'fail',
            error: e.message
        });
    }


    // // create auth keys instance
    // const auth = new google.auth.GoogleAuth({
    //     keyFile: "credentials.json",
    //     scopes: "https://www.googleapis.com/auth/spreadsheets"
    // });
    // // create client instance
    // const client = await auth.getClient();
    // // create Google Sheets API instance
    // const googleSheets = google.sheets({version: "v4", auth: client});
    // const spreadsheetId = "1eFps1mXC20eUXoHk3qCGxlKvAPwSaDQIa7gild_higc";
    // // Get Timesheets
    // try {
    //     const getRows = await googleSheets.spreadsheets.values.get({
    //         auth,
    //         spreadsheetId,
    //         range: "Timesheets", // from lower tab on sheet in case of multiple sheets in one doc
    //         // range: "Sheet1!A:C" // add !A:C to get only columns A-C       
    //     });
    //     const timesheets = getRows.data.values;
    //     res.status(200).json({
    //         title: 'ultrenostimesheets | Get All Timesheets',
    //         status: 'success',
    //         data: timesheets
    //     });
    // } catch(e) {
    //     console.log(e.message);
    //     res.status(500).json({
    //         title: 'ultrenostimesheets | Get All Timesheets',
    //         status: 'fail',
    //         error: e.message
    //     });
    // }
}
exports.appendTimesheets = async (req, res) => {
    console.log('append timesheets')
    try {
        const addedtimesheet = await Timesheets.create(req.body);
        console.log('addedtimesheet:', addedtimesheet)
        if (!addedtimesheet) throw new Error('Something went wrong on signup.');
        res.status(200).json({
            title: 'Ultimate Renovations Timesheets |  Enter Timesheet',
            status: 'success',
            data: req.body
        });
    } catch(e) {
        console.log(e.message);
        res.status(500).json({
            title: 'Ultimate Renovations Timesheets | Enter Timesheet',
            status: 'fail',
            error: e.message
        });
    }
}
exports.updateTimesheets = async (req, res) => {
    console.log('imin update',req.body)
    //remove id
    
    try {
        const updatedtimesheet = await Timesheets.findByIdAndUpdate(req.body.id, req.body);
        console.log('updatedtimesheet:', updatedtimesheet)
        res.status(200).json({
            title: 'ultrenostimesheets | Update Timesheet',
            status: 'success',
            data: updatedtimesheet
        });
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Timesheet Update',
            status: 'fail',
            error: e.message
        });
    }
}
exports.deleteTimesheets = async (req, res) => {
    console.log(req.body)
    try {
        const delItem = await Timesheets.findByIdAndDelete(req.body.delid);
        if (!delItem) throw new Error('Entry not found.')
        res.status(200).json({
            title: 'ultrenostimesheets | Delete Timesheet',
            status: 'success',
            data: delItem
        });          
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Timesheet Update',
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
        const timesheets = await Timesheets.find({downloaded: true});
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
