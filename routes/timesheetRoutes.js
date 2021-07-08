const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

router.get('/numtimesheets', timesheetController.numTimesheets);
router.get('/viewtimesheets', timesheetController.viewTimesheets);    
// router.get('/updatetimesheet', timesheetController.viewTimesheets);
router.post('/updatetimesheet', timesheetController.updateTimesheets);
router.post('/deletetimesheet', timesheetController.deleteTimesheets);
router.post('/appendtimesheet', timesheetController.appendTimesheets);
router.post('/viewtimesheetsbyuser', timesheetController.viewTimesheetsByUser);
router.get('/downloadtimesheets', timesheetController.downloadTimesheets);


module.exports = router;