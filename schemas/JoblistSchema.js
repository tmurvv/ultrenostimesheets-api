const mongoose = require('mongoose');

// Job List
const joblistSchema = new mongoose.Schema({
    jobid: String,
    jobname: String,
    current: Boolean
},{ versionKey: false });

module.exports.Joblist = mongoose.model('Joblist', joblistSchema);
