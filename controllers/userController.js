// const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const atob = require('atob');
const bcrypt = require('bcrypt');
const {Users} = require('../schemas/UserSchema');
const {resetPasswordEmail} = require('../assets/emailTemplates/resetPasswordEmail');
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
            userInfo = await Users.findOne({email: req.body.email});
            if (!userInfo) throw new Error('User not found.');
            // // check if email is verified:
            // if (!userInfo.emailverified) throw new Error(`The email ${userInfo.email} is not yet verified. Please check your inbox for a verification email from Findaharp.com.`);
            // check password
            if(!await bcrypt.compare(req.body.password, userInfo.password)) throw new Error('Password incorrect.');
        }
        // // if cookie check
        // if (req.body.cookieId) userInfo = await Users.findById(req.body.cookieId);
        // check user found
        if (!userInfo) throw new Error('User not found.');
        // remove password from result
        let userCopy = {...userInfo._doc};
        delete userCopy.password;
        // add JWT and send
        // createSendToken(userCopy, 200, res); 
        res.status(200).json({
            title: 'signup',
            status: 'success',
            data: userCopy
        });   
    } catch (e) {
        if (!req.body.cookieId) res.status(400).json({
            title: 'FindAHarp.com | Login User',
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
    console.log('in sendresetemail', req.body.useremail)
    try {
        // find user
        const user = await Users.find({email: req.body.useremail});
        if (!user) throw new Error();
        // send reset email
        try{
            console.log('ready for send email function')
            resetPasswordEmail(user[0]);
        } catch(e) {
            console.log(e.message)
            throw new Error('There was a problem sending reset email. Please try again.');
        }
        // return result
        res.status(200).json({
            title: 'FindAHarp.com | Reset Password',
            status: 'success',
            // data: {
            //     message: 'Reset Email Sent',
            //     useremail: user.email
            // }
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
// exports.updateUser = async (req, res) => {
//     // console.log(req.body)
//     // get user  
//     const userInfo = await Users.findById(req.params.userid);
//     // error if no user
//     if (!userInfo) {
//         console.log('nouser')
//         return res.status(500).json({
//             title: 'FindAHarp.com | Update User',
//             status: 'fail',
//             message: `User not found.`
//         });
//     }
//     // check password
//     if(!await bcrypt.compare(req.body.password, userInfo.password)) {
//         console.log('passwordfail')
//         return res.status(500).json({
//             title: 'FindAHarp.com | Update User',
//             status: 'fail',
//             message: `Password incorrect.`
//         });
//     }
//     // create new updateUser object
//     const updateUser = {
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         newsletter: req.body.newsletter,
//         distanceunit: req.body.distanceunit,
//         currency: req.body.currency,
//         agreements: req.body.agreements
//     }
//     // update the user
//     try {
//         await Users.findByIdAndUpdate(userInfo._id, updateUser);
//         const updatedUser = await Users.findById(userInfo._id);
//         if (!updatedUser) throw new Error();
//         let userCopy = {...updatedUser._doc};
//         delete userCopy.password;
//         res.status(200).json({
//             title: 'FindAHarp.com | Update User',
//             status: 'success',
//             message: 'User updated',
//             userCopy
//         });
//     } catch (e) {
//         console.log(e.message)
//         res.status(500).json({
//             title: 'FindAHarp.com | Update User',
//             status: 'fail',
//             data: {
//                 message: `Something went wrong while updating user: ${e.message}`
//             }
//         });
//     }
// }
exports.resetPassword = async (req, res) => {
    console.log('inpassword', req.body.newpassword)
    const useremail = req.body.useremail;
    console.log('useremail:', useremail)
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
//             res.status(500).json({
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

// exports.deleteUser = async (req, res) => {
//     // get user  
//     const userInfo = await Users.findById(req.params.userid);
//     // error if no user
//     if (!userInfo) {
//         return res.status(500).json({
//             title: 'FindAHarp.com | Update User',
//             status: 'fail',
//             message: `User not found.`
//         });
//     }
//     // check password
//     try {
//         if(!await bcrypt.compare(req.query.editpassword, userInfo.password)) {
//             return res.status(500).json({
//                 title: 'FindAHarp.com | Update User',
//                 status: 'fail',
//                 message: `Password incorrect.`
//             });
//         }
//     } catch(e) {
//         return res.status(500).json({
//             title: 'FindAHarp.com | Delete User',
//             status: 'fail',
//             data: {
//                 message: `Something went wrong while deleting user: ${e.message}`
//             }
//         });
//     }
    
//     try {
//         // find and delete user
//         const user = await Users.findByIdAndDelete(req.params.userid);
//         // throw error if not successful
//         if (!user) throw new Error();
//         // return result
//         return res.status(200).json({
//             title: 'FindAHarp.com | Delete User',
//             status: 'success',
//             data: {
//                 message: 'User deleted',
//                 user
//             }
//         });
//     } catch (e) {
//         return res.status(500).json({
//             title: 'FindAHarp.com | Delete User',
//             status: 'fail',
//             data: {
//                 message: `Something went wrong while deleting user: ${e.message}`
//             }
//         });
//     }
// }
