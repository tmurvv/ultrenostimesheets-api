const express = require('express');
const router = express.Router();
const supportListController = require('../controllers/supportListController');

router.get('/currentjobs', supportListController.getCurrentJobs);
router.get('/tasks', supportListController.getTasks);

module.exports = router;
