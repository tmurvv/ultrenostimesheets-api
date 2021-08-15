const express = require('express');
const userController = require('../controllers/userController');
//const authController = require('../controllers/authController');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/sendresetemail', userController.sendResetEmail);
router.post('/updateuser', userController.updateUser);
router.post('/resetpassword', userController.resetPassword);
router.post('/deleteuser', userController.deleteUser);

module.exports = router;
