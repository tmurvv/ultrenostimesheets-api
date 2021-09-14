const {google} = require("googleapis");
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { gmail } = require("googleapis/build/src/apis/gmail");
const uuid = require('uuid');
const fs = require("fs");
const {Timesheets} = require('../schemas/TimesheetsSchema');

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
    try {
        // check for overlapping
        const timesheets = await Timesheets.find({userid: req.body.userid});
        if (timesheets.length>0) {
            timesheets.map(sheet => {
                if ((new Date(req.body.starttime).getTime()<sheet.endtime.getTime()&&new Date(req.body.starttime).getTime()>sheet.starttime.getTime())||(new Date(req.body.endtime).getTime()<sheet.endtime.getTime()&&new Date(req.body.endtime).getTime()>sheet.starttime.getTime())) throw Error('Time overlaps with another timesheet.');
            });
        }
        const addedtimesheet = await Timesheets.create(req.body);
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
    //remove id
    try {
        // check for overlapping
        const timesheets = await Timesheets.find({userid: req.body.userid});
        if (timesheets.length>0) {
            timesheets.map(sheet => {
                if ((new Date(req.body.starttime).getTime()<sheet.endtime.getTime()&&new Date(req.body.starttime).getTime()>sheet.starttime.getTime())||(new Date(req.body.endtime).getTime()<sheet.endtime.getTime()&&new Date(req.body.endtime).getTime()>sheet.starttime.getTime())) throw Error('Time overlaps with another timesheet.');
            });
        }
        const updatedtimesheet = await Timesheets.findByIdAndUpdate(req.body.id, req.body);
        res.status(200).json({
            title: 'ultrenostimesheets | Update Timesheet',
            status: 'success',
            data: updatedtimesheet
        });
    } catch(e) {
        console.log(e.message);
        return res.status(400).json({
            title: 'ultrenostimesheets | Timesheet Update',
            status: 'fail',
            error: e.message
        });
    }
}
exports.deleteTimesheets = async (req, res) => {
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


