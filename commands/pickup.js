const discordJS = require('discord.js')
const fetch = require('node-fetch')
const Game = require('../Game')
const Player = require('../Players')
const teams = require('../teams')

const client      = require('../index.js').client
const removeOneID = require('../index.js').removeOneID
const strEq       = require('../index.js').strEq
const mega        = require('../index.js').mega
const red         = require('../index.js').red
const a           = require('../index.js').a       // This is the array containing fake players used for testing

Array.prototype.removeOneID = removeOneID

// for (let i = 123456001; i <= 123456010; i++) {
	
	// var y = i.toString()
	
	// const player = {
		// id: y,
		// username: a.find(obj => obj.id == y).name
	// }
	
	// // Game.findOne( {type: '5v5ctf'} ).then((doc0) => {
		// if (i <= 123456008) {  // && doc0 != null
			// // Game.findOneAndUpdate( { type: 'ctf' }, {$pull:{players: player }}, {new: true} )
			// // .then((doc) => {})
			// addFor5v5CTFnoMsg(i.toString())
		// }
	// // })
// }
// for (let i = 123456001; i <= 123456010; i++) {
	
	// var y = i.toString()
	
	// const player = {
		// id: y,
		// username: a.find(obj => obj.id == y).name
	// }
	
	// Game.findOne( {type: 'tdm'} ).then((doc0) => {
		// if (doc0 != null && i <= 123456006) {
			// Game.findOneAndUpdate( { type: 'tdm' }, {$addToSet:{players: player }}, {new: true} )
			// .then((doc) => {})
		// }
	// })
// }


// gets rating for the player
async function get_rating(steamid, mode)
{
	const respose = await fetch(`http://stats.houseofquake.com/elo/${steamid}`)
	if(respose) {
		const data = await respose.json()
		if(data) {
			if (mode === 'ctf') {
				if (data.playerinfo[steamid].ratings.ctf.games == 0) {
					// return 25.00
					return a.find( obj => obj.id == steamid).ctf
				}
				else {
					return data.playerinfo[steamid].ratings.ctf.elo
				}
			}
			else {  // mode === 'tdm'
				if (data.playerinfo[steamid].ratings.tdm.games == 0) {
					// return 25.00
					return a.find( obj => obj.id == steamid).tdm
				}
				else {
					return data.playerinfo[steamid].ratings.tdm.elo
				}
			}
		}
		else {
			if (mode === 'ctf')
				// return 25.00
				return a.find( obj => obj.id == steamid).ctf
			else  // mode === 'tdm'
				// return 25.00
				return a.find( obj => obj.id == steamid).tdm
		}
	}
	else {
		if (mode === 'ctf')
			// return 25.00
			return a.find( obj => obj.id == steamid).ctf
		else  // mode === 'tdm'
			// return 25.00
			return a.find( obj => obj.id == steamid).tdm
	}
}

GetPlayerNameAndRating = function(player1, mode) {
	if ( player1.id >= 123456001 && player1.id <= 123456010 ) {
		playerFromArray = a.find(obj => obj.id == player1.id)
		if (mode == 'ctf') {
			result = { username: playerFromArray.name, rating: playerFromArray.ctf }
			return result
		} else {  // mode == 'tdm'
			result = { username: playerFromArray.name, rating: playerFromArray.tdm }
			return result
		}
	}
	else {
		// console.log("YES1")
		var promise = new Promise(function(resolve, reject) {
			// console.log("YES2")
			var result = { username: '', rating: 0 }
			const player2 = Player.findOne({ discordID: player1.id })
			.then(async player2 => {
				// console.log("YES3")
				// console.log(player1)
				var rating3 = await get_rating(player2.steamid, mode)
				result = { username: player1.username, rating: rating3 }
				// console.log(result)
				// return result
				resolve(result)
			})
			// resolve(result)
		})
	}
	
	return promise;
};

// connects rating and discord username together 
async function getPlayersRatingsInMode(players, mode)
{
	var arr = []
	
	for (var player of players) {
		var temp = await GetPlayerNameAndRating(player, mode)
		// if ( temp === undefined ) {
			// console.log("YES4")
		// }
		arr.push(temp)
	}
	
	return arr
}

module.exports = {
	name: 'pickup',
	description: "pickups",
	execute(command, message, args) {
		if(strEq('add2', command)) {  // Special command for debugging
			addTestingFunction1(message, args)
		}
		
		const player = {
			id: message.author.id,
			username: message.author.username
		}
		
		Player.findOne({ discordID: player.id })
		.then(async function(player2) {
			if (!player2)
			{
				let DiscordUser = await client.users.fetch(message.author.id)
				let DiscordName = DiscordUser.username
				
				let msg = "**Steam ID** of `" + DiscordName + "` not found. Type your **Steam ID** number next to !steamid (i.e., \"!steamid **<Steam ID>**\").\n**Steam ID** is easily found in your Quake Live folder \"C:\\Program Files\\steamapps\\common\\Quake Live\\\\**<Steam ID>**\\baseq3\"."
				message.channel.send(msg)
			} else {
				if (args.length == 0) {
					// add for 5v5 CTF by default
					addFor4v4CTF(true, player, message)
				} else {  // args.length >= 1
					let addingTo4v4CTF = false; let addingTo5v5CTF = false; let addingTo4v4TDM = false
					let foundCTF       = false; let found4v4       = false; let found5v5       = false
					for (const element of args) {
						if (element.length == 3) {  // Tiny optimization, may be removed
							if (strEq('ctf', element)) {
								foundCTF = true
								if (found4v4) addingTo4v4CTF = true
								if (found5v5) addingTo5v5CTF = true
							} else if (strEq('4v4', element)) {
								found4v4 = true
								if (foundCTF) addingTo4v4CTF = true
							} else if (strEq('5v5', element)) {
								found5v5 = true
								addingTo5v5CTF = true
							} else if (strEq('tdm', element)) {
								addingTo4v4TDM = true
							}
						} else if (element.length == 4) {
							if ( strEq('both', element) ) {
								found4v4 = true; found5v5 = true;
								if (foundCTF) { addingTo4v4CTF = true; addingTo5v5CTF = true }
							}
						} else if (element.length == 6) {
							if ( strEq('4v45v5', element) || strEq('4v45v5', element) ) {
								found4v4 = true; found5v5 = true;
							} else if ( strEq('4v4ctf', element) || strEq('ctf4v4', element) ) {
								addingTo4v4CTF = true
							} else if ( strEq('5v5ctf', element) || strEq('ctf5v5', element) ) {
								addingTo5v5CTF = true
							} else if ( strEq('4v4tdm', element) || strEq('tdm4v4', element) ) {
								addingTo4v4TDM = true
							}
						}
					}
					
					if (foundCTF && !found4v4 && !found5v5) {  // 5v5 CTF is the default CTF mode by default
						addingTo5v5CTF = true
					}
					
					if (found4v4 && !foundCTF && !addingTo4v4TDM) {  // If have 4v4 but no game mode, then default to 4v4 CTF
						addingTo4v4CTF = true
					}
					
					addingTo5v5CTF = false; addingTo4v4TDM =false  // TEMP line
					addForAllSuccessively(player, message, addingTo4v4CTF, addingTo5v5CTF, addingTo4v4TDM)
				}
			}
		})
	},
	async addFor5v5CTFnoMsg(playerDiscordID) {  // Used for testing
		if (playerDiscordID >= 123456001 && playerDiscordID <= 123456010) {
			const fakePlayer = a.find(obj => obj.id == playerDiscordID)
			const player = {
				id: playerDiscordID,
				username: fakePlayer.name
			}
			Game.findOneAndUpdate({ type: '5v5ctf' }, {$addToSet:{players: player}}, {new: true} )
			.then((doc) => {
				
			})
		} else {
			let DiscordUser = await client.users.fetch(playerDiscordID)
			let DiscordName = DiscordUser.username
			
			const player = {
				id: playerDiscordID,
				username: DiscordName
			}
			
			Player.findOne({ discordID: player.id })
			.then(async function(player2) {
				if (!player2)
				{
					console.log("Error: player with given DiscordID was not found in DB (no SteamID is saved for this user).")
				} else {
					Game.findOneAndUpdate({ type: '5v5ctf' }, {$addToSet:{players: player}}, {new: true} )
					.then((doc) => {
						
					})
				}
			})
		}
	},
	async addFor4v4CTFnoMsg(playerDiscordID) {  // Used for testing	[same as addFor5v5CTFnoMsg()]
		if (playerDiscordID >= 123456001 && playerDiscordID <= 123456010) {
			const fakePlayer = a.find(obj => obj.id == playerDiscordID)
			const player = {
				id: playerDiscordID,
				username: fakePlayer.name
			}
			Game.findOneAndUpdate({ type: '4v4ctf' }, {$addToSet:{players: player}}, {new: true} )
			.then((doc) => {
				
			})
		} else {
			let DiscordUser = await client.users.fetch(playerDiscordID)
			let DiscordName = DiscordUser.username
			
			const player = {
				id: playerDiscordID,
				username: DiscordName
			}
			
			Player.findOne({ discordID: player.id })
			.then(async function(player2) {
				if (!player2)
				{
					console.log("Error: player with given DiscordID was not found in DB (no SteamID is saved for this user).")
				} else {
					Game.findOneAndUpdate({ type: '4v4ctf' }, {$addToSet:{players: player}}, {new: true} )
					.then((doc) => {
						
					})
				}
			})
		}
	},
	get_rating,
	GetPlayerNameAndRating,
	getPlayersRatingsInMode
}

async function addForAllSuccessively(player, message, addingTo4v4CTF, addingTo5v5CTF, addingTo4v4TDM) {
	await addFor4v4CTF(addingTo4v4CTF, player, message).then(async() => {
		await addFor5v5CTF(addingTo5v5CTF, player, message).then(async() => {
			await addFor4v4TDM(addingTo4v4TDM, player, message)
		})
	})
}

async function addFor4v4CTF(doAdd, player, message) {
	if (!doAdd ) return
	
	Player.findOne({ discordID: player.id })
	.then(async function(player2) {
		if (!player2)
		{
		} else {
			Game.findOneAndUpdate({ type: '4v4ctf' }, {$addToSet:{players: player}}, {new: true} )
			.then((doc) => {
				// if (doc.players.length === 8)
				// {
					// let msg = '**Quake Live CTF 4v4** is ready!\nPlayers:'
					// doc.players.forEach((player1) => {
						// if(player1.id >= 123456001 && player1.id <= 123456010) {
							// msg += " `" + (a.find(obj => obj.id == player1.id)).name + "`"
						// } else {
							// msg += ` <@${player1.id}>`
						// }
						
						// Game.findOne({ type:'5v5ctf', players:{$elemMatch:{id:player1.id}} }, function (err, resGame) {
							// if( resGame ) {
								// resGame.players.removeOneID(player1.id)
								// resGame.save()
							// }
						// })
						// Game.findOne({ type:'4v4tdm', players:{$elemMatch:{id:player1.id}} }, function (err, resGame) {
							// if( resGame ) {
								// resGame.players.removeOneID(player1.id)
								// resGame.save()
							// }
						// })
					// })
					
					// doc.players.forEach((player1) => {
						// if(player1.id >= 123456001 && player1.id <= 123456010) {
						// } else {
							// client.users.fetch(player1.id, false).then((user) => {
								// user.send(msg);
							// });
						// }
					// })
					// message.channel.send(msg)
					
					// getPlayersRatingsInMode(doc.players, 'ctf') // returns blue & red teams + map picker and team averages
					// .then(async teams1 => {
						// setTimeout(async () => {
							// let teams2 = teams(teams1, 4)
							// let suggestedMap = 'japanesecastles'
							// const embed = new discordJS.MessageEmbed()
							// .setTitle('Teams')
							// .addFields(
							// {   // name: '<:ra:842882867747225601> ' + 'Red team ' + `(${teams2.redAvg})`,
								// name: '<:ra:842882692865065011> ' + 'Red team ' + `(${teams2.redAvg})`,
								// value: `${teams2.redTeam}`,
								// inline: true,
							// },
							// {   // name: '<:mh:842882841527451689> ' + 'Blue team ' + `(${teams2.blueAvg})`,
								// name: '<:mh:842882661692604416> ' + 'Blue team ' + `(${teams2.blueAvg})`,
								// value: `${teams2.blueTeam}`,
								// inline: true,
							// })
							// .addField('Map picker‍', ' ' + teams2.picker, false)
							// // .addField('‍', '**Suggested Map:** ' + suggestedMap, true)
							// message.channel.send(embed)
						 // }, 500);
					// })

					// doc.players = []
					// doc.save()
				// } else {
					let msg = '**Wednesday CTF 4v4 Signup List** [' + doc.players.length + ']:'
					doc.players.forEach((player1) => {
						msg += " `" + player1.username + "`"
					})
					message.channel.send(msg)
					doc.save()
				// }
			})
		}
	})
}

async function addFor5v5CTF(doAdd, player, message) {
	if (!doAdd ) return
	
	Player.findOne({ discordID: player.id })
	.then(async function(player2) {
		if (!player2)
		{
		} else {
			Game.findOneAndUpdate({ type: '5v5ctf' }, {$addToSet:{players: player}}, {new: true} )
			.then((doc) => {
				if (doc.players.length === 10)
				{
					let msg = '**Quake Live CTF 5v5** is ready!\nPlayers:'
					doc.players.forEach((player1) => {
						if(player1.id >= 123456001 && player1.id <= 123456010) {
							msg += " `" + (a.find(obj => obj.id == player1.id)).name + "`"
						} else {
							msg += ` <@${player1.id}>`
						}
						
						Game.findOne({ type:'4v4ctf', players:{$elemMatch:{id:player1.id}} }, function (err, resGame) {
							if( resGame ) {
								resGame.players.removeOneID(player1.id)
								resGame.save()
							}
						})
						Game.findOne({ type:'4v4tdm', players:{$elemMatch:{id:player1.id}} }, function (err, resGame) {
							if( resGame ) {
								resGame.players.removeOneID(player1.id)
								resGame.save()
							}
						})
					})
					
					doc.players.forEach((player1) => {
						if(player1.id >= 123456001 && player1.id <= 123456010) {
						} else {
							client.users.fetch(player1.id, false).then((user) => {
								user.send(msg);
							});
						}
					})
					message.channel.send(msg)
					
					getPlayersRatingsInMode(doc.players, 'ctf') // returns blue & red teams + map picker and team averages
					.then(async teams1 => {
						setTimeout(async () => {
							let teams2 = teams(teams1, 5)
							let suggestedMap = 'japanesecastles'
							const embed = new discordJS.MessageEmbed()
							.setTitle('Teams')
							.addFields(
							{   // name: '<:ra:842882867747225601> ' + 'Red team ' + `(${teams2.redAvg})`,
								name: '<:ra:842882692865065011> ' + 'Red team ' + `(${teams2.redAvg})`,
								value: `${teams2.redTeam}`,
								inline: true,
							},
							{   // name: '<:mh:842882841527451689> ' + 'Blue team ' + `(${teams2.blueAvg})`,
								name: '<:mh:842882661692604416> ' + 'Blue team ' + `(${teams2.blueAvg})`,
								value: `${teams2.blueTeam}`,
								inline: true,
							})
							.addField('Map picker‍', ' ' + teams2.picker, false)
							// .addField('‍', '**Suggested Map:** ' + suggestedMap, true)
							message.channel.send(embed)
						 }, 500);
					})

					doc.players = []
					doc.save()
				} else {
					let msg = '**Quake Live CTF 5v5** [' + doc.players.length + '/10]:'
					doc.players.forEach((player1) => {
						msg += " `" + player1.username + "`"
					})
					message.channel.send(msg)
					doc.save()
				}
			})
		}
	})
}

async function addFor4v4TDM(doAdd, player, message) {
	if (!doAdd ) return
	
	Player.findOne({ discordID: player.id })
	.then(async function(player2) {
		if (!player2)
		{
		} else {
			Game.findOneAndUpdate({ type: '4v4tdm' }, {$addToSet:{players: player}}, {new: true} )
			.then(async (doc) => {
				if (doc.players.length === 8) {
					let msg = '**Quake Live TDM 4v4** is ready!\nPlayers:'
					doc.players.forEach((player1) => {
						if(player1.id >= 123456001 && player1.id <= 123456010) {
							msg += " `" + (a.find(obj => obj.id == player1.id)).name + "`"
						} else {
							msg += ` <@${player1.id}>`
						}
						
						Game.findOne({ type:'4v4ctf', players:{$elemMatch:{id:player1.id}} }, function (err, resGame) {
							if( resGame ) {
								resGame.players.removeOneID(player1.id)
								resGame.save()
							}
						})
						Game.findOne({ type:'5v5ctf', players:{$elemMatch:{id:player1.id}} }, function (err, resGame) {
							if( resGame ) {
								resGame.players.removeOneID(player1.id)
								resGame.save()
							}
						})
					})
					
					doc.players.forEach((player1) => {
						if(player1.id >= 123456001 && player1.id <= 123456010) {
						} else {
							client.users.fetch(player1.id, false).then((user) => {
								user.send(msg);
							});
						}
					})
					message.channel.send(msg)
					
					getPlayersRatingsInMode(doc.players, 'tdm') // returns blue & red teams + map picker and team averages
					.then(async teams1 => {
						setTimeout(async () => {
							let teams2 = teams(teams1, 4)
							let suggestedMap = 'japanesecastles'
							const embed = new discordJS.MessageEmbed()
							.setTitle('Teams')
							.addFields(
							{   // name: '<:ra:842882867747225601> ' + 'Red team ' + `(${teams2.redAvg})`,
								name: '<:ra:842882692865065011> ' + 'Red team ' + `(${teams2.redAvg})`,
								value: `${teams2.redTeam}`,
								inline: true,
							},
							{   // name: '<:mh:842882841527451689> ' + 'Blue team ' + `(${teams2.blueAvg})`,
								name: '<:mh:842882661692604416> ' + 'Blue team ' + `(${teams2.blueAvg})`,
								value: `${teams2.blueTeam}`,
								inline: true,
							})
							.addField('Map picker‍', ' ' + teams2.picker, false)
							// .addField('‍', '**Suggested Map:** ' + suggestedMap, true)
							message.channel.send(embed)
						 }, 500);
					})

					doc.players = []
					doc.save()
				} else {
					var msg = '**Quake Live TDM 4v4** [' + doc.players.length + '/8]:'
					doc.players.forEach((player1) => {
						msg += " `" + player1.username + "`"
					})
					message.channel.send(msg)
					doc.save()
				}
			})
		}
	})
}

function addTestingFunction1(message, args) {  // This is the function called when using the made for testing the command "!add2" made to test and add fake players
	const player = {
		id: args[0],
		username: a.find(obj => obj.id == args[0]).name
	}
	
	Game.findOneAndUpdate({ type: 'ctf' }, {$addToSet:{players: player }}, {new: true} )
	.then((doc) => {
		Player.findOne({ discordID: player.id })
		
		if (doc.players.length === 10) {
			let msg = '**Quake Live CTF 5v5** is ready!\nPlayers:'
			doc.players.forEach((player1) => {
				if(player1.id >= 123456001 && player1.id <= 123456010) {
					msg += " `" + (a.find(obj => obj.id == player1.id)).name + "`"
				} else {
					msg += ` <@${player1.id}>`
				}
			})
			message.channel.send(msg)
			
			getPlayersRatingsInMode(doc.players, 'ctf') // returns blue & red teams + map picker and team averages
			.then(async teams1 => {
				setTimeout(async () => {
					let teams2 = teams(teams1, 5)
					let suggestedMap = 'japanesecastles'
					const embed = new discordJS.MessageEmbed()
					.setTitle('Teams')
					.addFields(
					{   // name: '<:ra:842882867747225601> ' + 'Red team ' + `(${teams2.redAvg})`,
						name: '<:ra:842882692865065011> ' + 'Red team ' + `(${teams2.redAvg})`,
						value: `${teams2.redTeam}`,
						inline: true,
					},
					{   // name: '<:mh:842882841527451689> ' + 'Blue team ' + `(${teams2.blueAvg})`,
						name: '<:mh:842882661692604416> ' + 'Blue team ' + `(${teams2.blueAvg})`,
						value: `${teams2.blueTeam}`,
						inline: true,
					})
					.addField('Map picker‍', ' ' + teams2.picker, false)
					// .addField('‍', '**Suggested Map:** ' + suggestedMap, true)
					message.channel.send(embed)
				 }, 500);
			})

			doc.players = []
			doc.save()
		} else {
			var msg = '**Quake Live CTF 5v5** [' + doc.players.length + '/10]:'
			doc.players.forEach((player1) => {
				msg += " `" + player1.username + "`"
			})
			message.channel.send(msg)
			doc.save()
		}
	})
	return
}