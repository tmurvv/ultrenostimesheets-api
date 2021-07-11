const { TRANSPORTER } = require('../constants/emailTransport');
const btoa = require('btoa');

exports.resetPasswordEmail = async (user) => {
    console.log('in email content', user.email)
    // encode email
    const emailEncode = btoa(user.email);

    // create transporter
    const transporter = TRANSPORTER;
    
    // send email
    // (async () => {
        try {
            // send mail with defined transport object -- for multiple recipient use an outer foreach and send one at a time
            const info = await transporter.sendMail({
                from: '<tech@take2tech.ca>', // sender address
                to: `${user.email}`, // list of receivers
                subject: `Password Reset | Ultimate Renovations`,
                text: `Welcome ${user.firstname} ${user.lastname}, please click the button below to reset your password.`,
                html: `<html>
                            <body style="color:#083a08; font-family: Lato, Arial, Helvetica, sans-serif;
                                                        line-height:1.8em;">
                                <h2>Message from Ultimate Renovations Timesheets</h2>
                                <p>Dear Ultimate Renovations Timesheets user,<br><br>Please click on the link below to
                                    reset your password.</p>
                                <p style="text-decoration: underline; font-size: 24px;"><a style="color:#4054b2;font-weight: 600;" href="https://ultrenostimesheets.herokuapp.com/?reset=${emailEncode}"> Reset Password</a></p>
                                <p><strong>&copy;2021 <a href="https://take2tech.ca" style="color:#4054b2;font-weight: 600; text-decoration: underline;">take2tech.ca</strong></p>
                            </body>
                        </html>` 
            });
        } catch (error) {
            console.error(error);

            if (error.response) {
              console.error(error.response.body)
            }
        }
    // })();
    console.log('end')
};