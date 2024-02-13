const User = require('./../models/User.js')
const hashPassword = require('./../services/hashPassword.js')


const signup = async (data) => {
    const user = new User({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        password: await hashPassword(data.password)
    })
    await user.save();
}

module.exports = signup