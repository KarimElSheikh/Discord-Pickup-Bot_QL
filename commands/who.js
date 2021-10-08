const Game = require('../Game')
const strEq = require('../index.js').strEq

module.exports = {
	name: 'who',
	description: "lists players added for pickup",
	execute(message, args) {
		if (args.length === 0) {
			let msg
			Game.findOne({ type: '4v4ctf' })
			.then((doc1) => {
				msg = '**Quake Live CTF 4v4** [' + doc1.players.length + '/8]:'
				doc1.players.forEach((player1) => {
					msg += " `" + player1.username + "`"
				})
				
				Game.findOne({ type: '5v5ctf' })
				.then((doc2) => {
					msg += '\n**Quake Live CTF 5v5** [' + doc2.players.length + '/10]:'
					doc2.players.forEach((player1) => {
						msg += " `" + player1.username + "`"
					})
					
					Game.findOne({ type: '4v4tdm' })
					.then((doc3) => {
						msg += '\n**Quake Live TDM 4v4** [' + doc3.players.length + '/8]:'
						doc3.players.forEach((player1) => {
							msg += " `" + player1.username + "`"
						})
						message.channel.send(msg)
					})
				})
			})
		} else {
			let AskWhoSplaying4v4CTF = false; let AskWhoSplaying5v5CTF = false; let AskWhoSplaying4v4TDM = false
			let foundCTF             = false; let found4v4             = false; let found5v5             = false
			for (const element of args) {
				if (element.length == 3) {  // Slight tiny optimization, may be removed
					if (strEq('ctf', element)) {
						foundCTF = true
						if (found4v4) AskWhoSplaying4v4CTF = true
						if (found5v5) AskWhoSplaying5v5CTF = true
					} else if (strEq('4v4', element)) {
						found4v4 = true
						if (foundCTF) AskWhoSplaying4v4CTF = true
					} else if (strEq('5v5', element)) {
						found5v5 = true
						AskWhoSplaying5v5CTF = true
					} else if (strEq('tdm', element)) {
						AskWhoSplaying4v4TDM = true
					}
				} else if (element.length == 4) {
					if ( strEq('both', element) ) {
						found4v4 = true; found5v5 = true;
						if (foundCTF) { AskWhoSplaying4v4CTF = true; AskWhoSplaying5v5CTF = true }
					}
				} else if (element.length == 6) {
					if ( strEq('4v45v5', element) || strEq('4v45v5', element) ) {
						found4v4 = true; found5v5 = true;
					} else if ( strEq('4v4ctf', element) || strEq('ctf4v4', element) ) {
						AskWhoSplaying4v4CTF = true
					} else if ( strEq('5v5ctf', element) || strEq('ctf5v5', element) ) {
						AskWhoSplaying5v5CTF = true
					} else if ( strEq('4v4tdm', element) || strEq('tdm4v4', element) ) {
						AskWhoSplaying4v4TDM = true
					}
				}
			}
			
			if (foundCTF && !found4v4 && !found5v5) {  // 5v5 CTF is the default CTF mode by default
				AskWhoSplaying5v5CTF = true
			}
			
			if (found4v4 && !foundCTF && !AskWhoSplaying4v4TDM) {  // If have 4v4 but no game mode, then default to 4v4 CTF
				AskWhoSplaying4v4CTF = true
			}
			
			whoSplayingAllSuccessivelyThenSendMsg(message, AskWhoSplaying4v4CTF, AskWhoSplaying5v5CTF, AskWhoSplaying4v4TDM)
		}
	}
}

async function whoSplayingAllSuccessivelyThenSendMsg(message, AskWhoSplaying4v4CTF, AskWhoSplaying5v5CTF, AskWhoSplaying4v4TDM) {
	let msg = ''
	msg = await whoSplayingAllSuccessively(msg, AskWhoSplaying4v4CTF, AskWhoSplaying5v5CTF, AskWhoSplaying4v4TDM)
	if (msg != '')
		message.channel.send(msg)
}

async function whoSplayingAllSuccessively(msg, AskWhoSplaying4v4CTF, AskWhoSplaying5v5CTF, AskWhoSplaying4v4TDM) {
	var promise = new Promise(async function(resolve, reject) {
		msg = await whoSplaying4v4CTF(msg, AskWhoSplaying4v4CTF).then(async(msg) => {
			msg = await whoSplaying5v5CTF(msg, AskWhoSplaying5v5CTF).then(async(msg) => {
				msg = await whoSplaying4v4TDM(msg, AskWhoSplaying4v4TDM).then(async(msg) => {
					resolve(msg)
				})
			})
		})
	})
	
	return promise
}

async function whoSplaying4v4CTF(msg, ask) {
	if (!ask) return msg
	
	await Game.findOne({ type: '4v4ctf' }).then((doc) => {
		if (msg == '')
			msg = '**Quake Live CTF 4v4** [' + doc.players.length + '/8]:'
		else
			msg += '\n**Quake Live CTF 4v4** [' + doc.players.length + '/8]:'
		doc.players.forEach((player1) => {
			msg += " `" + player1.username + "`"
		})
	})
	
	return msg
}

async function whoSplaying5v5CTF(msg, ask) {
	if (!ask) return msg
	
	await Game.findOne({ type: '5v5ctf' }).then((doc) => {
		if (msg == '')
			msg = '**Quake Live CTF 5v5** [' + doc.players.length + '/10]:'
		else
			msg += '\n**Quake Live CTF 5v5** [' + doc.players.length + '/10]:'
		doc.players.forEach((player1) => {
			msg += " `" + player1.username + "`"
		})
	})
	
	return msg
}

async function whoSplaying4v4TDM(msg, ask) {
	if (!ask) return msg
	
	await Game.findOne({ type: '4v4tdm' }).then((doc) => {
		if (msg == '')
			msg = '**Quake Live TDM 4v4** [' + doc.players.length + '/8]:'
		else
			msg += '\n**Quake Live TDM 4v4** [' + doc.players.length + '/8]:'
		doc.players.forEach((player1) => {
			msg += " `" + player1.username + "`"
		})
	})
	
	return msg
}