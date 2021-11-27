const Joi = require('joi')

const update_request = Joi.object({
    first_name: Joi.string().min(2).max(15).required().label('First Name'),
    last_name: Joi.string().min(2).max(15).required().label('Last Name'),
    organization: Joi.string().min(2).max(50).required().label('Organization'),
})

const message = Joi.object({
    message: Joi.string().min(2).required().label('Message'),
    email: Joi.string().email().required().label('Email'),
    name: Joi.string().min(2).max(25).required().label('Name'),
})


module.exports.updateValidate = update_request
module.exports.messageValidate = message

