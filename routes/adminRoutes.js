const express = require('express');
const userController = require('../controllers/userController');
//const authController = require('../controllers/authController');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');
const adminController = require('../controllers/adminController');

//router.use(authController.isLoggedIn);

router.post('/uploadjoblist', adminController.uploadJobList);

// router.get(
//     '/daycalendar',
//     authController.protect,
//     viewController.getDayCalendar
// );
// router.get(
//     '/weekcalendar',
//     authController.protect,
//     viewController.getWeekCalendar
// );
// router.get(
//     '/monthcalendar',
//     authController.protect,
//     viewController.getMonthCalendar
// );
// router.get(
//     '/yearcalendar',
//     authController.protect,
//     viewController.getYearCalendar
// );
// router.get('/viewrooms', viewController.viewRooms);
// router.get('/about', viewController.about);
// router.get('/contact', viewController.contact);
// router.get('/login', viewController.login);
// router.get('/signup', viewController.signup);
// router.get('/resetPassword', viewController.resetPassword);
// router.get('/newPassword', viewController.resetPassword);
// router.get('/admin', authController.protect, viewController.admin);
// router.get('/userProfile', authController.protect, viewController.userProfile);
// router.get('/myBookings', authController.protect, viewController.myBookings);
// router.get(
//     '/bookingStats',
//     authController.protect,
//     viewController.bookingStats
// );

module.exports = router;
