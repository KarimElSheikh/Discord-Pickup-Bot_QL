const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    players: {
        type: Array,
        require: true
    }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game