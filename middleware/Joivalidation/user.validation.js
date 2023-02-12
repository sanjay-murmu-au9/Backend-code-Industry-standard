const BaseJoi = require('joi')
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const __ = require('../../Utilities/Response');

//joi Schema
const schemas = {
    //sign up validation;
    joiSignupValidate: Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'in'] } }).trim().label('email').required().max(256),
        password: Joi.string().trim().label('password').required().min(6).max(10000),
        firstName: Joi.string().trim().label('first name').regex(/^[a-z,.'-]+$/i).options({
            language: {
                string: {
                    regex: {
                        base: 'Should be valid first Name'
                    }
                }
            }
        }).required(),
        phoneNumber: Joi.string().trim().regex(/^[6-9]{1}[0-9]{9}$/).label('Phone Number').options({
            language: {
                string: {
                    regex: {
                        base: 'Should be a valid Number'
                    }
                }
            }
        }),
        gender: Joi.string().trim().valid('male', 'female', 'transgender')
    }),

    joiloggedinValidate: Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'in'] } }).trim().label('email').required().max(256),
        password: Joi.string().trim().label('password').required().min(6).max(10000),

    }),

    joiForgotPasswordValidate: Joi.object().keys({
        email: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })).trim().label('email').required().max(256),

    }),

    joiResetPassword: Joi.object().keys({
        password: Joi.string().trim().label('password').required().min(6).max(100),
        confirmPassword: Joi.string().trim().label('comfirm password').required().min(6).max(100).valid(Joi.ref('password'))
            .options({
                language: {
                    any: {
                        allowOnly: 'must match the password!'
                    }
                }
            })
    })
}

const options = {
    basic: {
        abortEarly: false,
        convert: true,
        allowUnknown: false,
        stripUnknown: true
    },
    //Options for the Array of array;
    array: {
        abortEarly: false,
        convert: true,
        allowUnknown: true,
        stripUnknown: {
            objects: true
        }
    }
};


module.exports = {
    //joi sign up validation
    joiSignupValidate: (req, res, next) => {
        //getting the schemas
        let schema = schemas.joiSignupValidate;
        let option = options.basic;

        //validating the schema;
        schema.validate(req.body, option).then(() => {
            next();
            //if error occured
        }).catch((err) => {
            // let error = [];
            // err.details.forEach(element => {
            //     error.push(element.message)
            // });
            //returning the response
            // console.log(err, "<<err")
            __.joiErrorMsg(req, res, err)
        })
    },

    joiForgotPasswordValidate: (req, res, next) => {
        let schema = schemas.joiForgotPasswordValidate;
        let option = options.basic;

        //validate Schema
        schema.validate(req.body, option).then(() => {
            next()
        }).catch((err) => {
            __.joiErrorMsg(req, res, err)
        })
    },

    joiloggedinValidate: (req, res, next) => {
        let schema = schemas.joiloggedinValidate;
        let option = options.basic;

        //validate Schema
        schema.validate(req.body, option).then(() => {
            next()
        }).catch((err) => {
            __.joiErrorMsg(req, res, err)
        })
    },

    joiResetPassword: (req, res, next) => {
        let schema = schemas.joiResetPassword;
        let option = options.basic;

        schema.validate(req.body, option).then(() => {
            next()
        }).catch((err) => {
            __.joiErrorMsg(req, res, err)
        })
    }
}