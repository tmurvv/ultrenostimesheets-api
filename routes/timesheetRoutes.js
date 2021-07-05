const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

router.get('/', timesheetController.viewTimesheets);    
// router.get('/updatetimesheet', timesheetController.viewTimesheets);
router.post('/updatetimesheet', timesheetController.updateTimesheets);
router.post('/deletetimesheet', timesheetController.deleteTimesheets);
router.post('/', timesheetController.appendTimesheets);

module.exports = router;
