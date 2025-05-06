const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,     
        pass: process.env.EMAIL_PASSWORD  
    },
    tls: {
        rejectUnauthorized: false
    },
    from: {
        name: "Travel Phú Yên",
        address: process.env.EMAIL_USER
    }
});

module.exports = transporter;