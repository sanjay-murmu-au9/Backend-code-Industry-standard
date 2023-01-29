"use strict";
const nodemailer = require('nodemailer');

class EmailUtils {
    async sendEmail(sub, body, to, cc = [], attachments = []) {
        try {
            const transporter = nodemailer.createTransport({
                type: "SMTP",
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    // user: process.env.smtp_email, //sanjaymurmu40work@gmail.com
                    user: 'sanjaymurmu40work@gmail.com', //sanjaymurmu40work@gmail.com
                    // pass: env.process.smtp_pasword
                    pass: "girhggtzgyyusdwj"
                }
            })

            const mailOptions = {
                from: 'sanjaymurmu40work@gmail.com',
                to: to,
                // cc: cc,
                subject: sub,
                // attachments: attachments,
                text: 'That was easy to test!',
                html: body,
            }

            let emailTransport = await transporter.sendMail(mailOptions
                // , function (error, info) {
                //     if (error) {
                //         console.log(error, "<<<errr")
                //     } else {
                //         console.log("else________________________________________>", info, "<<<<<<info")
                //         return {
                //             success: true,
                //             message: 'Message sent:' + info.response
                //         }
                //     }
                // }
            );
            console.log(emailTransport, "<<<<<<<emailTransport")
            return emailTransport;

        } catch (error) {
            console.log(error)
            Promise.reject(error)
        }
    }
}

module.exports = new EmailUtils();