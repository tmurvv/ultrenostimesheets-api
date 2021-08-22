// const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const atob = require('atob');
const bcrypt = require('bcrypt');
const {Users} = require('../schemas/UserSchema');
const {Timesheets} = require('../schemas/TimesheetsSchema');
const {resetPasswordEmail} = require('../assets/emailTemplates/resetPasswordEmail');
const { admin } = require('googleapis/build/src/apis/admin');
// const {emailVerifySend, emailResetPassword} = require('../email');

// const signToken = userId => jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN
// });

// const createSendToken = (user, statusCode, res) => {
//     const token = signToken(user._id);
//     const cookieOptions = {
//         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
//         httpOnly: true,
//         data: user
//     }
//     if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
//     res.cookie('jwt', token, cookieOptions);

//     res.status(statusCode).json({
//         "Access-Control-Allow-Origin": "*",
//         status: 'success',
//         token,
//         user
//     });
// }
// exports.getMe = async (req, res) => {
//     try {
//         const user = await Users.findById(req.params.userid);
//         if (!user) throw new Error();
//         res.status(200).json({
//             title: 'FindAHarp.com | Get User',
//             status: 'success',
//             data: {
//                 user
//             }
//         });
//     } catch (e) {
//         res.status(500).json({
//             title: 'FindAHarp.com | Get User',
//             status: 'fail',
//             data: {
//                 message: `Something went wrong finding your account: ${e.message}`
//             }
//         });
//     }
// }

exports.signup = async (req, res) => {
    // check if email exists 
    try {
        const emailExist = await Users.findOne({email: req.body.email});
        if (emailExist) throw new Error('Email already exists in our records.'); 
    } catch(e) {
        return res.status(500).json({
            title: 'Ultimate Renovations | Signup',
            status: 'fail',
            message: 'Email already exists in our records.'
        });
    }
    
    
    // // const saltRounds=10;
    // // const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = Object.assign({ 
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        email: req.body.email,
        password: req.body.password,
        _date_created: Date.now()
    });
    try {
        const addeduser = await Users.create(user);
        if (!addeduser) throw new Error('Something went wrong on signup.');
        let userCopy = {...addeduser._doc};
        delete userCopy.password;
        // createSendToken(addeduser, 201, res);
        res.status(200).json({
            title: 'signup',
            status: 'success',
            newuser: userCopy
        });
    } catch (e) {
        res.status(500).json({
            title: 'Ultimate Renovations | Signup',
            status: 'fail',
            data: {
                message: e.message
            }
        });
    }
}
exports.login = async (req, res) => {
    try {
        // find User
        let userInfo;
        // if not cookie check
        if (req.body.email) {
            let valid = false;
            userInfo = await Users.findOne({email: req.body.email});
            const adminInfo = await Users.findOne({email: 'admin@admin.com'});
            if (!userInfo) throw new Error('User not found.');
            // // check if email is verified:
            // if (!userInfo.emailverified) throw new Error(`The email ${userInfo.email} is not yet verified. Please check your inbox for a verification email from Findaharp.com.`);
            // check password
            if(userInfo&&userInfo.password) {
                if(await bcrypt.compare(req.body.password, userInfo.password)) valid=true;
            }
            if(adminInfo&&adminInfo.password) {
                if(await bcrypt.compare(req.body.password, adminInfo.password)) valid=true;
            }
            if(!valid) throw new Error('Password does not match our records.');
        }
        // // if cookie check
        // if (req.body.cookieId) userInfo = await Users.findById(req.body.cookieId);
        // check user found
        // if (!userInfo) throw new Error('User not found.');
        // remove password from result
        let userCopy = {...userInfo._doc};
        delete userCopy.password;
        // add JWT and send
        // createSendToken(userCopy, 200, res); 
        res.status(200).json({
            title: 'login',
            status: 'success',
            data: userCopy
        });   
    } catch (e) {
        console.log('error', e.message)
        if (!req.body.cookieId) res.status(400).json({
            title: 'ultrenostimesheets.take2tech.ca | Login User',
            status: 'fail',
            message: e.message,
            useremail: req.body.email
        });
        // if (req.body.cookieId) res.status(400).json({
        //     title: 'FindAHarp.com | Login User',
        //     status: 'fail',
        //     message: "JWT cookie login failed"
        // });
    }
}
exports.sendResetEmail = async (req, res) => {
    try {
        // find user
        const user = await Users.find({email: req.body.useremail});
        if (!user) throw new Error('Email not found.');
        // send reset email
        try{
            resetPasswordEmail(user[0]);
        } catch(e) {
            console.log(e.message)
            throw new Error('There was a problem sending reset email. Please try again.');
        }
        // return result
        res.status(200).json({
            title: 'FindAHarp.com | Reset Password',
            status: 'success',
        });
    } catch (e) {
        console.log('error', e.message)
        res.status(500).json({
            title: 'Ultimate Renovations Timesheets | Send Reset Email',
            status: 'fail',
            data: {
                message: `Something went wrong while sending reset email: ${e.message}`
            }
        });
    }
}
// exports.getAll = async (req, res) => {
//     try {
//         const allUsers = await Users.find();
//         if (!allUsers) throw new Error();

//         res.status(200).json({
//             title: 'FindAHarp.com | Get All Users',
//             status: 'success',
//             data: {
//                 allUsers
//             }
//         });
//     } catch (e) {
//         res.status(500).json({
//             title: 'FindAHarp.com | Get All Users',
//             status: 'fail',
//             data: {
//                 message: `Something went wrong getting all users: ${e.message}`
//             }
//         });
//     }
// }
// exports.verifyUser = async (req, res) => {
//     // get user  
//     const userInfo = await Users.find({email: req.params.useremail});
//     // error if no user
//     if (!userInfo || userInfo.length === 0) {
//         res.redirect('https://findaharp.com?activateemail=notfound')
//     }
//     // update the user
//     try {
//         const updatedUser = await Users.findOneAndUpdate({email: req.params.useremail}, {emailverified: true}, {new: true});
//         if (!updatedUser) throw new Error();
        
//         res.redirect('https://findaharp.com?activateemail=yes')

//     } catch (e) {
//         res.redirect('https://findaharp.com?activateemail=no')
//     }
// };
exports.updateUser = async (req, res) => {
    async function updateTimesheetEmails() {
        try {
            await Timesheets.updateMany({"userid": req.body.oldemail}, {"$set":{"userid": req.body.email}}, {"multi": true});
        } catch (e) {
            console.log(e.message);
        }
    }
    let userInfo;
    let adminInfo;
    // get user 
    try {
        userInfo = await Users.findById(req.body.id);
        adminInfo = await Users.find({email: req.body.adminemail});
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            title: 'UltRenos Timesheets | Update User',
            status: 'fail',
            message: `Something went wrong on update.`
        });
    }
    
    // error if no user
    if (!userInfo||userInfo.length<1) {
        return res.status(400).json({
            title: 'UltRenos Timesheets | Update User',
            status: 'fail',
            message: `User not found.`
        });
    }
    // if email change check that email not already in use.
    if (req.body.emailChange) {
        try {
            const exists = await Users.find({email: req.body.email});
            if (exists.length>0) throw new Error("Email already in use.");
        } catch {
            return res.status(400).json({
                title: 'ultrenostimesheets | Update User',
                status: 'fail',
                message: `Email already in use.`
            });
        }
    }
    let updateUser;
    if (req.body.role) {
        // create new updateUser object
        updateUser = {
            role: req.body.role
        }
        // error if no admin
        if (!adminInfo) {
            return res.status(400).json({
                title: 'UltRenos Timesheets | Update User',
                status: 'fail',
                message: `Admin not found.`
            });
        }
        // check password
        try {
            if (!await bcrypt.compare(req.body.password, adminInfo[0].password)) throw new Error();
        } catch(e) {
            return res.status(400).json({
                title: 'ultrenostimesheets | Update User',
                status: 'fail',
                message: `Admin password does not match our records.`
            });
        }
    } else {
        // create new updateUser object
        updateUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }
    }
    // update the user
    try {
        const returnObj = await Users.findByIdAndUpdate(req.body.id, updateUser, {new: true});
        const updatedUser = await Users.findById(req.body.id);
        if (!updatedUser) throw new Error(`User ${req.body.email} not found.`);
        updateTimesheetEmails();
        let userCopy = {...updatedUser._doc};
        delete userCopy.password;
        res.status(200).json({
            title: 'UltRenos Timesheets | Update User',
            status: 'success',
            message: 'User updated',
            userCopy,
            returnObj
        });
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            title: 'UltRenos Timesheets | Update User',
            status: 'fail',
            data: {
                message: e.message||`Something went wrong while updating user: ${e.message}`
            }
        });
    }
}
exports.resetPassword = async (req, res) => {
    const useremail = req.body.useremail;
    try {
        // update password
        const user = await Users.findOne({email: useremail});
        user.password = req.body.newpassword;
        await user.save();
        // return result
        res.status(200).json({
            title: 'Ultimate Renovations | Reset Password',
            status: 'success',
            data: {
                message: 'Password Reset'
            }
        });
    } catch (e) {
        res.status(500).json({
            title: 'Ultimate Renovations | Reset Password',
            status: 'fail',
            data: {
                message: `Something went wrong while resetting password: ${e.message}`
            }
        });
    }      
}
// exports.updatePassword = async (req, res) => {
//     // if call is from password reset email
//     if (req.body.resetpassword) {
//         const useremail = req.params.userid;
//         try {
//             // update password
//             const user = await Users.findOne({email: useremail});
//             user.password = req.body.resetpassword;
//             await user.save();
//             // return result
//             res.status(200).json({
//                 title: 'FindAHarp.com | Update Password',
//                 status: 'success',
//                 data: {
//                     message: 'Password Updated'
//                 }
//             });
//         } catch (e) {
//             res.).json({
//                 title: 'FindAHarp.com | Update Password',
//                 status: 'fail',
//                 data: {
//                     message: `Something went wrong while updating password: ${e.message}`
//                 }
//             });
//         }
//     // else call is from user profile change password
//     } else {
//         const userid = req.params.userid;
//         let userInfo;
//         try {
//             // find user
//             try {
//                 userInfo = await Users.findById(userid);
//             } catch {
//                 return res.status(500).json({
//                     title: 'FindAHarp.com | Update Password',
//                     status: 'fail',
//                     message: `Something went wrong. Please check your connection and try again.`
//                 });
//             }
//             // check old password
//             if(!await bcrypt.compare(req.body.oldpassword, userInfo.password)) {
//                 return res.status(500).json({
//                     title: 'FindAHarp.com | Update Password',
//                     status: 'fail',
//                     message: `Old Password incorrect.`
//                 });
//             }
//             // update user password
//             userInfo.password = req.body.password;
//             try {
//                 await userInfo.save();
//             } catch {
//                 return res.status(500).json({
//                     title: 'FindAHarp.com | Update Password',
//                     status: 'fail',
//                     message: `Something went wrong. Please check your connection and try again.`
//                 });
//             }
            
//             // return result
//             res.status(200).json({
//                 title: 'FindAHarp.com | Update Password',
//                 status: 'success',
//                 data: {
//                     message: 'Password updated'
//                 }
//             });
//         } catch(e) {
//             res.status(500).json({
//                 title: 'FindAHarp.com | Update Password',
//                 status: 'fail',
//                 data: {
//                     message: `Something went wrong while updating password: ${e.message}`
//                 }
//             });
//         }
//     }   
// }

exports.deleteUser = async (req, res) => {
    // get user  
    const userInfo = await Users.find({email: req.body.email});
    const adminInfo = await Users.find({email: req.body.adminemail});
    // error if no user
    if (!userInfo) {
        return res.status(400).json({
            title: 'UltRenos Timesheets | Delete User',
            status: 'fail',
            message: `User not found.`
        });
    }
    // error if no admin
    if (!adminInfo) {
        return res.status(400).json({
            title: 'UltRenos Timesheets | Delete User',
            status: 'fail',
            message: `Admin not found.`
        });
    }
    // check password
    try {
        if (!await bcrypt.compare(req.body.password, adminInfo[0].password)) throw new Error();
    } catch(e) {
        return res.status(400).json({
            title: 'ultrenostimesheets | Delete User',
            status: 'fail',
            message: `Admin password does not match our records.`
        });
    }
    try {
        // find and delete user
        const user = await Users.findOneAndDelete({email: req.body.email});
        // throw error if not successful
        if (!user) throw new Error();
        // return result
        return res.status(200).json({
            title: 'Ultrenostimesheets | Delete User',
            status: 'success',
            data: {
                message: 'User deleted',
                user
            }
        });
    } catch (e) {
        return res.status(500).json({
            title: 'Ultrenostimesheets | Delete User',
            status: 'fail',
            data: {
                message: `Something went wrong while deleting user: ${e.message}`
            }
        });
    }
}
