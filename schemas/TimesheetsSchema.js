const mongoose = require('mongoose');
const mongooseToCsv = require('mongoose-to-csv');
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
    downloaded: {type: Boolean, default: false},
    timesubmitted: {type:Date, default: Date.now()}
},{ versionKey: false });
timesheetsSchema.plugin(mongooseToCsv, {
    headers: 'firstname lastname jobname',
    constraints: {
      'firstname': 'firstname',
      'lastname': 'lastname',
      'jobname': 'jobname'
    },
    // virtuals: {
    //   'Firstname': function(doc) {
    //     return doc.fullname.split(' ')[0];
    //   },
    //   'Lastname': function(doc) {
    //     return doc.fullname.split(' ')[1];
    //   }
    // }
  });
module.exports.Timesheets = mongoose.model('Timesheets', timesheetsSchema);
