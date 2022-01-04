const Joi = require('joi');

function categoryValidate(req) {
    const schema = Joi.object({
        categoryName: Joi.string().required().empty().messages({
            "string.base": `category name should be a type of 'text'`,
            "string.empty": `category name cannot be an empty field`,
            "any.required": `category name is a required field`,
        }),
    });
    return schema.validate(req);
}

function multipleDeleteValidation(req) {
    const schema = Joi.object({
        ids: Joi.array().required().empty().messages({
            "string.empty": `ids cannot be an empty field`,
            "any.required": `ids is a required field`,
        }),
    });
    return schema.validate(req);
}

module.exports = { categoryValidate, multipleDeleteValidation };