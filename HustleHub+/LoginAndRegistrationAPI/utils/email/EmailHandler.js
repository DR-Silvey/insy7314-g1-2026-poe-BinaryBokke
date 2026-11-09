const logger = require("./../../utils/Logger");

const nodemailer = require('nodemailer');

//Email transporter (Nodemailer, s.a.)
const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD

    }

});

//Email sending utility (Nodemailer, s.a.)
const SendEmail = async (to, subject, text, html = null) => {
    try {
        const mailOptions = {
            from: `"HustleHub+" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text

        };

        //Include HTML if supplied
        if (html) {
            mailOptions.html = html;

        }

        const info = await transporter.sendMail(mailOptions);

        logger.log('Email successfully sent:', info.messageId);

        return info;

    } 
    catch (error) {
        logger.error('Email sending failed:', error);

        return { error: 'Email sending failed' };

    }

};

module.exports = SendEmail;

/*
NodeMailer, s.a. Nodemailer - Send e-mails from Node.js - easy as cake. 
[Online] Available at: <https://nodemailer.com/about/> [Accessed 7 November 2026].
*/