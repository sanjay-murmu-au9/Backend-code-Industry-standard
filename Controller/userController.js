const Query = require('../Queries/userQuery')
const BasicConfigQuery = require('../basic_config/basic_config_query')
const __ = require('../Utilities/Response');
const EmailService = require('../Utilities/email.utils');
const path = require("path");
const pug = require('pug')
const base64Img = require("base64-img")
const moment = require('moment')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const jwt = require('jsonwebtoken')
const secret = process.env.secret;

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
            // let attachentString = {
            //     filename: `${'name'}.pdf`,
            //     path: req.body.pdfString
            // }

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

            let emailSent = await EmailService.sendEmail(
                emial_obj.subject,
                emial_obj.html,
                emial_obj.to,
                emial_obj.cc,
                emial_obj.attachments

            )


            return __.successMsg(req, res, 201, emailSent, "user created successfully");


        } catch (error) {
            console.log(error)
            __.errorMsg(req, res, 503, "Service unavailable.", error);
        }
    }

    async create(req, res, next) {
        try {
            let { email, phone, Name, gender } = req.body;

            let existEmailorMobile = await Query.isEmailUnique(email, phone)

            console.log(existEmailorMobile, "true/false")
            // return
            //new user
            if (existEmailorMobile.success === true) return __.customMsg(req, res, 223, "user all ready exist!")
            if (existEmailorMobile.success == 'false') {
                //hashing the password
                const saltRound = await Query.GET_MIN_SALT_FOR_HASHING()
                // console.log(saltRound, "<<saltRound")
                if (!req.body.password) {
                    return __.customMsg(req, res, 406, 'Password field doesn\'t exists');
                }
                let hashPassword = bcrypt.hashSync(req.body.password, saltRound.data)//hasing the password;
                req.body.password = hashPassword;
                // console.log(req.body, "<<<body")
                // inserting new user into db
                let inserted = await Query.saveNewUser(req.body)
                if (inserted && !_.isEmpty(inserted)) {
                    inserted.password = undefined;
                    return __.successMsg(req, res, 201, inserted, "user created successfully");
                }

            }

        } catch (error) {
            console.log(error)
            __.errorMsg(req, res, 503, "Service unavailable.", error);
        }
    }

    async login(req, res, next) {
        try {
            // let email = req.body.email || req.params.email;
            let { email, password } = req.body;
            let isEmailExist = await Query.IsEmailExist(email);
            // console.log(isEmailExist, "<<<<<<<<<<<<<<")
            if (isEmailExist.success == true) {
                let isPasswordExist = await Query.getUserPassword(email)

                if (isPasswordExist.data.loginBlocked != undefined && isPasswordExist.data.loginBlocked) { // by default false;
                    return __.customMsg(req, res, 406, 'Access blocked please try after some time')
                }

                if (isPasswordExist.data.failedAttemptedCount != undefined && isPasswordExist.data.failedAttemptedCount >= 5) {
                    // console.log(isPasswordExist.data.failedAttemptedCount, "<<<<<FailedAttempt count")
                    await Query.updateFailedAttemptedCount(req, res, isPasswordExist.data.failedAttemptedCount, true);
                    setTimeout(async () => {
                        await Query.updateFailedAttemptedCount(req, res, 0, false)
                    }, 1000 * 60 * 5) // unblock after 5 min
                    return __.customMsg(req, res, 406, 'Access blocked please try after some time!')
                }

                // let password = await cryptr.decrypt(isPasswordExist.data.password)
                let jwtToken = '';
                let isEqual = bcrypt.compareSync(password, isPasswordExist.data.password)   //bcrypt compare password
                if (isEqual === true) {
                    let id = isPasswordExist.data._id;

                    // generate token
                    const expireTime = await BasicConfigQuery.GET_TOKEN_EXPIRE_IN_MIN().then((res) => { if (res.success) return res.data; else return 50 })

                    let data = {
                        id: isEmailExist.data._id,
                        mobile: isEmailExist.data.phone || '1234567890',
                        email: isEmailExist.data.email,
                        isDeleted: isEmailExist.data.isDeleted
                    }

                    jwtToken = jwt.sign({
                        result: JSON.stringify(data)
                    }, secret, { expiresIn: parseInt(expireTime) * 60 })
                    req.body.password = undefined;
                    req.body.token = jwtToken;
                    // updating the login details

                    let loggedUser = await Query.updateLoginDetail(isEmailExist.data._id)

                    if (loggedUser.acknowledged == true) {
                        return __.successMsg(req, res, 201, req.body, "user logged in successfully");
                    } else {
                        return __.errorMsg(req, res, 503, 'try again!!');
                    }

                } else {
                    let count = 0;
                    if (isPasswordExist.data.failedAttemptedCount === undefined) {
                        count += 1;
                    } else {
                        count = isPasswordExist.data.failedAttemptedCount + 1;
                    }
                    await Query.updateFailedAttemptedCount(req, res, count)
                    return __.customMsg(req, res, 409, 'invalid credentails')
                }
            }
        } catch (error) {
            __.errorMsg(req, res, 503, "Service unavailable.", error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            let { email } = req.body;
            let emailExist = await Query.isEmailExist(email)
            if (emailExist.success == true) {
                const cryptrSecret = await BasicConfigQuery.GET_CRYPT_SECRET_KEY().then((res) => { if (res.success) return res.data; else { return '12345secretkey12345678' } });
                const forgotPasswordExpiryTime = await BasicConfigQuery.GET_FORGOT_PASSWORD_MIN().then(res => { if (res.success) return res.data; else return 60 });

                //initalize cryptr;
                const cryptr = new Cryptr(cryptrSecret);

                const random_character = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                const hashedToken = cryptr.encrypt(emailExist.data._id + '`' + random_character);
                let jwtToken = '';
                //creating jwt token;
                jwtToken = jwt.sign({
                    data: hashedToken
                }, secret, { expiresIn: parseInt(forgotPasswordExpiryTime) * 60 })

                if (jwtToken) {

                    //send forget Email
                    let ExistingEmail = emailExist.data.email,
                        emailId = emailExist.data._id,
                        userName = emailExist.data.name || 'No Name',
                        emailAccountTemplatePath = path.join('email-templates', 'user'),
                        templatePath = path.join(__dirname, '../', emailAccountTemplatePath, 'reset-password.pug'),
                        imagePath = path.join(__dirname, '../', 'public/images/logo.jpeg');

                    // 
                    let frontEndHost = process.env.frontEndHost || '';
                    let frontEndUrlForgotPassword = process.env.frontEndUrlForgotPassword || '';

                    let hashLink = frontEndHost + frontEndUrlForgotPassword + '/' + jwtToken + '/email/' + ExistingEmail;

                    //compile html
                    let compiledHTML = await pug.compileFile(templatePath)({
                        logo: base64Img.base64Sync(imagePath),
                        name: userName,
                        hashLink,
                        returnEmail: 'sanjaymurmu40work@gmail.com'
                    })

                    // email object
                    let email_obj = { to: ExistingEmail, subject: 'Reset passord', html: compiledHTML }

                    let emailSent = await EmailService.sendEmail(email_obj.subject, email_obj.html, email_obj.to)

                    let isDbUpdated = await Query.updateForgotPassword(emailId, ExistingEmail, hashedToken)

                    // why didn't reflect in git
                    if (emailSent.response && isDbUpdated.success == true) {
                        return __.successMsg(req, res, 201, emailSent.response, "Email sent successfully!!");
                    } else {
                        __.customMsg(req, res, 406, 'Please try again!')
                    }

                } else {
                    __.errorMsg(req, res, 503, "Please try again.",);
                }

            } else {
                return __.errorMsg(req, res, 406, 'Email is not register with us Please register!')
            }


        } catch (error) {
            console.log(error)
            __.errorMsg(req, res, 503, "Service unavailable.", error);
        }
    }

    async resetPassword(req, res) {
        try {
            let id = req.body.userId;//:
            let password = req.body.hashedPassword;

            //inserting the new user into the db;
            let isUpdatedPassword = await Query.resetForgotPassword(id, password);
            let changeInForgotPasswordModel = await Query.updateInForgotModel(id)

            if (isUpdatedPassword && changeInForgotPasswordModel) {

                return __.successMsg(req, res, 201, {}, "updated password successfully!!");
            } else {
                return __.errorMsg(req, res, 409, "Error while updating the password!!");

            }
        } catch (error) {
            console.log(error)
            __.errorMsg(req, res, 503, "Service unavailable.", error);
        }
    }
}

module.exports = new User;