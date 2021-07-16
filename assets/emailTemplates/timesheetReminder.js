const { TRANSPORTER } = require('../constants/emailTransport');
const btoa = require('btoa');

exports.timesheetReminder = async (user) => {
    console.log('in email content', user.email)
    // encode email
    const emailEncode = btoa(user.email);

    // create transporter
    const transporter = TRANSPORTER;
    
    // send email
    try {
        // send mail with defined transport object -- for multiple recipient use an outer foreach and send one at a time
        const info = await transporter.sendMail({
            from: '<tech@take2tech.ca>', // sender address
            to: `${user.email}`, // list of receivers
            subject: `Timesheet Reminder | Ultimate Renovations`,
            text: `Welcome ${user.firstname} ${user.lastname}, it has been more than three days since your last timesheet entry.`,
            html: `<html>
                        <body style="color:#083a08; font-family: Lato, Arial, Helvetica, sans-serif;
                                                    line-height:1.8em;">
                            <h2>Message from Ultimate Renovations Timesheets</h2>
                            <p>Hello ${user.firstname} ${user.lastname},<br><br>It has been more than three business days since your last timesheet entry.</p>
                            <p><a style="color:#4054b2;font-weight: 600;font-size: 24px;" href="https://ultrenostimesheets.herokuapp.com"> Click here </a> to enter your timesheet(s) and get paid!</p>
                            <p>Please contact the office if you have any questions.</p>
                            <p>Thank you,<br/>Ultimate Renovations</p>
                        </body>
                    </html>` 
        });
        return true;
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
        return false;
    }
};