const Joi = require('joi')

    //validation server side
module.exports.reviewSchema = Joi.object({
        rating : Joi.number().min(1).max(5).required(),
        body : Joi.string().min(3).required(),
    }).required()