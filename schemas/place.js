const Joi = require('joi')

    //validation server side
module.exports.placeSchema = Joi.object({
        title : Joi.string().required(),
        price : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        image : Joi.string().required(),
    }).required()