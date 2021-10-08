const discordJS = require('discord.js')
const Game = require('../Game')

const client      = require('../index.js').client

const config = require('../config.json')

module.exports = 
{
    name: 'pull',
    description: "Remove player from game",
    async execute(message, args)
    {
		const member = message.mentions.members.first()
        
        if (member)
        {
			const discordID = member.id
			let DiscordUser = await client.users.fetch(discordID)
			let DiscordName = DiscordUser.username
            // Game.findOneAndUpdate({ type: "5v5ctf" }, {$pull:{ players: { id: discordID} }})
            // .then(() => {
                // message.channel.send("Removed `" + DiscordName + "` from **CTF 5v5**")
            // })
            // .catch(err => console.log(err))
            
            Game.findOneAndUpdate({ type: "4v4ctf" }, {$pull:{ players: { id: discordID} }})
            .then(() => {
                // message.channel.send("Removed `" + DiscordName + "` from **CTF 4v4**")
                message.channel.send("Removed `" + DiscordName + "` from **Sunday CTF 4v4.**")
            })
            .catch(err => console.log(err))
            
            // Game.findOneAndUpdate({ type: "4v4tdm" }, {$pull:{ players: { id: discordID} }})
            // .then(() => {
                // message.channel.send("Removed `" + DiscordName + "` from **TDM 4v4**")
            // })
            // .catch(err => console.log(err))
            
        }
        else if (message.mentions.members.first())
        {
            Game.findOneAndUpdate({ type: args[0] }, {$pull:{ players: { id: discordID} }})
            .then(() => {
                message.channel.send(`removed from ${[args[0]]}`)
            })
        } 
        else if (message.mentions.members.first())
        {
            Game.findOneAndUpdate({ type: args[0] }, {$pull:{ players: { id: discordID} }})
            .then(() => {
                message.channel.send(`removed from ${[args[0]]}`)
            })
        }
    }
}