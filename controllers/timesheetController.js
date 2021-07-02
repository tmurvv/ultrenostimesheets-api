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
        console.log('here')
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Timesheets", // from lower tab on sheet in case of multiple sheets in one doc
            // range: "Sheet1!A:C" // add !A:C to get only columns A-C       
        });
        const timesheets = getRows.data.values;
        console.log(getRows)
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
    console.log('uuid:', uuid)
    console.log('newValues:', newValues)
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
    console.log('inupdatetimesheets', req.body.data)

    const creds = require('../credentials.json'); // the file saved above
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEETID);
    await doc.useServiceAccountAuth(creds);
    
    console.log('here')
    try {
        // console.log('docabv:', doc.title)
        await doc.loadInfo(); // loads document properties and worksheets
        console.log('docbel:', doc.title)
        const timesheet = doc.sheetsByIndex[0];
        await timesheet.loadCells();
        console.log(timesheet.getCellByA1('M2').value)
        console.log(timesheet.rowCount);
        let idArray = [];
        //find row
        // for (i=0; i<=(timesheet.rowCount-1); i++) {
        for (i=0; i<=(10); i++) {
            
            const vari = timesheet.getCell(i, 12).value;
            console.log('vari:', vari)
            console.log('req:', req.body[12]);
            if (vari===req.body[12]) {
                console.log("FOUND IT");
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
                console.log('success ithink')
                res.status(200).json({
                    title: 'ultrenostimesheets | Update Timesheet',
                    status: 'success',
                    data: 'return timesheet here'
                });
            
            }
                
            
        }

        // update cell
        console.log('idArray:', idArray)

        // send back up to sheet

        
        // // await doc.updateProperties({ title: 'renamed doc' });
        // res.status(200).json({
        //     title: 'ultrenostimesheets | Update Timesheet',
        //     status: 'success',
        //     data: 'return timesheet here'
        // });
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
    console.log('indeletetimesheets', req.body)

    const creds = require('../credentials.json'); // the file saved above
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEETID);
    await doc.useServiceAccountAuth(creds);
    
    console.log('here')
    try {
        // console.log('docabv:', doc.title)
        await doc.loadInfo(); // loads document properties and worksheets
        console.log('docbel:', doc.title)
        const timesheet = doc.sheetsByIndex[0];
        await timesheet.loadCells();
        console.log(timesheet.getCellByA1('M2').value)
        console.log(timesheet.rowCount);
        let idArray = [];
        //find row
        // for (i=0; i<=(timesheet.rowCount-1); i++) {
        for (i=0; i<=(10); i++) {
            const vari = timesheet.getCell(i, 12).value;
            console.log('vari:', vari)
            console.log('req:', req.body.delId);
            if (vari===req.body.delId) {
                console.log("FOUND IT");
                timesheet.getCell(i,0).value = 'This';
                timesheet.getCell(i,1).value = 'Entry';
                timesheet.getCell(i,2).value = 'Deleted';
                timesheet.getCell(i,3).value = 'By';
                timesheet.getCell(i,4).value = 'User';
                timesheet.getCell(i,5).value = '';
                timesheet.getCell(i,6).value = 'This';
                timesheet.getCell(i,7).value = 'Entry';
                timesheet.getCell(i,8).value = 'Deleted';
                timesheet.getCell(i,9).value = 'By';
                timesheet.getCell(i,10).value = 'User';
                timesheet.getCell(i,11).value = '';
                await timesheet.saveUpdatedCells();
                console.log('success ithink')
                res.status(200).json({
                    title: 'ultrenostimesheets | Delete Timesheet',
                    status: 'success',
                    data: 'return timesheet here'
                });
            
            }
                
            
        }

        // update cell
        console.log('idArray:', idArray)

        // send back up to sheet

        
        // // await doc.updateProperties({ title: 'renamed doc' });
        // res.status(200).json({
        //     title: 'ultrenostimesheets | Update Timesheet',
        //     status: 'success',
        //     data: 'return timesheet here'
        // });
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Timesheet Update',
            status: 'fail',
            error: e.message
        });
    }


}
