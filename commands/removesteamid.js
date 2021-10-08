const discordJS = require('discord.js')

const Player = require('../Players')
const Game = require('../Game')
const client = require('../index.js').client

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

module.exports = 
{
    name: 'removesteamid',
    description: "Removes player's Steam ID",
    execute(message, args)
    {
		if( args.length == 1 ) {
			const mentionDiscordID = message.mentions.members.first().id.toString()
			if ( mentionDiscordID ) {
				Game.findOneAndUpdate({ type: '4v4ctf' }, {$pull:{ players: { id: mentionDiscordID} }})
				.then(() => {
					Game.findOneAndUpdate({ type: '5v5ctf' }, {$pull:{ players: { id: mentionDiscordID} }})
					.then(() => {
						Game.findOneAndUpdate({ type: '4v4tdm' }, {$pull:{ players: { id: mentionDiscordID} }})
						.then(() => {
							Player.find( {discordID: mentionDiscordID}, function(err,docs) {
								if (err) return console.log(err)
								
								if ( !docs || !Array.isArray(docs) || docs.length === 0 ) 
									return console.log('no docs found')
								
								docs.forEach(function (doc) {
									console.log("Removing doc: " + doc)
									doc.remove()
								})
							}).then(async() => {
								let DiscordUser = await client.users.fetch(message.author.id)
								let DiscordName = DiscordUser.username
								
								var msg = "**Steam ID** of `" + DiscordName + "` removed."
								message.channel.send(msg)
							})
						})
						.catch(err => console.log(err))
					})
					.catch(err => console.log(err))
				})
				.catch(err => console.log(err))
			}
		}
    }
}