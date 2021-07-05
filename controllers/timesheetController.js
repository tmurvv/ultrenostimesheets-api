const {google} = require("googleapis");
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { gmail } = require("googleapis/build/src/apis/gmail");
const uuid = require('uuid');

exports.viewTimesheets = async (req, res) => {
    
    // create auth keys instance
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    // create client instance
    const client = await auth.getClient();
    // create Google Sheets API instance
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "1eFps1mXC20eUXoHk3qCGxlKvAPwSaDQIa7gild_higc";
    // Get Timesheets
    try {
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Timesheets", // from lower tab on sheet in case of multiple sheets in one doc
            // range: "Sheet1!A:C" // add !A:C to get only columns A-C       
        });
        const timesheets = getRows.data.values;
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
exports.appendTimesheets = async (req, res) => {

    const newValues = req.body;
    // create auth keys instance
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    // create client instance
    const client = await auth.getClient();
    // create Google Sheets API instance
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "1eFps1mXC20eUXoHk3qCGxlKvAPwSaDQIa7gild_higc";
    
    // Append
    try {
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Timesheets",
            valueInputOption: "USER_ENTERED",
            // required valueInputOptions: RAW-whatever input is there, USER_ENTERED-tries to type it, so a date becomes a date type
            resource: {
                values: [
                    [
                        newValues[0],
                        newValues[1],
                        newValues[2],
                        newValues[3],
                        newValues[4],
                        newValues[5],
                        newValues[6],
                        newValues[7],
                        newValues[8],
                        newValues[9], 
                        newValues[10], 
                        newValues[11],
                        newValues[12]
                    ]
                ]
            }
        });
        res.status(200).json({
            title: 'ultrenostimesheets | Post Timesheet',
            status: 'success'
        });
    } catch(e) {
        console.log(e.message);
        res.status(500).json({
            title: 'ultrenostimesheets | Post Timesheet',
            status: 'fail',
            error: e.message
        });
    }
}
exports.updateTimesheets = async (req, res) => {
    const creds = require('../credentials.json'); // the file saved above
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEETID);
    await doc.useServiceAccountAuth(creds);
 
    try {
        await doc.loadInfo(); // loads document properties and worksheets
        const timesheet = doc.sheetsByIndex[0];
        await timesheet.loadCells();
        let idArray = [];
        //find row
        // for (i=0; i<=(timesheet.rowCount-1); i++) {
        for (i=0; i<=(timesheet.rowCount-1); i++) {
            const vari = timesheet.getCell(i, 12).value;
            if (vari===req.body[12]) {
                timesheet.getCell(i,3).value = req.body[2];
                timesheet.getCell(i,3).value = req.body[3];
                timesheet.getCell(i,4).value = req.body[4];
                timesheet.getCell(i,5).value = req.body[5];
                timesheet.getCell(i,6).value = req.body[6];
                timesheet.getCell(i,7).value = req.body[7];
                timesheet.getCell(i,8).value = req.body[8];
                timesheet.getCell(i,9).value = req.body[9];
                timesheet.getCell(i,10).value = req.body[10];
                timesheet.getCell(i,11).value = req.body[11];
                await timesheet.saveUpdatedCells();
                res.status(200).json({
                    title: 'ultrenostimesheets | Update Timesheet',
                    status: 'success',
                    data: 'return timesheet here'
                });
            }       
        }
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
    const creds = require('../credentials.json'); // the file saved above
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEETID);
    await doc.useServiceAccountAuth(creds);
    try {
        await doc.loadInfo(); // loads document properties and worksheets
        const timesheet = doc.sheetsByIndex[0];
        await timesheet.loadCells();
        let idArray = [];
        //find row
        for (i=0; i<=timesheet.rowCount-1; i++) {
            const vari = timesheet.getCell(i, 12).value;
            if (vari===req.body.delId) {
                timesheet.getCell(i,0).value = 'Deleted by User';
                timesheet.getCell(i,1).value = '';
                timesheet.getCell(i,2).value = '';
                timesheet.getCell(i,3).value = '';
                timesheet.getCell(i,4).value = '';
                timesheet.getCell(i,5).value = '';
                timesheet.getCell(i,6).value = '';
                timesheet.getCell(i,7).value = '';
                timesheet.getCell(i,8).value = '';
                timesheet.getCell(i,9).value = '';
                timesheet.getCell(i,10).value = '';
                timesheet.getCell(i,11).value = '';
                await timesheet.saveUpdatedCells();
                res.status(200).json({
                    title: 'ultrenostimesheets | Delete Timesheet',
                    status: 'success',
                    data: 'return timesheet here'
                });          
            }          
        }
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Timesheet Update',
            status: 'fail',
            error: e.message
        });
    }
    return res.status(500).json({
        title: 'ultrenostimesheets | Timesheet Update',
        status: 'fail',
        error: "Timesheet not found."
    });
}
