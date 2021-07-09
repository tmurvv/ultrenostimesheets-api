const {google} = require("googleapis");
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { gmail } = require("googleapis/build/src/apis/gmail");
const uuid = require('uuid');
const fs = require("fs");
const multer = require('multer');
const {Joblist} = require('../schemas/JoblistSchema');


const upload = multer({
    dest: '../uploads/', // this saves your file into a directory called "uploads"
    onError : function(err, next) {
        console.log('error', err);
        res.redirect('http://localhost:3006/?success=false');
    }
}); 
// app.get('/api/v1/admin/uploadwips', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
// // It's very crucial that the file name matches the name attribute in your html
// app.post('/api/v1/ultrenostimesheets/admin/uploadwips', upload.single('file-to-upload'), (req, res) => {
//     // res.redirect('http://localhost:3006/?success=true');
//     res.redirect('https://ultrenostimesheets.herokuapp.com/?success=true');
// });


exports.uploadJobList = async (req, res) => {
    console.log('imin joblist')
    upload.single('file-to-upload')
    // res.redirect('http://localhost:3006/?success=true');
    // res.redirect('https://ultrenostimesheets.herokuapp.com/?success=true');
    console.log(req.file.filename)
    // fs.readFile('')
    //remove id
    res.status(200).json({
        title: 'Ultimate Renovations | Upload Job List',
        status: 'success',
        // data: updatedtimesheet
    });
    // try {
    //     const updatedtimesheet = await Timesheets.findByIdAndUpdate(req.body.id, req.body);
    //     console.log('updatedtimesheet:', updatedtimesheet)
    //     res.status(200).json({
    //         title: 'ultrenostimesheets | Update Timesheet',
    //         status: 'success',
    //         data: updatedtimesheet
    //     });
    // } catch(e) {
    //     console.log(e.message);
    //     return res.status(500).json({
    //         title: 'ultrenostimesheets | Timesheet Update',
    //         status: 'fail',
    //         error: e.message
    //     });
    // }
}