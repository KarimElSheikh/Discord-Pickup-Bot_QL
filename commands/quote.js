const discordJS = require('discord.js')
const client    = require('../index.js').client

const quotes        = require('../index.js').quotes
const quotesAuthors = require('../index.js').quotesAuthors
const nQuotes       = quotes.length

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	name: 'quote',
	description: "get a random quote",
	execute(message, args)
	{
		let x = getRandomInt(nQuotes)
		// let msg = ""
		// for(let i = nQuotes - 3; i < nQuotes; i++) {
			// msg += quotes[i] + '\n'
			// msg += "\u2014 " + quotesAuthors[i] + '\n'
			// msg += '\n'
		// }
		let msg = quotes[x] + '\n' + "\u2014 " + quotesAuthors[x]
		message.channel.send(msg)
	}
}