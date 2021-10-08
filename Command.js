const mongoose = require('mongoose')

const commandSchema = new mongoose.Schema({
    Command: {
        type: String,
        require: true,
        unique: true
    },
    Response: {
        type: String,
        require: true
    }
})

const Command = mongoose.model('Commnads', commandSchema)

module.exports = Command