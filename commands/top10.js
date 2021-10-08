const discordJS = require('discord.js')
const fetch = require('node-fetch')

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

async function get_top_10(mode, range)
{
    const respose = await fetch(`http://stats.houseofquake.com/ratings/${mode}/0.json`)
    const data = await respose.json()

    var username = ''
    var rating = ''
    var matches_played = ''
    var rank = ''
    for (var i = 0; i < range; i++)
    {
        username += data.response[i].name + "\n"
        rating += data.response[i].rating + "\n"
        matches_played += data.response[i].n + "\n"
    }
    return {
        username: username,
        rating: rating,
        matches_played: matches_played,
    }
}

module.exports = 
{
    name: 'top10',
    description: "gets the ratings of the top 10 players",
    async execute(command, message, args)
    {
		if( args.length >= 3 ) return
		
		var mode = null
		var range = null
		if ( command.length == 3 ) {
			if ( args.length == 0 ) {  // ctf is the default mode if the command is given only as '!top'.
				mode = 'ctf'
				range = 10
			}
		}
		else {
			const firstDigitIdx = command.indexOf(command.match(/\d/))
			if (firstDigitIdx == -1) {
				if (command.length == 6) {
					if ( args.length == 0 ) {
						if ( command.substring(3,6).localeCompare('ctf', undefined, { sensitivity: 'accent' }) == 0 ) {  // !topctf
							mode = 'ctf'
							range = 10
						}
						else if ( command.substring(3,6).localeCompare('tdm', undefined, { sensitivity: 'accent' }) == 0 ) {  // !toptdm
							mode = 'tdm'
							range = 10
						}
					} else if ( args.length == 1 ) {
						if ( command.substring(3,6).localeCompare('ctf', undefined, { sensitivity: 'accent' }) == 0 ) {  // !topctf
							mode = 'ctf'
						}
						else if ( command.substring(3,6).localeCompare('tdm', undefined, { sensitivity: 'accent' }) == 0 ) {  // !toptdm
							mode = 'tdm'
						}
						
						if ( isNumeric(args[0]) ) {
							range = args[0]
						} else {
							return
						}
					}
				}
			}
			else if (firstDigitIdx == 3) {  // The first digit is right after '!top'.
				const AllNumbers = command.match(/\d+/g)
				if ( AllNumbers.length == 1 ) {  // Only 1 set of consecutive digits is in the string variable 'command'.
					range = AllNumbers[0]
					const subCommand = command.substring(3, command.length)
					const firstNonDigitCharIdx = subCommand.indexOf(subCommand.match(/\D/))
					
					if ( firstNonDigitCharIdx == -1 ) {  // After the lone set of consecutive digits, it's the end of the string variable 'command'.
						if( args.length == 0 ) {
							mode = 'ctf'
						} else {  // args.length == 1
							if ( args[0].length == 3 &&
							    ( args[0].localeCompare('ctf', undefined, { sensitivity: 'accent' }) == 0 || args[0].localeCompare('tdm', undefined, { sensitivity: 'accent' }) == 0 )
							   )
							{
								mode = args[0].toLowerCase()
							} else {
								return
							}
						}
					}
					else if ( firstNonDigitCharIdx == subCommand.length - 3 ) {  // After the lone set of consecutive digits, there are some non-digit characters, we check if they are of length 3.
						const compareString = subCommand.substring(firstNonDigitCharIdx,subCommand.length)
						if ( compareString.localeCompare('ctf', undefined, { sensitivity: 'accent' }) == 0 || compareString.localeCompare('tdm', undefined, { sensitivity: 'accent' }) == 0 )
						{
							mode = compareString.toLowerCase()
						}
						else {
							return
						}
					} else {
						return
					}
				} else {
					return
				}
			} else {
				return
			}
		}
		
		// console.log("mode: " + mode)
		// console.log("range: " + range)
		
		if (range == null) {
			if ( args.length == 0 )  // || args.length >= 3
				return
			if ( args.length == 2 ) {
				if ( (args[0].localeCompare('ctf', undefined, { sensitivity: 'accent' }) == 0 || args[0].localeCompare('tdm', undefined, { sensitivity: 'accent' }) == 0 ) 
				    && isNumeric(args[1])  )
				{
					mode = args[0].toLowerCase()
					range = args[1]
				}
				else if ( isNumeric(args[0] )
				         && ( args[1].localeCompare('ctf', undefined, { sensitivity: 'accent' }) == 0 || args[1].localeCompare('tdm', undefined, { sensitivity: 'accent' }) == 0 )
						)
				{
					mode = args[1].toLowerCase()
					range = args[0]
				}
			} else {  // args.length == 1
				if ( args[0].localeCompare('ctf', undefined, { sensitivity: 'accent' }) == 0 || args[0].localeCompare('tdm', undefined, { sensitivity: 'accent' }) == 0 )
				{
					mode = args[0].toLowerCase()
					range = 10
				}
				else if ( isNumeric(args[0]) )  {
					mode = 'ctf'
					range = args[0]
				}
				else {
					return
				}
			}
		}
		
        if ( range <= 0 || range >= 21 )
            return
        const lb = await get_top_10(mode, range)
        const embed = new discordJS.MessageEmbed()
            .setTitle('Top ' + range + ' ' + mode.toUpperCase())
            .addFields(
            {
                name: 'Username' ,
                value: "**" + lb.username + "**",
                inline: true
            },
            {
                name: 'Rating' ,
                value: lb.rating,
                inline: true
            },
            {
               name: 'Matches played',
               value: lb.matches_played,
               inline: true
            })
        message.channel.send(embed)
    }
}