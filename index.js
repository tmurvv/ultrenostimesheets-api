const express = require("express");
const {google} = require("googleapis");

const app = express();

app.get("/", async (req, res) => {
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

    // // get metadata about spreadsheet
    // const metaData = await googleSheets.spreadsheets.get({
    //     auth,
    //     spreadsheetId
    // });

    // Get
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Timesheets", // from lower tab on sheet in case of multiple sheets in one doc
        // range: "Sheet1!A:C" // add !A:C to get only columns A-C       
    });
    // // Append
    // await googleSheets.spreadsheets.values.append({
    //     auth,
    //     spreadsheetId,
    //     range: "Timesheets",
    //     valueInputOption: "USER_ENTERED",
    //     // required valueInputOptions: RAW-whatever input is there, USER_ENTERED-tries to type it, so a date becomes a date type
    //     resource: {
    //         values: [
    //             [
    //                 "Test9833",
    //                 "TestWorker1",
    //                 "2021-06-12",
    //                 "8:00 AM",
    //                 "1:00 PM",
    //                 "45mins",
    //                 "4.75",
    //                 "TestC20015",
    //                 "TestRichardson",
    //                 "Exterior--Concrete"
    //             ]
    //         ]
    //     }
    // });
    // // Update
    // var body = {
    //     majorDimension: "ROWS", // Added
    //     values: [["UpdateTest5556", "UpdateTestWorker1",,,,,"UpdateThis",,"update Again here"]],
    // };
    // googleSheets.spreadsheets.values.update({
    //     auth,
    //     spreadsheetId,
    //     range: "Timesheets!A5", // Modified
    //     valueInputOption: "USER_ENTERED", // Modified
    //     resource: body
    // });
    
    // // Delete    
    // const requests = {
    //     deleteDimension: {
    //         "range": {
    //             "sheetId": 0, // can be found in url gid=1 -- 1 is sheetId
    //             "dimension": "ROWS",
    //             "startIndex": 5,
    //             "endIndex": 6
    //         }
    //     }
    // }
    // await googleSheets.spreadsheets.batchUpdate({
    //     spreadsheetId: spreadsheetId,
    //     requestBody: {
    //         requests: requests
    //     }
    // });
    res.send(getRows.data);
});

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log("server running"));
