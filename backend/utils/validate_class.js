const Joi = require('joi')
const create_class = Joi.object({
    subject: Joi.string().min(2).max(100).required().label('Subject'),
    description: Joi.string().min(2).max(100).required().label('Description'),
})

const join_class = Joi.object({
    subject: Joi.string().min(2).max(100).required().label('Subject'),
})

const update_class = Joi.object({
    description: Joi.string().min(2).max(100).required().label('Description'),
})

const schedule_class = Joi.object({
    topic: Joi.string().min(2).required().max(100).label('Topic'),
    start_time: Joi.string().required().label('Start Time'),
    offline_strength: Joi.number()
        .min(0)
        .integer()
        .required()
        .label('Offline Strength'),
})

module.exports.ValidateCreateClass = create_class
module.exports.ValidateJoinClass = join_class
module.exports.ValidateUpdate = update_class
module.exports.ValidateScheduleClass = schedule_class
