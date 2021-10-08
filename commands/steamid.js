const discordJS = require('discord.js')
const Player = require('../Players')
const client = require('../index.js').client

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

module.exports = 
{
    name: 'steamid',
    description: "Set player steam id",
    execute(message, args)
    {
		if( args.length == 0 ) {
			Player.findOne({ discordID: message.author.id })
			.then(async function(player) {
				if (player) {
					// console.log("DiscordID: " + discord_id)
					// console.log(player)
					let DiscordUser = await client.users.fetch(message.author.id)
					let DiscordName = DiscordUser.username
					let msg = "**Steam ID** of `" + DiscordName + "` is " + player.steamid + "."
					message.channel.send(msg)
				} else {
					let DiscordUser = await client.users.fetch(message.author.id)
					let DiscordName = DiscordUser.username
					let msg = "**Steam ID** of `" + DiscordName + "` not found. Type your **Steam ID** number next to !steamid (i.e., \"!steamid **<SteamID>**\").\n**Steam ID** is easily found in your Quake Live folder \"C:\\Program Files\\steamapps\\common\\Quake Live\\\\**<SteamID>**\\baseq3\"."
					message.channel.send(msg)
					
					// let msg = '<@' + message.author.id + '> ' + "Please add your Steam ID using !steamid <steam64id> so that teams can be generated. You can find your Steam ID using https://steamid.co."
					// const embed = new discordJS.MessageEmbed()
					// .setURL('https://steamid.co')
					// .setTitle('Steam ID Finder / Simple ID Converter')
					// .setDescription('STEAMID.CO is a Steam ID Finder that can easily help you find any Steam ID. Enter any of the accepted inputs and the system will automatically look up all information you need.')
					// message.channel.send(msg)
					// message.channel.send(embed)
				}
			})
		}
        else if ( args.length == 1 ) {
			const member = message.mentions.members.first()
			
			if (member) {
				Player.findOne({ discordID: member.id })
				.then(async function(player) {
					if (player) {
						let DiscordUser = await client.users.fetch(member.id)
						let DiscordName = DiscordUser.username
						var msg = "**Steam ID** of `" + DiscordName + "` is " + player.steamid + "."
						message.channel.send(msg)
					} else {
						let DiscordUser = await client.users.fetch(member.id)
						let DiscordName = DiscordUser.username
						var msg = "**Steam ID** of `" + DiscordName + "` not found. Type your **Steam ID** number next to !steamid (i.e., \"!steamid **<SteamID>**\").\n**Steam ID** is easily found in your Quake Live folder \"C:\\Program Files\\steamapps\\common\\Quake Live\\\\**<SteamID>**\\baseq3\"."
						message.channel.send(msg)
					}
				})
			} else {
				Player.findOne({ discordID: message.author.id })
				.then(async function(player) {
					if (player) {
						let DiscordUser = await client.users.fetch(message.author.id)
						let DiscordName = DiscordUser.username
						// message.channel.send(`<@${message.author.id}> ` + "already has a Steam ID associated with it. In case the ID needs changing, message an admin or mod for help.")
						message.channel.send("`" + DiscordName + "` already has a Steam ID associated with it. In case the ID needs changing, message an admin or mod for help.")
					} else {
						if ( args[0].length != 17 || !isNumeric(args[0]) ) {
							message.channel.send("Given format is incorrect (**Steam ID** should be a long number).\n**Steam ID** is easily found in your Quake Live folder \"C:\\Program Files\\steamapps\\common\\Quake Live\\\\**<SteamID>**\\baseq3\".")
						} else {
							const player = new Player({
								discordID: message.author.id,
								steamid: args[0]
							})
							
							player.save()
							.then(async () => {
								let DiscordUser = await client.users.fetch(message.author.id)
								let DiscordName = DiscordUser.username
								message.channel.send("**Steam ID** of `" + DiscordName + "` saved.")
							})
						}
					}
				})
			}
		}
		else {  // args.length >= 2
			if (message.member.hasPermission('MANAGE_MESSAGES')) {
				const member = message.mentions.members.first()
				
				if (member) {
					if ( args[1].length != 17 || !isNumeric(args[1]) ) {
						// message.channel.send("Given format is incorrect (**Steam ID** should be a long number).\n**Steam ID** is easily found in your Quake Live folder \"C:\\Program Files\\steamapps\\common\\Quake Live\\\\**<SteamID>**\\baseq3\".")
					} else {
						const player = new Player({
							discordID: member.id,
							steamid: args[1]
						})
						
						player.save()
						.then(async () => {
							let DiscordUser = await client.users.fetch(member.id)
							let DiscordName = DiscordUser.username
							message.channel.send("**Steam ID** of `" + DiscordName + "` saved.")
						})
					}
				}
				
				// let msg = "Correct Usage: To add your **Steam ID,** type your **Steam ID** number next to !steamid (i.e., \"!steamid **<SteamID>**\").\n**Steam ID** is easily found in your Quake Live folder \"C:\\Program Files\\steamapps\\common\\Quake Live\\\\**<SteamID>**\\baseq3\"."
				// message.channel.send(msg)
			}
		}
    }
}