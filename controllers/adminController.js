const fs = require("fs");
const {Joblist} = require('../schemas/JoblistSchema');
const {Tasklist} = require('../schemas/TasklistSchema');
const {Timesheets} = require('../schemas/TimesheetsSchema');
const {Users} = require('../schemas/UserSchema');
const {cleanHiddenCharacters} = require("../utils/helpers");

exports.numTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheets.find({downloaded: false});
        const totsheets= await Timesheets.find();
        const totusers= await Users.find();
        const jobs= await Joblist.find({current: true});
        const tasks= await Tasklist.find({current: true});
        
        res.status(200).json({
            title: 'ultrenostimesheets | Update Timesheet',
            status: 'success',
            numsheets: timesheets.length,
            totsheets: totsheets.length,
            totusers: totusers.length,
            jobs,
            tasks
        });
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Number of Timesheets',
            status: 'fail',
            error: e.message
        });
    }
}
exports.downloadNewTimesheets = async (req, res) => {
    function getMinutesWorked(starttime, endtime, lunchtime) {
        // shortcut if endtime before starttime
        if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
        // calculate time worked
        const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
        const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
        // short cut is lunchtime greater than time worked
        if (milliesWorked<=0) return -2;
        //return minutes worked
        return Math.round((milliesWorked/60)/1000);
    }
    function minutesToDigital(minutes) {
        const m = minutes % 60;  
        const h = (minutes-m)/60;   
        const dec = parseInt((m/6)*10, 10);
        return parseFloat(parseInt(h, 10) + '.' + (dec<10?'0':'') + dec);
    }
    function getDateWorked(entry) {
        const entryDate = new Date(entry);
        const month=(entryDate.getMonth()+1)<10?`0${entryDate.getMonth()+1}`:entryDate.getMonth()+1;
        const date=(entryDate.getDate())<10?`0${entryDate.getDate()}`:entryDate.getDate();
        return `${entryDate.getFullYear()}-${month}-${date}`
    }
    function cleanCommas(sheet) {
        sheet.firstname=sheet.firstname.replace(/,/g, '/');
        sheet.lastname=sheet.lastname.replace(/,/g, '/');
        sheet.jobid=sheet.jobid.replace(/,/g, '/');
        sheet.jobname=sheet.jobname.replace(/,/g, '/');
        sheet.task=sheet.task.replace(/,/g, '/');
        sheet.notes=sheet.notes.replace(/,/g, '/');
    } 
    try {
        const timesheets = await Timesheets.find({downloaded: false});
        if (!timesheets) throw new Error('No new timesheets to download.')        
        let timesheetcsv = 'Email, First Name, Last Name, Date of Work, Start, Finish, Lunch, Hours Worked, Job Id, Job Name, task, notes\n';

        timesheets.map(sheet=>{
            cleanHiddenCharacters(cleanCommas(sheet));
            timesheetcsv=`${timesheetcsv}${sheet.userid},${sheet.firstname},${sheet.lastname},${getDateWorked(sheet.starttime)},${(new Date(sheet.starttime).getHours())}:${(new Date(sheet.starttime).getMinutes())},${(new Date(sheet.endtime).getHours())}:${(new Date(sheet.endtime).getMinutes())},${sheet.lunchtime},${minutesToDigital(getMinutesWorked(sheet.starttime, sheet.endtime, sheet.lunchtime))},${sheet.jobid},${sheet.jobname},${sheet.task},${sheet.notes}\n`
        })
        // Query and stream
        const date=new Date();
        const file = `timesheets-${date.getFullYear()}${date.getMonth()+1}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}.csv`;
        fs.writeFile(file, timesheetcsv, ()=>{
            res.download(file);
        })
        try {
            timesheets.map(async sheet=>{
                await Timesheets.findByIdAndUpdate(sheet._id, {downloaded: true});
            });
        } catch (e) {
            throw new Error("Error marking timesheets downloaded");
        }
        res.status(200, {
            status: 'success',
            title: 'Ultimate Renovations | Download Timesheets'
        });   
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Download Timesheets',
            status: 'fail',
            error: e.message
        });
    }
}
exports.downloadAllTimesheets = async (req, res) => {
    function getMinutesWorked(starttime, endtime, lunchtime) {
        // validate starttime before endtime
        if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
        // calculate time worked
        const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
        const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
        // validate lunchtime longer than hours worked
        if (milliesWorked<=0) return -2;
        //return minutes worked
        return Math.round((milliesWorked/60)/1000);
    }
    function minutesToDigital(minutes) {
        const m = minutes % 60;  
        const h = (minutes-m)/60;   
        const dec = parseInt((m/6)*10, 10);
        return parseFloat(parseInt(h, 10) + '.' + (dec<10?'0':'') + dec);
    }
    function getDateWorked(entry) {
        const entryDate = new Date(entry);
        const month=(entryDate.getMonth()+1)<10?`0${entryDate.getMonth()+1}`:entryDate.getMonth()+1;
        const date=(entryDate.getDate())<10?`0${entryDate.getDate()}`:entryDate.getDate();
        return `${entryDate.getFullYear()}-${month}-${date}`
    }
    function cleanHiddenCharacters(sheet) {
        sheet.notes=sheet.firstname.replace(/\r?\n|\r/g, '/');
        sheet.notes=sheet.lastname.replace(/\r?\n|\r/g, '/');
        sheet.notes=sheet.jobid.replace(/\r?\n|\r/g, '/');
        sheet.notes=sheet.jobname.replace(/\r?\n|\r/g, '/');
        sheet.notes=sheet.task.replace(/\r?\n|\r/g, '/');
        sheet.notes=sheet.notes.replace(/\r?\n|\r/g, '/');
    }
    function cleanCommas(sheet) {
        sheet.firstname=sheet.firstname.replace(/,/g, '/');
        sheet.lastname=sheet.lastname.replace(/,/g, '/');
        sheet.jobid=sheet.jobid.replace(/,/g, '/');
        sheet.jobname=sheet.jobname.replace(/,/g, '/');
        sheet.task=sheet.task.replace(/,/g, '/');
        sheet.notes=sheet.notes.replace(/,/g, '/');
        return sheet;
    }
    try {
        const timesheets = await Timesheets.find();
        if (!timesheets) throw new Error('No timesheets to download.')        
        let timesheetcsv = 'Email, First Name, Last Name, Date of Work, Start, Finish, Lunch, Hours Worked, Job Id, Job Name, task, notes\n';

        timesheets.forEach(sheet=> {
            // clean commas and line breaks
            cleanHiddenCharacters(cleanCommas(sheet));
            timesheetcsv=`${timesheetcsv}${sheet.userid},${sheet.firstname},${sheet.lastname},${getDateWorked(sheet.starttime)},${(new Date(sheet.starttime).getHours())}:${(new Date(sheet.starttime).getMinutes())},${(new Date(sheet.endtime).getHours())}:${(new Date(sheet.endtime).getMinutes())},${sheet.lunchtime},${minutesToDigital(getMinutesWorked(sheet.starttime, sheet.endtime, sheet.lunchtime))},${sheet.jobid},${sheet.jobname},${sheet.task},${sheet.notes}\n`
        })
        // Query and stream
        const date=new Date();
        const file = `timesheets-${date.getFullYear()}${date.getMonth()+1}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}.csv`;
        fs.writeFile(file, timesheetcsv, ()=>{
            res.download(file);
        })
        res.status(200, {
            status: 'success',
            title: 'Ultimate Renovations | Download Timesheets'
        });   
    } catch(e) {
        console.log(e.message);
        return res.status(500).json({
            title: 'ultrenostimesheets | Download Timesheets',
            status: 'fail',
            error: e.message
        });
    }
}
