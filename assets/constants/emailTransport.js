const nodemailer = require('nodemailer');

exports.TRANSPORTER = nodemailer.createTransport({
    host: "mail.findaharp.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'tmurvvvv', // main 'cwh' user
        pass: 'weSS#4ling', // main user password for 'cwh'
    },
    tls: {
        rejectUnauthorized: false
    }
});
