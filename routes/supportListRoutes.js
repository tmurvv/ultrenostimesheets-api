const express = require('express');
const router = express.Router();
const supportListController = require('../controllers/supportListController');

router.get('/currentjobs', supportListController.getCurrentJobs);
router.get('/tasks', supportListController.getTasks);
router.get('/lunchtimes', supportListController.getLunchTimes);

module.exports = router;
