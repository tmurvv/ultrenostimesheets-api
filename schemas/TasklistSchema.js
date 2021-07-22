const mongoose = require('mongoose');

// Job List
const tasklistSchema = new mongoose.Schema({
    task: String,
    current: Boolean
},{ versionKey: false });

module.exports.Tasklist = mongoose.model('Tasklist', tasklistSchema);
