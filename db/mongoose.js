const mongoose = require('mongoose')
const Task = require('../models/task')
require('dotenv').config()

// Establish connection to the database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dropDups: true // When unique didn't work, dropDups DID!
}, (error) => {
    if (error) {
        return console.log('Unable to connect to database')
    }
    console.log(`Connection to ${process.env.DB.toUpperCase()} database successful`)
})

// Connection state test
console.log(mongoose.STATES[mongoose.connection.readyState] + '...')

