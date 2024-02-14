const { Schema, model} = require('mongoose');
const hashPassword = require('./../services/hashPassword.js')

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function (next) {
    const hashedPassword = await hashPassword(this.password)
    this.password = hashedPassword
    next()
})

const User = model("User", userSchema, 'users')

module.exports = User