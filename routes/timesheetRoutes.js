const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

router.get('/', timesheetController.viewTimesheets);
router.post('/', timesheetController.appendTimesheets);
router.patch('/', timesheetController.updateTimesheets);
router.delete('/', timesheetController.deleteTimesheets);

module.exports = router;
