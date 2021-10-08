const discordJS = require('discord.js')
const fetch = require('node-fetch')
const Game = require('../Game')
const Player = require('../Players')
const teams = require('../teams')

const client      = require('../index.js').client

const get_rating              = require('./pickup.js').get_rating
const GetPlayerNameAndRating  = require('./pickup.js').GetPlayerNameAndRating
const getPlayersRatingsInMode = require('./pickup.js').getPlayersRatingsInMode

module.exports = {
	name: 'who',
	description: "list players & their ratings",
	execute(message, args)
	{
		Game.findOne({ type: '4v4ctf' })
		.then(async (doc) => {
			let players = await getPlayersRatingsInMode(doc.players, 'ctf')
			.then(async players => {
				
				let number1 = Math.min(8, players.length)
				// let First8players = players.slice(0, number1)
				// First8players.sort((a, b) => b.rating - a.rating)
				
				// let str = "**Players**\n\n"
				// for (var i = 0; i < 4; i++) {
					// const plyr  = players[i]
					// const plyr2 = players[i+4]
					// str += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\t" + "`" + plyr2.username + "`" + "(" + plyr2.rating + ")" + "\n"
				// }
				// message.channel.send({embed: {
					// color: 3447003,
					// description: `${str}`
				// }});
				
				let str1 = ""
				for (let i = 0; i < Math.min(4, number1); i++) {
					// const plyr  = First8players[i]
					const plyr  = players[i]
					// str1 += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\n"
					str1 += (i+1) + ". " + "`" + plyr.username + "`" + "\n"
				}
				let str2 = ""
				for (let i = 4; i < Math.min(8, number1); i++) {
					// const plyr  = First8players[i]
					const plyr  = players[i]
					// str2 += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\n"
					str2 += (i+1) + ". " + "`" + plyr.username + "`" + "\n"
				}
				
				let fieldsArray = []
				if(str1 == "") {
					str1 = "None atm :-)"
				}
				fieldsArray.push({
					name: "Sunday CTF 4v4 Players",
					value: str1,
					inline: true
				})
				if(number1 > 4) {
					fieldsArray.push({
						name: "\u200b",
						value: str2,
						inline: true
					})
					
					if(players.length > 8) {
						fieldsArray.push({
							name: "\u200b",
							value: "\u200b",
							inline: true
						})
						
						let i = 8
						let firstIteration = true
						while(i < players.length) {
							str1 = ""
							number1 = Math.min(players.length, i + 4)
							for(; i < number1; i++) {
								const plyr  = players[i]
								// str1 += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\n"
								str1 += (i+1) + ". " + "`" + plyr.username + "`" + "\n"
							}
							
							if(firstIteration) {
								fieldsArray.push({
									name: "Subs",
									value: str1,
									inline: true
								})
								firstIteration = false
							} else {
								fieldsArray.push({
									name: "\u200b",
									value: str1,
									inline: true
								})
							}
						}
						
						number1 = (players.length - 1) % 12
						if(number1 >= 0 && number1 <= 3) {  // previously used: players.length >= 13 && players.length <= 16 || players.length >= 25 && players.length <= 28
							fieldsArray.push({
								name: "\u200b",
								value: "\u200b",
								inline: true
							})
						}
						else if(number1 >= 8 && number1 <= 11) {  // previously used: players.length >= 21 && players.length <= 24
							fieldsArray.push({
								name: "\u200b",
								value: "\u200b",
								inline: true
							})
							fieldsArray.push({
								name: "\u200b",
								value: "\u200b",
								inline: true
							})
						}
					}
				}
				
				
				
				setTimeout(async () => {
					// const embed = new discordJS.MessageEmbed()
					// .setTitle("Players")
					// // embed.add_field(name='Title', value="\n".join([place,name,level]), inline=True)
					// // .addFields(
					// // {
						// // // name: '\u200b',
						// // name: "\u200b",
						// // // value: `${str}`,
						// // value: `${str}`,
						// // inline: true
					// // })
					// .addField("\u200b", `${str}`)
					// message.channel.send(embed)
					
					const currentTime = (new Date()).getTime()
					// emoji = discordJS.get(message.server.emojis, name="pencil2")
					// emoji1 = message.guild.emojis.find(emoji => emoji.name === "pencil2")
					
					// emoji = client.get_emoji(id='b37d783fa2330771124219f7f13f2f31')
					// emoji = message.guild.emojis.cache.find(emoji => emoji.name === "pencil2");
					// emoji = client.emojis.cache.get('855873834577166346');
					emoji = client.emojis.cache.get('855876807910490142');
					
					// console.log(emoji)
					
					// fieldsArray.push({
						// name: 'emojiXYZ',
						// value: f"{emoji} TestingXYZ",
					// })
					
					let embed1 = {embed: {
						// color: 2229666,
						color: 3447003,
						// author: {
						  // "name": "\u200b",
						  // // "url": "https://discordapp.com",
						  // "icon_url": "https://cdn.discordapp.com/attachments/842515235989749793/855890729589800960/Both_red__blue_flags_32x32.png"
						// },
						thumbnail: {
						  "url": "https://cdn.discordapp.com/attachments/842515235989749793/855895057441751121/Both_red__blue_flags_32x32C.png"
						},
						// image: {
							// url: "https://cdn.discordapp.com/attachments/842515235989749793/855895057441751121/Both_red__blue_flags_32x32C.png",
						// },
						fields: fieldsArray,
						
						footer: {
							// "icon_url": "https://cdn.discordapp.com/attachments/842515235989749793/855890729589800960/Both_red__blue_flags_32x32.png",
							"text": "Sun Aug 15th, 2021 at 21:00 CEST"
						},
						// timestamp: currentTime,
					}
					}
					
					// embed.add_field(name='emojiXYZ', value=f"{emoji} TestingXYZ")
					
					// embed1.setTimestamp()
					
					message.channel.send(embed1)
					
					// message.channel.send("\:pencil2:")

					
					// message.channel.send({embed: {
						// color: 3447003,
						// author: {
						  // name: client.user.username,
						  // icon_url: client.user.avatarURL
						// },
						// title: "This is an embed",
						// url: "http://google.com",
						// description: "This is a test embed to showcase what they look like and what they can do.",
						// fields: [{
							// name: "Fields",
							// value: "They can have different fields with small headlines."
						  // },
						  // {
							// name: "Masked links",
							// value: "You can put [masked links](http://google.com) inside of rich embeds."
						  // },
						  // {
							// name: "Markdown",
							// value: "You can put all the *usual* **__Markdown__** inside of them."
						  // }
						// ],
						// timestamp: new Date(),
						// footer: {
						  // icon_url: client.user.avatarURL,
						  // text: "© Example"
						// }
					  // }
					  // })
					  
					// const embed2 = new discordJS.MessageEmbed()
					// .setTitle('Commands list')
					// .setColor('#DAF7A6')
					// .addFields(
						// {name: 'Test 1',
						// value:`line 1
						// line 2
						// line 3`}
					// )
					// message.channel.send(embed2)
				 }, 500)
			})
		})
	}
}