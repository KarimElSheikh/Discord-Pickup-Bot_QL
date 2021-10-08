const Game = require('../Game')
const client = require('../index.js').client
const removeOneID = require('../index.js').removeOneID
const strEq = require('../index.js').strEq

Array.prototype.removeOneID = removeOneID

module.exports = {
	name: 'remove',
	description: "remove",
	execute(message, args) {
		if (args.length == 0) {
			removeAllSuccessivelyThenSendOneMsg(message.author.id, message, true, true, true)
		} else {  // args.length >= 1
			let removingFrom4v4CTF = false; let removingFrom5v5CTF = false; let removingFrom4v4TDM = false
			let foundCTF           = false; let found4v4           = false; let found5v5           = false
			for (const element of args) {
				if (element.length == 3) {  // Slight tiny optimization, may be removed
					if (strEq('ctf', element)) {
						foundCTF = true
						if (found4v4) removingFrom4v4CTF = true
						if (found5v5) removingFrom5v5CTF = true
					} else if (strEq('4v4', element)) {
						found4v4 = true
						if (foundCTF) removingFrom4v4CTF = true
					} else if (strEq('5v5', element)) {
						found5v5 = true
						removingFrom5v5CTF = true
					} else if (strEq('tdm', element)) {
						removingFrom4v4TDM = true
					}
				} else if (element.length == 4) {
					if ( strEq('both', element) ) {
						found4v4 = true; found5v5 = true;
						if (foundCTF) { removingFrom4v4CTF = true; removingFrom5v5CTF = true }
					}
				} else if (element.length == 6) {
					if ( strEq('4v45v5', element) || strEq('4v45v5', element) ) {
						found4v4 = true; found5v5 = true;
					} else if ( strEq('4v4ctf', element) || strEq('ctf4v4', element) ) {
						removingFrom4v4CTF = true
					} else if ( strEq('5v5ctf', element) || strEq('ctf5v5', element) ) {
						removingFrom5v5CTF = true
					} else if ( strEq('4v4tdm', element) || strEq('tdm4v4', element) ) {
						removingFrom4v4TDM = true
					}
				}
			}
			
			if (foundCTF && !found4v4 && !found5v5) {  // 5v5 CTF is the default CTF mode by default
				removingFrom5v5CTF = true
			}
			
			if (found4v4 && !foundCTF && !removingFrom4v4TDM) {  // If have 4v4 but no game mode, then default to 4v4 CTF
				removingFrom4v4CTF = true
			}
			
			removingFrom5v5CTF = false; removingFrom4v4TDM = false  // TEMP line
			removeAllSuccessivelyThenSendOneMsg(message.author.id, message, removingFrom4v4CTF, removingFrom5v5CTF, removingFrom4v4TDM)
		}
	}
}

async function removeAllSuccessivelyThenSendOneMsg(DiscordID, message, removingFrom4v4CTF, removingFrom5v5CTF, removingFrom4v4TDM) {
	let msg = ''
	msg = await removeAllSuccessively(msg, DiscordID, message, removingFrom4v4CTF, removingFrom5v5CTF, removingFrom4v4TDM)
	if (msg != '')
		message.channel.send(msg)
}

async function removeAllSuccessively(msg, DiscordID, message, removingFrom4v4CTF, removingFrom5v5CTF, removingFrom4v4TDM) {
	var promise = new Promise(async function(resolve, reject) {
		// console.log("msg1: " + msg)
		msg = await removeFrom4v4CTFgame(msg, removingFrom4v4CTF, DiscordID, message).then(async(msg) => {
			// console.log("msg2: " + msg)
			msg = await removeFrom5v5CTFgame(msg, removingFrom5v5CTF, DiscordID, message).then(async(msg) => {
				// console.log("msg3: " + msg)
				msg = await removeFrom4v4TDMgame(msg, removingFrom4v4TDM, DiscordID, message).then(async(msg) => {
					// console.log("msg4: " + msg)
					resolve(msg)
				})
			})
		})
	})
	
	return promise
}

async function removeFrom4v4CTFgame(msg, removing, DiscordID, message) {
	if (!removing) return msg
	
	var promise = new Promise(async function(resolve, reject) {
		Game.findOne({ type:'4v4ctf', players:{$elemMatch:{id:DiscordID}} }, function (err, resGame) {
			if( resGame ) {
				resGame.players.removeOneID(DiscordID)
				
				resGame.save(async function (err) {
					if (err) {
						console.error('ERROR saving the 4v4 CTF game doc after being found and deleting the player from the array.');
					} else {
						let DiscordUser = await client.users.fetch(message.author.id)
						let DiscordName = DiscordUser.username
						if (msg == '') {
							// msg = "Removed `" + DiscordName + "` from **Quake Live CTF 4v4.**"
							msg = "Removed `" + DiscordName + "` from **Sunday CTF 4v4.**"
						}
						else {
							// msg += "\nRemoved `" + DiscordName + "` from **Quake Live CTF 4v4.**"
							msg += "\nRemoved `" + DiscordName + "` from **Sunday CTF 4v4.**"
						}
					}
					resolve(msg)
				});
			} else {
				resolve(msg)
			}
		})
	})
	
	return promise
}

async function removeFrom5v5CTFgame(msg, removing, DiscordID, message) {
	if (!removing) return msg
	
	var promise = new Promise(async function(resolve, reject) {
		Game.findOne({ type:'5v5ctf', players:{$elemMatch:{id:DiscordID}} }, function (err, resGame) {
			if( resGame ) {
				resGame.players.removeOneID(DiscordID)
				
				resGame.save(async function (err) {
					if (err) {
						console.error('ERROR saving the 5v5 CTF game doc after being found and deleting the player from the array.');
					} else {
						let DiscordUser = await client.users.fetch(message.author.id)
						let DiscordName = DiscordUser.username
						if (msg == '')
							msg = "Removed `" + DiscordName + "` from **Quake Live CTF 5v5.**"
						else
							msg += "\nRemoved `" + DiscordName + "` from **Quake Live CTF 5v5.**"
					}
					resolve(msg)
				});
			} else {
				resolve(msg)
			}
		})
	})
	
	return promise
}

async function removeFrom4v4TDMgame(msg, removing, DiscordID, message) {
	if (!removing) return msg
	
	var promise = new Promise(async function(resolve, reject) {
		Game.findOne({ type:'4v4tdm', players:{$elemMatch:{id:DiscordID}} }, function (err, resGame) {
			if( resGame ) {
				resGame.players.removeOneID(DiscordID)
				
				resGame.save(async function (err) {
					if (err) {
						console.error('ERROR saving the 4v4 TDM game doc after being found and deleting the player from the array.');
					} else {
						let DiscordUser = await client.users.fetch(message.author.id)
						let DiscordName = DiscordUser.username
						if (msg == '')
							msg = "Removed `" + DiscordName + "` from **Quake Live TDM 4v4.**"
						else
							msg += "\nRemoved `" + DiscordName + "` from **Quake Live TDM 4v4.**"
					}
					resolve(msg)
				});
			} else {
				resolve(msg)
			}
		})
	})
	
	return promise
}