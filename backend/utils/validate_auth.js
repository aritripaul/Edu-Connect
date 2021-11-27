const Joi = require('joi')
const password_complexity = require('joi-password-complexity')
const signup = Joi.object({
    employee_id: Joi.string().min(4).max(15).label('Employee id').pattern(/^[0-9]+$/),
    username: Joi.string()
        .min(3)
        .max(14)
        .alphanum()
        .required()
        .label('Username'),
    first_name: Joi.string().min(2).max(15).required().label('First Name'),
    last_name: Joi.string().min(2).max(15).required().label('Last Name'),
    password: password_complexity({
        min: 6,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 6,
    })
        .required()
        .label('Password'),
    confirm_password: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .options({
            messages: { 'any.only': '{{#label}} does not match with Password' },
        }),
    email: Joi.string().email().label('Email'),
    organization: Joi.string().min(2).max(50).required().label('Organization'),
    role: Joi.string().valid("student", "teacher").required().label('Role')
})

const login = Joi.object({
    username: Joi.alternatives()
        .try(
            Joi.string().min(3).max(14).alphanum(),
            Joi.string().email().label('Email')
        )
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.code) {
                    case 'alternatives.match':
                        err.message = 'Username/Email is wrongly formatted'
                        break
                    default:
                        break
                }
            })
            return errors
        })
        .required()
        .label('Username'),

    password: password_complexity({
        min: 6,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 6,
    })
        .required()
        .label('Password'),
}).xor('username', 'email')

const password_reset_request = Joi.object({
    username: Joi.alternatives()
        .try(
            Joi.string().min(3).max(14).alphanum(),
            Joi.string().email().label('Email')
        )
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.code) {
                    case 'alternatives.match':
                        err.message = 'Username/Email is wrongly formatted'
                        break
                    default:
                        break
                }
            })
            return errors
        })
        .required()
        .label('Username'),
})

const password_reset = Joi.object({
    password: password_complexity({
        min: 6,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 6,
    })
        .required()
        .label('Password'),
    confirm_password: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .options({
            messages: { 'any.only': '{{#label}} does not match with Password' },
        }),
})

module.exports.signupValidate = signup
module.exports.loginValidate = login
module.exports.passwordResetRequestValidate = password_reset_request
module.exports.passwordResetValidate = password_reset
