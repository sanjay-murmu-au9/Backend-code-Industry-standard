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
        firstName: Joi.string().trim().label('first name').reqex(/^[a-z,.'-]+$/i).options({
            language: {
                string: {
                    reqex: {
                        base: 'Should be valid first Name'
                    }
                }
            }
        }).required(),
        phoneNumber: Joi.string().trim().reqex(/^[6-9]{1}[0-9]{9}$/).label('Phone Number').options({
            language: {
                string: {
                    reqex: {
                        base: 'Should be a valid Number'
                    }
                }
            }
        }),
        gender: Joi.string().trim().valid('male', 'female', 'transgender')
    })
}

const options = {
    basic: {
        abortEarly: false,
        convert: true,
        allowunknown: false,
        stripUnknown: true
    },
    //Options for the Array of array;
    array: {
        abortEarly: false,
        convert: true,
        allowunknown: true,
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
            let error = [];
            err.details.forEach(element => {
                error.push(element.message)
            });
            //returning the response
            console.log(err, "<<err")
            __.joiMsg(req, res, err)
        })
    }
}