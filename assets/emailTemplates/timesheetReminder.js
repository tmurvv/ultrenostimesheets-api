const { TRANSPORTER } = require('../constants/emailTransport');
const btoa = require('btoa');

exports.timesheetReminder = async (user) => {
    // encode email
    const emailEncode = btoa(user.email);

    // create transporter
    const transporter = TRANSPORTER;
    // send email to webmaster
    try {
        // send mail with defined transport object -- for multiple recipient use an outer foreach and send one at a time
        const info = await transporter.sendMail({
            from: '<tech@take2tech.ca>', // sender address
            to: '<tech@take2tech.ca', // list of receivers
            subject: `Timesheet Reminder | Ultimate Renovations`,
            text: `Notification of reminder email sent to ${user.firstname} ${user.lastname}.`,
            html: `<html>
                        <body style="color:#083a08; font-family: Lato, Arial, Helvetica, sans-serif;
                                                    line-height:1.8em;">
                            <h2>Notification of reminder email sent.</h2>
                            <h2>Message from Ultimate Renovations Timesheets</h2>
                            <p>Hello ${user.firstname} ${user.lastname},<br><br>It has been more than three business days since your last timesheet entry.</p>
                            <p><a style="color:#4054b2;font-weight: 600;font-size: 24px;" href="https://ultrenostimesheets.take2tech.ca"> Click here </a> to enter your timesheet(s) and get paid!</p>
                            <p>Please contact the office if you have any questions.</p>
                            <p>Thank you,<br/>Ultimate Renovations</p>
                        </body> 
                    </html>` 
        });
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
        }
    }   
    // send email to worker
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
                            <p><a style="color:#4054b2;font-weight: 600;font-size: 24px;" href="https://ultrenostimesheets.take2tech.ca"> Click here </a> to enter your timesheet(s) and get paid!</p>
                            <p>Please contact the office if you have any questions.</p>
                            <p>Thank you,<br/>Ultimate Renovations</p>
                        </body>
                    </html>` 
        });
    
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
        return false;
    }  
};