const {google} = require("googleapis");
const {Joblist} = require("../schemas/JoblistSchema");
const {Tasklist} = require("../schemas/TasklistSchema");

exports.getCurrentJobs = async (req, res) => {
    try {
        const currentJobs = await Joblist.find();
        res.status(200).json({
            title: 'ultrenostimesheets | Get Current Jobs',
            status: 'success',
            data: currentJobs
        });
    } catch(e) {
        res.status(500).json({
            title: 'ultrenostimesheets | Get Current Jobs',
            status: 'fail',
            error: e.message
        });
    }
 
}
exports.getTasks = async (req, res) => {
    try {
        const currentTasks = await Tasklist.find({current: true});
        res.status(200).json({
            title: 'ultrenostimesheets | Get Current Tasks',
            status: 'success',
            data: currentTasks
        });
    } catch(e) {
        console.log('from getCurrentTasks', e.message) 
        res.status(500).json({
            title: 'ultrenostimesheets | Get Current Tasks',
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
    //         range: "Task List", // from lower tab on sheet in case of multiple sheets in one doc
    //         // range: "Sheet1!A:C" // add !A:C to get only columns A-C       
    //     });
    //     const tasks = getRows.data.values;
    //     res.status(200).json({
    //         title: 'ultrenostimesheets | Get Task List',
    //         status: 'success',
    //         data: tasks
    //     });
    // } catch(e) {
    //     console.log(e.message);
    //     res.status(500).json({
    //         title: 'ultrenostimesheets | Get Task List',
    //         status: 'fail',
    //         error: e.message
    //     });
    // }
}
exports.getLunchTimes = async (req, res) => {
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
            range: "Lunch Times", // from lower tab on sheet in case of multiple sheets in one doc
            // range: "Sheet1!A:C" // add !A:C to get only columns A-C       
        });
        const lunchTimes = getRows.data.values;
        res.status(200).json({
            title: 'ultrenostimesheets | Get Lunch Times',
            status: 'success',
            data: lunchTimes
        });
    } catch(e) {
        console.log(e.message);
        res.status(500).json({
            title: 'ultrenostimesheets | Get Task List',
            status: 'fail',
            error: e.message
        });
    }
}
