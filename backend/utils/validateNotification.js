const Joi = require('joi')

const notification_post = Joi.object({
    message: Joi.object().min(5).required().label('Message'),
})

module.exports.notificationValidate = notification_post
