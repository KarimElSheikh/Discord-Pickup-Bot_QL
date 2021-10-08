const express = require('express')
const app = express()
const config = require('./config.json')
const discordJS = require('discord.js')

const fs = require('fs')
const readline = require('readline');

var quotes = []
var quotesAuthors = []

const filename = "./Text Files/my_quotesModified.txt";

// fs.readFile(filename, 'utf8', function(err, data) {
  // if (err) throw err;
  // console.log('OK: ' + filename);
  // console.log(data)
// });

var curQuote  = ""
var curAuthor = ""

async function processLineByLine() {
	const fileStream = fs.createReadStream(filename);
	
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.
	

	let readingQuoteTrueAuthorFalse = true
	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		// console.log(`Line from file: ${line}`);
		// if(line.
		if (line.length != 0) {
			if (readingQuoteTrueAuthorFalse) {
				if (curQuote.length != 0) {
					curQuote += '\n'
				}
				curQuote += line
				if (line.charAt(line.length - 1) == `"`) {
					quotes.push(curQuote)
					curQuote = ""
					readingQuoteTrueAuthorFalse = false
					
				}
			} else {
				if (curAuthor.length != 0) {
					curAuthor += '\n'
				}
				curAuthor += line
			}
		} else {
			if (readingQuoteTrueAuthorFalse) {
				if (curAuthor.length != 0) {
					curAuthor += '\n'
				}
				curAuthor += line
				if (line.charAt(line.length - 1) == `"`) {
					quotes.push(curQuote)
					curQuote = ""
					readingQuoteTrueAuthorFalse = false
					
				}
			} else {
				if (curAuthor.length > 0) {
					quotesAuthors.push(curAuthor.substring(0, curAuthor.length - 1))
				} else {
					quotesAuthors.push(curAuthor)
				}
				curAuthor = ""
				readingQuoteTrueAuthorFalse = true
			}
		}
	}
}

processLineByLine()
.then(() => {
	console.log("Number of quotes in the bot:" + quotes.length)
	// for(let i = 0; i < 5; i++) {
		// console.log(quotes[i])
		// console.log("\u2014 " + quotesAuthors[i])
		// console.log("")
	// }
})



app.get('/', (req, res) => {
    res.send('Pickup Bot')
})

app.listen(5000, () => {
    console.log('Server has started')
})

const mongoose = require('mongoose')
// const mongoDB_ServerAddress = 'mongodb://localhost/test'
const mongoDB_ServerAddress = config.MONGODB_SERVERADDRESS

mongoose.connect(mongoDB_ServerAddress, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(function(){
		console.log('MongoDB Connected...')
	})
    .catch(err => console.log(err))

const client = new discordJS.Client()
// const fs = require('fs')
const Command = require('./Command')
const Game = require('./Game')
const Player = require('./Players')
const teamstest = require('./teamstest')

const fetch = require('node-fetch')

client.commands = new discordJS.Collection()
const prefix = '!'
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))

function initializeCommandsAfterLoggingToDiscord() {
	for (const file of commandFiles)
	{
		const command = require(`./commands/${file}`)
		
		client.commands.set(command.name, command)
	}
}

// Helper function: Case-insensitive string comparison function
strEq = function (a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
}

a = [
	 {name: "NADEMAFIA MaJiNlovesMADI", ctf:31.46, tdm:16.78, id: '123456001'},
     {name: "vcxyvcxy2", ctf:26.82, tdm:20.48, id: '123456002'}, 
	 {name: "lixan", ctf:1.93, tdm:18.6, id: '123456003'},
	 {name: "l0l04", ctf:26.77, tdm:13.72, id: '123456004'},
	 {name: "Adio", ctf:7.44, tdm:15.84, id: '123456005'},
	 {name: "thomassonvaldemar", ctf:25.31, tdm:9.16, id: '123456006'},
	 {name: "toño", ctf:34.16, tdm:9.6, id: '123456007'},
	 {name: "x40", ctf:2.99, tdm:19.39, id: '123456008'},
	 {name: "siggma", ctf:30.92, tdm:26.13, id: '123456009'},
	 {name: "AC/DC Charv", ctf:1.11, tdm:29.33, id: '123456010'},
	]

// Helper function: remove one array element if its 'id' property equals arg
const removeOneID = function(arg) {
	
	for (var i = 0; i < this.length; i++) {
		if (arg == this[i].id) {
			this.splice(i, 1)
			break
		}
	}
}

async function get_rating(steamid, mode)
{
	const respose = await fetch(`http://stats.houseofquake.com/elo/${steamid}`)
	if(respose) {
		const data = await respose.json()
		if(data) {		
			if (mode === 'tdm') {
				if (data.playerinfo[steamid].ratings.tdm.games == 0) {
					return a.find( obj => obj.id ==steamid).tdm
				}
				else {
					return data.playerinfo[steamid].ratings.tdm.elo
				}
			}
			else {  // mode === 'ctf'
				if (data.playerinfo[steamid].ratings.ctf.games == 0) {
					return a.find( obj => obj.id ==steamid).ctf
				}
				else {
					return data.playerinfo[steamid].ratings.ctf.elo
				}
			}
		}
		else {
			if (mode === 'tdm')
				return a.find( obj => obj.id == steamid).tdm
			else  // mode === 'ctf'
				return a.find( obj => obj.id == steamid).ctf
		}
	}
	else {
		if (mode === 'tdm')
			return a.find( obj => obj.id ==steamid).tdm
		else  // mode === 'ctf'
			return a.find( obj => obj.id ==steamid).ctf
	}
}

client.login(config.TOKEN)

mega = client.emojis.cache.get('842882841527451689')
red = client.emojis.cache.get('842882867747225601')

// const ctf4v4 = new Game({type: '4v4ctf', players: []})
// ctf4v4.save()
// const ctf5v5 = new Game({type: '5v5ctf', players: []})
// ctf5v5.save()
// const tdm4v4 = new Game({type: '4v4tdm', players: []})
// tdm4v4.save()

// Game.deleteMany({}, function(err, result) {
// if (err) {
	// // res.send(err);
// } else {
	// // res.send(result);
// }
// }).then(() => {
	// console.log('Successfully deleted all Game entries.')
// })

// Game.deleteMany( { type: { $eq: '4v4tdm' } } ).then(function(){
    // console.log("Data deleted");
// }).catch(function(error){
    // console.log(error);
// });
// Game.deleteMany( { type: { $eq: '4v4ctf' } } ).then(function(){
    // console.log("Data deleted");
// }).catch(function(error){
    // console.log(error);
// });
// Game.deleteMany( { type: { $eq: '5v5ctf' } } ).then(function(){
    // console.log("Data deleted");
// }).catch(function(error){
    // console.log(error);
// });

client.on('ready', async () => {
    console.log('Bot has started and successfully logged in!')
	
	initializeCommandsAfterLoggingToDiscord()
	
	// fetch Snag's bot testing server as a guild by its id and store it in the cache of client.
	client.guilds.fetch(config.TESTING_DISCORD_SERVER_ID)
	  // .then(guild => console.log(guild.name))
	  .catch(console.error);
	  
	// mega = client.guilds.cache.get(config.TESTING_DISCORD_SERVER_ID).emojis.get('842882841527451689')
	// red = client.guilds.cache.get(config.TESTING_DISCORD_SERVER_ID).emojis.get('842882867747225601')
	  
	// fetch The Nine Hells server as a guild
	client.guilds.fetch(config.DISCORD_SERVER_ID)
	  // .then(guild => console.log(guild.name))
	  .catch(console.error);
	
	// client.guilds.cache.get(config.DISCORD_SERVER_ID).leave()
	// .catch(err => {
		// console.log(`There was an error leaving the guild: \n ${err.message}`);
	// })
	
	// test_playerObj = {
		// username: config.playerObj_USERNAME,
		// id: config.playerObj_DISCORD_ID
	// }
	
	
	// Game.findOneAndUpdate( { type: '4v4ctf' }, {players:[]} )
	// .then(async (doc) => {
		// doc.save()
	// })
	
	// Game.findOne( { type: '4v4ctf' } )
	// .then(async(doc) => {
		// if(doc != null) {
			// // doc.save()
			// for (let i = 123456001; i <= 123456010; i++) {
				// var i_asString = i.toString()
				
				// const player = {
					// id: i_asString,
					// username: a.find(obj => obj.id == i_asString).name
				// }
				// // console.log(player)
				
				// // await Game.findOneAndUpdate({ type: "4v4ctf" }, {$pull:{ players: { id: i_asString} }})
				
				
				// // await client.commands.get('pickup').addFor4v4CTFnoMsg(i_asString)
			// }
		// }
	// })
	// .then((doc) => {
		// doc.save()
	// })
	
	// .then(async function() {
		// await client.commands.get('pickup').addFor4v4CTFnoMsg(config.playerObj_DISCORD_ID)  // add playerObj_USERNAME to CTF pickup silently
	// })
	
	let curDayOfWeeklyBiPlay_isSun = true
	let now = new Date(), nextUpdate, wait
	
	if (curDayOfWeeklyBiPlay_isSun) {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
    } else {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0, 0, 0);
    }
})

client.on('message', (message) => {
    if (message.author.bot || !message.content.toLowerCase().startsWith(prefix) || message.guild === null)
        return 

    const args = message.content.slice(prefix.length).split(' ')
    const command = args.shift().toLowerCase()

    if (command.length >= 3 && command.substring(0, 3) == 'add' || command == 'a')
    {
        client.commands.get('pickup').execute(command, message, args)
    }
    else if (command.length == 3 && command == 'who' || command == 'w')
    {
        client.commands.get('who').execute(message, args)
    }
	else if (command.length == 4 && command == 'list' || command == 'l')
    {
        client.commands.get('list').execute(message, args)
    }
    else if (command.length == 6 && command == 'remove' || command == 'r')
    {
        client.commands.get('remove').execute(message, args)
    }
    else if (command.length == 7 && command == 'steamid')
    {
        client.commands.get('steamid').execute(message, args)
    }
    else if (command.length == 6 && command == 'rating')
    {
        client.commands.get('rating').execute(message, args)
    }
    else if ( ( command.length == 13 && command == 'removesteamid' || command.length == 10 && command == 'remsteamid')
	         && message.member.hasPermission('MANAGE_MESSAGES') )
    {
        client.commands.get('removesteamid').execute(message, args)
    }
    else if (command.length == 4 && command == 'pull' && message.member.hasPermission('MANAGE_MESSAGES'))
    {
        client.commands.get('pull').execute(message, args)
    }
    else if (command.length >= 3 && command.substring(0, 3) == 'top')
    {
        client.commands.get('top10').execute(command, message, args)
    }
    else if ( command.length >= 4 && ( command.substring(0, 4) == 'maps' || command.substring(0, 4) == 'pool') )
    {
        client.commands.get('mappool_length4').execute(command, message, args)
    }
    else if ( command.length >= 7 && ( command.substring(0, 7) == 'mappool' || command.substring(0, 7) == 'maplist') )
    {
        client.commands.get('mappool_length7').execute(command, message, args)
    }
	// Commented the below 'else if' for now so that this function gets to be non-async
    // else if (command === 'test')
    // {
        // const teams = await teamstest()
            // console.log(teams)
            // const embed = new discordJS.MessageEmbed()
            // .setTitle('Auto Teams')
            // .addFields(
            // {
                // name: '<:ql_ra:835289571993976892>' + ' Red ' + `(${teams.redAvg})` ,
                // value: `${teams.redTeam}`,
                // inline: true,
            // },
            // {
                // name: '<:ql_ma:835289571968417813> ' + ' Blue ' + `(${teams.blueAvg})` ,
                // value: `${teams.blueTeam}`,
                // inline: true,
            // },
            // {
               // name: 'Map Picker',
               // value: "`" + teams.picker + "`",
               
            // })
            // message.channel.send(embed)
    // }
    else if (command.length == 5 && command == 'quote')
    {
        client.commands.get('quote').execute(message, args)
    }
    else if ((command === 'set' || command === 'delete' || command === 'update') && message.member.roles.cache.some( r=> ["Admins: Philosophers in Limbo"].includes(r.name)))
    {
        if (args === null)
            message.channel.send('No params entered.')
        else 
            client.commands.get('customcommand').execute(command, message, args)
    }

    Command.findOne({ Command: command.toLowerCase() })
    .then(user => {
            if (user)
            {
                if (user.Response.includes("<name>"))
                {
                    if (message.author.id === '266266272780648458')
                        message.channel.send(')))')
                    else 
                        message.channel.send(user.Response.replace('<name>', `<@${message.author.id}>`))
                } else 
                    message.channel.send(user.Response)
            }
    })
})

/*client.on('presenceUpdate', (oldPresence, newPresence) => {
    const member = newPresence.member
    console.log(member)
    if (newPresence.status === 'offline')
    {
        Game.findOneAndUpdate({ type: "4v4tdm" }, {$pull:{ players: { id: member.id} }})
        .then(() => {
                client.channels.fetch(config.OLD_CHANNEL_ID)
                .then(channel => {
                    channel.send("removed" + "`" + member.username + "`" + "from **TDM** as they went offline.")
                })
        })

        Game.findOneAndUpdate({ type: "4v4ctf" }, {$pull:{ players: { id: member.id} }}, {new: true})
        .then((doc) => {
                client.channels.fetch(config.OLD_CHANNEL_ID)
                .then(channel => {
                    channel.send("removed" + "`" + member.username + "`" + "from **CTF** as they went offline.")
                })
        })
    }
})*/

// module.exports = {
	// customPlayers: {},
    // createPlayer(name, ctf, tdm, id) {
        // module.exports.users[id] = {
            // name: name,
            // ctf: ctf,
            // tdm: tdm,
            // id: id
        // };
    // }
	
    // findPlayer(id) {
        // return module.exports.customPlayers[id]
    // }
	// createPlayer(name, ctf, tdm, id) {
		// module.exports.customPlayers[id] = { name, ctf, tdm, id };
	// },
	// findPlayer(id) {
		// return module.exports.customPlayers[id]
	// }
// }

module.exports = {
	client,
	removeOneID,
	strEq,
	red,
	mega,
	a,
	quotes,
	quotesAuthors
}