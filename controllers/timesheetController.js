const {google} = require("googleapis");

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
                        newValues[11]
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
    // Update
    var body = {
        majorDimension: "ROWS", // Added
        values: [req.body.valuesArray], // ends up a double array [[]]
    };
    try {
        await googleSheets.spreadsheets.values.update({
            auth,
            spreadsheetId,
            range: `Timesheets!${req.body.range}`,
            valueInputOption: "USER_ENTERED",
            resource: body
        });
        res.status(200).json({
            title: 'ultrenostimesheets | Update Timesheet',
            status: 'success',
            data: 'return timesheet here'
        });
    } catch(e) {
        console.log(e.message);
        res.status(500).json({
            title: 'ultrenostimesheets | Update Timesheet',
            status: 'fail',
            error: e.message
        });
    }
}
exports.deleteTimesheets = async (req, res) => {
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
    // Delete
    try {           
        const requests = {
            deleteDimension: {
                "range": {
                    "sheetId": 0, // can be found in url gid=1 -- 1 is sheetId
                    "dimension": "ROWS",
                    "startIndex": req.body.startIndex,
                    "endIndex": req.body.endIndex
                }
            }
        }
        await googleSheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            requestBody: {
                requests: requests
            }
        });
        res.status(200).json({
            title: 'ultrenostimesheets | Delete Timesheet',
            status: 'success',
            data: 'return timesheet here'
        });
    } catch(e) {
        console.log(e.message);
        res.status(500).json({
            title: 'ultrenostimesheets | Delete Timesheet',
            status: 'fail',
            error: e.message
        });
    }
}
