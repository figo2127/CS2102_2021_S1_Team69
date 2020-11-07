//VALIDATION
const Joi = require('@hapi/joi');

//Register validation
const registerValidation = data => {
    const schema =  Joi.object({
        username: Joi.string()
            .min(3)
            .required(),
        password: Joi.string()
            .min(3)
            .required(),
        name: Joi.string()
            .min(3)
            .required(),
        phone: Joi.string()
            .required(),
        area: Joi.string()
            .min(3),
        address: Joi.string()
            .min(6),
        isFulltime: Joi.string()
            .min(4)
    });
    return  schema.validate(data);
};

//Login validation
const loginValidation = data => {
    const schema =  Joi.object({
        username: Joi.string()
            .min(3)
            .required(),
        password: Joi.string()
            .min(3)
            .required()
    });
    console.log(data);
    console.log(schema.validate(data));
    return  schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
