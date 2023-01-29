const Query = require('../Queries/userQuery')
const __ = require('../Utilities/Response');
const EmailService = require('../Utilities/email.utils');
const path = require("path");
const pug = require('pug')
const base64Img = require("base64-img")
const moment = require('moment')

const genetateOTP = () => {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)]
    }

    return OTP;
}

const validateTime = (otpTime) => {
    var elpTime = moment().diff(moment(otpTime), 'milliseconds'); // currTime - optGeneratedTime;
    var data = {
        status: false,
        elpTime: elpTime
    }
    if (elpTime > 60000) { //60000= 1min
        return true
    } else {
        return data;
    }
}


class User {
    async userlogin(req, res) {
        try {
            const { mobileNo } = req.body;
            //otp generated
            if (mobileNo == '') __.customMsg(req, res, 400, "Please insert mobile number");

            let opt = genetateOTP()

            //get the template Id
            // let otpTemplate = Query.otpTemplate()



            //Email
            let emailSentTo = 'Rohit Kr. Bilung';
            let emailAccountTemplatePath = path.join('email-templates', 'account')
            let templatePath = path.join(__dirname, '../', emailAccountTemplatePath, 'test.pug');

            let imagePath = path.join(__dirname, "../public/", "images/logo.jpeg");

            console.log(imagePath, "__dirname")
            const compiledFunction = pug.compileFile(templatePath);

            let compledHTML = pug.compileFile(templatePath)({
                logo: base64Img.base64Sync(imagePath),
                salemanName: "salesmanName",
                name: "name",
                email: 'test@gmail.com' || email,
                emailSentTo: emailSentTo,
                DMS_souce: 'abc',
                // etc
                // salesmanName: salesmanager.length > 0 ? salesmanager[0].fullName : ""
                salesmanName: 'test'
            });
            let attachentString = {
                filename: `${'name'}.pdf`,
                path: req.body.pdfString
            }

            //email obj
            let emial_obj = {
                from: process.env.smtp_email,
                to: 'sanjaymurmu40work@gmail.com' || loginedUserEmail,
                cc: ["sanjaymurmu40work@gmail.com", "adyy2014@gmail.com"],//[adminEmail, "sanjaymurmu40work@gmail.com", "test@gmail.com"],
                subject: `New Customer Alert - Customer ${'matchedEkyc'} Matched with existing Customer ID ${'customerId'}`,
                html: compledHTML,
                // html: `
                // Hi Team, <br/>
                // This is a dummy page please get render
                // `,
                // attachments: attachentString
            }

            let emailSent;
            emailSent = await EmailService.sendEmail(
                emial_obj.subject,
                emial_obj.html,
                emial_obj.to,
                emial_obj.cc,
                emial_obj.attachments

            )



            console.log(emailSent, "<<<<<<sentEmail")
            return __.successMsg(req, res, 201, 'user', "user created successfully");


        } catch (error) {
            console.log(error)
            __.errorMsg(req, res, 503, "Service unavailable.", error);
        }
    }
}

module.exports = new User;