const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    discordID: {
        type: String,
        require: true
    },
    steamid: {
        type: String,
        require: true
    }
})

const Player = mongoose.model('Players', playerSchema)

module.exports = Player