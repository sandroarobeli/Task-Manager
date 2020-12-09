const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
require('dotenv').config()

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(password) {
            if (password.toLowerCase().includes('password')) {
                throw new Error("Your password cannot contain the word 'password'!")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(age) {  
            if (age < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
   timestamps: true 
}) 
// Virtual property that connects tasks to their owner
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
// Removes password, tokens from what's displayed to user
userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Creating a custom INSTANCE method on userSchema
userSchema.methods.generateAuthToken = async function () {  
    const user = this
    // For token expiration add { expiresIn: '3h' } as 3rd argument
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY, { expiresIn: '3h' }) 
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
} 

// Creating a custom STATIC method on userSchema
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// Hashing the plaintext user password before saving
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next() // next indicates when the function is done and to move on
})

// Deleting user tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

// Compiled User Class
const User = mongoose.model('User', userSchema)

module.exports = User