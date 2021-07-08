const {google} = require("googleapis");
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { gmail } = require("googleapis/build/src/apis/gmail");
const uuid = require('uuid');
const fs = require("fs");

const {Timesheets} = require('../schemas/TimesheetSchema');

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
    
    
    // const newValues = req.body;
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
    
    // // Append
    // try {
    //     await googleSheets.spreadsheets.values.append({
    //         auth,
    //         spreadsheetId,
    //         range: "Timesheets",
    //         valueInputOption: "USER_ENTERED",
    //         // required valueInputOptions: RAW-whatever input is there, USER_ENTERED-tries to type it, so a date becomes a date type
    //         resource: {
    //             values: [
    //                 [
    //                     newValues[0],
    //                     newValues[1],
    //                     newValues[2],
    //                     newValues[3],
    //                     newValues[4],
    //                     newValues[5],
    //                     newValues[6],
    //                     newValues[7],
    //                     newValues[8],
    //                     newValues[9], 
    //                     newValues[10], 
    //                     newValues[11],
    //                     newValues[12]
    //                 ]
    //             ]
    //         }
    //     });
    //     res.status(200).json({
    //         title: 'ultrenostimesheets | Post Timesheet',
    //         status: 'success'
    //     });
    // } catch(e) {
    //     console.log(e.message);
    //     res.status(500).json({
    //         title: 'ultrenostimesheets | Post Timesheet',
    //         status: 'fail',
    //         error: e.message
    //     });
    // }
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
    console.log('in download timesheets')
    
    try {
        const timesheets = await Timesheets.find({downloaded: false});
        if (!timesheets) throw new Error('No new timesheets to download.')
        
        let timesheetcsv = '';

        timesheets.map(sheet=> {
            timesheetcsv=`${timesheetcsv}${sheet.firstname},${sheet.lastname},${sheet.jobname}\n`
        })
        console.log('timesheetcsv:', timesheetcsv)
        // Query and stream
        // const data = await JSON.stringify(timesheets);
        fs.writeFile('timesheets2.csv', timesheetcsv, function (err) {
            if (err) return console.log("here err", err);
            console.log('success?')
        })
        console.log('here')
        const file = `timesheets2.csv`;
        
        console.log('file here:', file)
        res.download(file); // Set disposition and send it.
        // res.status(200).json({
        //     title: 'ultrenostimesheets | Delete Timesheet',
        //     status: 'success',
        //     timesheets
        // });          
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Download Timesheets',
            status: 'fail',
            error: e.message
        });
    }
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