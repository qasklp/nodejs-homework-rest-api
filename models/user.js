const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../utils");

const Joi = require("joi");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: emailRegex,
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: ""
    },
    avatarURL: String,
});

userSchema.post("save", handleMongooseError);

const validSubscriptionValues = ["starter", "pro", "business"];

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required().messages({
        "any.required": "missing required email field"
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": "missing required password field"
    }),
    subscription: Joi.string().valid(...validSubscriptionValues)

})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required().messages({
        "any.required": "missing required email field"
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": "missing required password field"
    }),
})

const schemas = {
    registerSchema,
    loginSchema
}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas
}