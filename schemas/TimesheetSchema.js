const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Users
const timesheetsSchema = new mongoose.Schema({
    userid: String,
    firstname: String,
    lastname: String,
    starttime: Date,
    endtime: Date,
    lunchtime: Number,
    jobid: String,
    jobname: String,
    task: String,
    notes: String,
    timesubmitted: {type:Date, default: Date.now()}
},{ versionKey: false });

module.exports.Timesheets = mongoose.model('Timesheets', timesheetsSchema);
