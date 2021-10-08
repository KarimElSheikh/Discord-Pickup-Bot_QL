const fetch = require('node-fetch')

const Player = require('../Players')
const strEq  = require('../index.js').strEq
const client = require('../index.js').client

// Use this to check if args[0] is a mention
// if ( args[0].startsWith('<@') && args[0].endsWith('>') )


function checkSteamIDthenSendRatingOfModeToChannel(DiscordID, message, mode) {
	Player.findOne({ discordID: DiscordID})
	.then(async function(user) {
		if (user) {
			sendRatingOfModeToChannel(user.steamid, DiscordID, message, mode)
		} 
		else {
			let DiscordUser = await client.users.fetch(DiscordID)
			let DiscordName = DiscordUser.username
			
			let msg = "**Steam ID** of `" + DiscordName + "` not found."
			message.channel.send(msg)
		}
	})
}

async function sendRatingOfModeToChannel(SteamID, DiscordID, message, mode)
{
	const respose = await fetch(`http://stats.houseofquake.com/elo/${SteamID}`)
	const data = await respose.json()
		
	if (data) {
		let DiscordUser = await client.users.fetch(DiscordID)
		let DiscordName = DiscordUser.username
		
		if (mode == 'ctf') {
			message.channel.send("**Quake Live CTF** rating for `" + DiscordName + "`: " + data.playerinfo[SteamID].ratings.ctf.elo + " (" + data.playerinfo[SteamID].ratings.ctf.games + " matches played)")
		}
		else {  // mode == 'tdm'
			message.channel.send("**Quake Live TDM 4v4** rating for `" + DiscordName + "`: " + data.playerinfo[SteamID].ratings.tdm.elo + " (" + data.playerinfo[SteamID].ratings.tdm.games + " matches played)")
		}
	}
}

function checkSteamIDthenSendRatingOfBothModesToChannel(DiscordID, message) {
	Player.findOne({ discordID: DiscordID})
	.then(async function(user) {
		if (user) {
			sendRatingOfBothModesToChannel(user.steamid, DiscordID, message)
		} 
		else {
			let DiscordUser = await client.users.fetch(DiscordID)
			let DiscordName = DiscordUser.username
			
			let msg = "**Steam ID** of `" + DiscordName + "` not found."
			message.channel.send(msg)
		}
	})
}

async function sendRatingOfBothModesToChannel(SteamID, DiscordID, message)
{
	const respose = await fetch(`http://stats.houseofquake.com/elo/${SteamID}`)
	const data = await respose.json()
		
	if (data) {
		let DiscordUser = await client.users.fetch(DiscordID)
		let DiscordName = DiscordUser.username
		
		let msg = "**Quake Live CTF** rating for `" + DiscordName + "`: " + data.playerinfo[SteamID].ratings.ctf.elo + " (" + data.playerinfo[SteamID].ratings.ctf.games + " matches played)"
		msg += "\n**Quake Live TDM 4v4** rating for `" + DiscordName + "`: " + data.playerinfo[SteamID].ratings.tdm.elo + " (" + data.playerinfo[SteamID].ratings.tdm.games + " matches played)"
		message.channel.send(msg)
	}
}

module.exports = {
	name: 'rating',
	description: "list ratings",
	execute(message, args)
	{
		const msgSenderID = message.author.id
		if (args.length == 0) {
			// checkSteamIDthenSendRatingOfBothModesToChannel(msgSenderID, message)
			checkSteamIDthenSendRatingOfModeToChannel(msgSenderID, message, 'ctf')
		}
		else {  // args.length >= 1
			const member = message.mentions.members.first()
			if (member) {
				let wantRatingOfCTF = false; let wantRatingOfTDM4v4 = false
				for (const element of args) {
					if (element.length == 3) {
						if (strEq(element, 'ctf')) {
							wantRatingOfCTF = true
						} else if (strEq(element, 'tdm')) {
							wantRatingOfTDM4v4 = true
						}
					} else if (element.length == 6) {
						if (strEq(element, '5v5ctf') || strEq(element, 'ctf5v5') || strEq(element, '4v4ctf') || strEq(element, 'ctf4v4') ) {
							wantRatingOfCTF = true
						} else if ( strEq(element, 'tdm') || strEq(element, '4v4tdm') || strEq(element, 'tdm4v4') ) {
							wantRatingOfTDM4v4 = true
						}
					}
				}
				if (wantRatingOfCTF) {
					if (wantRatingOfTDM4v4) {
						// checkSteamIDthenSendRatingOfBothModesToChannel(member.id, message)
						checkSteamIDthenSendRatingOfModeToChannel(member.id, message, 'ctf')
					} else {
						checkSteamIDthenSendRatingOfModeToChannel(member.id, message, 'ctf')
					}
				} else {
					if (wantRatingOfTDM4v4) {
						checkSteamIDthenSendRatingOfModeToChannel(member.id, message, 'tdm')
					} else {
						if (args.length == 1) {
							// checkSteamIDthenSendRatingOfBothModesToChannel(member.id, message)
							checkSteamIDthenSendRatingOfModeToChannel(member.id, message, 'ctf')
						}
					}
				}
			}
			else {
				let wantRatingOfCTF = false; let wantRatingOfTDM4v4 = false
				for (const element of args) {
					if (element.length == 3) {  // Tiny optimization, may be removed
						if (strEq(element, 'ctf')) {
							wantRatingOfCTF = true
						} else if (strEq(element, 'tdm')) {
							wantRatingOfTDM4v4 = true
						}
					} else if (element.length == 6) {
						if (strEq(element, '5v5ctf') || strEq(element, 'ctf5v5') || strEq(element, '4v4ctf') || strEq(element, 'ctf4v4') ) {
							wantRatingOfCTF = true
						} else if ( strEq(element, 'tdm') || strEq(element, '4v4tdm') || strEq(element, 'tdm4v4') ) {
							wantRatingOfTDM4v4 = true
						}
					}
				}
				if (wantRatingOfCTF) {
					if (wantRatingOfTDM4v4) {
						// checkSteamIDthenSendRatingOfBothModesToChannel(message.author.id, message)
						checkSteamIDthenSendRatingOfModeToChannel(message.author.id, message, 'ctf')
					} else {
						checkSteamIDthenSendRatingOfModeToChannel(message.author.id, message, 'ctf')
					}
				} else {
					if (wantRatingOfTDM4v4) {
						checkSteamIDthenSendRatingOfModeToChannel(message.author.id, message, 'tdm')
					} else {
						if (args.length == 1) {
							// checkSteamIDthenSendRatingOfBothModesToChannel(message.author.id, message)
							checkSteamIDthenSendRatingOfModeToChannel(message.author.id, message, 'ctf')
						}
					}
				}
			}
		}
	}
}