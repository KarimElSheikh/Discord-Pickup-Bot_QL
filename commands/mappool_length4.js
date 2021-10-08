const discordJS = require('discord.js')

const strEq  = require('../index.js').strEq

module.exports = {
	name: 'mappool_length4',
	description: "lists the map pool used for pickup games",
	execute(command, message, args) {
		if (args.length == 0) {
			if (command.length == 4) {
				var msg = '**Quake Live CTF 5v5** map pool: '
				msg += "`spidercrossings` `japanesecastles` `courtyard` `siberia` `shiningforces` `thedukesgarden` `ironworks` `troubledwaters` `stonekeep` `infinity` `noir`"
				msg += '\n**Quake Live TDM 4v4** map pool: '
				msg += "`campgrounds` `deepinside` `dreadfulplace` `grimdungeons` `hiddenfortress` `intervention` `limbus` `purgatory` `ragnarok` `realmofsteelrats` `terminatria` `tornado`"
				message.channel.send(msg)
			} else if (command.length == 7) {
				if ( strEq('ctf', command.substring(4,7)) ) {
					var msg = '**Quake Live CTF 5v5** map pool: '
					msg += "`spidercrossings` `japanesecastles` `courtyard` `siberia` `shiningforces` `thedukesgarden` `ironworks` `troubledwaters` `stonekeep` `infinity` `noir`"
					message.channel.send(msg)
				} else if ( strEq('tdm', command.substring(4,7)) ) {
					var msg = '**Quake Live TDM 4v4** map pool: '
					msg += "`campgrounds` `deepinside` `dreadfulplace` `grimdungeons` `hiddenfortress` `intervention` `limbus` `purgatory` `ragnarok` `realmofsteelrats` `terminatria` `tornado`"
					message.channel.send(msg)
				}
			} else if (command.length == 10) {
				if ( strEq('tdmctf', command.substring(4,10)) ||
				     strEq('ctftdm', command.substring(4,10)) )
				{
					var msg = '**Quake Live CTF 5v5** map pool: '
					msg += "`spidercrossings` `japanesecastles` `courtyard` `siberia` `shiningforces` `thedukesgarden` `ironworks` `troubledwaters` `stonekeep` `infinity` `noir`"
					msg += '\n**Quake Live TDM 4v4** map pool: '
					msg += "`campgrounds` `deepinside` `dreadfulplace` `grimdungeons` `hiddenfortress` `intervention` `limbus` `purgatory` `ragnarok` `realmofsteelrats` `terminatria` `tornado`"
					message.channel.send(msg)
				}
			}
		} else if (args.length == 1) {
			if (args[0].length == 3) {
				if ( strEq('ctf', args[0]) ) {
					var msg = '**Quake Live CTF 5v5** map pool: '
					msg += "`spidercrossings` `japanesecastles` `courtyard` `siberia` `shiningforces` `thedukesgarden` `ironworks` `troubledwaters` `stonekeep` `infinity` `noir`"
					message.channel.send(msg)
				} else if ( strEq('tdm', args[0]) ) {
					var msg = '**Quake Live TDM 4v4** map pool: '
					msg += "`campgrounds` `deepinside` `dreadfulplace` `grimdungeons` `hiddenfortress` `intervention` `limbus` `purgatory` `ragnarok` `realmofsteelrats` `terminatria` `tornado`"
					message.channel.send(msg)
				}
			} else if (args[0].length == 6) {
				if ( strEq('ctftdm', args[0]) || strEq('tdmctf', args[0]) ) {
					var msg = '**Quake Live CTF 5v5** map pool: '
					msg += "`spidercrossings` `japanesecastles` `courtyard` `siberia` `shiningforces` `thedukesgarden` `ironworks` `troubledwaters` `stonekeep` `infinity` `noir`"
					msg += '\n**Quake Live TDM 4v4** map pool: '
					msg += "`campgrounds` `deepinside` `dreadfulplace` `grimdungeons` `hiddenfortress` `intervention` `limbus` `purgatory` `ragnarok` `realmofsteelrats` `terminatria` `tornado`"
					message.channel.send(msg)
				}
			}
		} else if (args.length == 2) {
			if ( args[0].length == 3 && strEq('ctf', args[0]) &&
			     args[1].length == 3 && strEq('tdm', args[1]) ) {
				var msg = '**Quake Live CTF 5v5** map pool: '
				msg += "`spidercrossings` `japanesecastles` `courtyard` `siberia` `shiningforces` `thedukesgarden` `ironworks` `troubledwaters` `stonekeep` `infinity` `noir`"
				msg += '\n**Quake Live TDM 4v4** map pool: '
				msg += "`campgrounds` `deepinside` `dreadfulplace` `grimdungeons` `hiddenfortress` `intervention` `limbus` `purgatory` `ragnarok` `realmofsteelrats` `terminatria` `tornado`"
				message.channel.send(msg)
			} else
			if ( args[0].length == 3 && strEq('tdm', args[0]) &&
			     args[1].length == 3 && strEq('ctf', args[1]) ) {
				var msg = '**Quake Live CTF 5v5** map pool: '
				msg += "`spidercrossings` `japanesecastles` `courtyard` `siberia` `shiningforces` `thedukesgarden` `ironworks` `troubledwaters` `stonekeep` `infinity` `noir`"
				msg += '\n**Quake Live TDM 4v4** map pool: '
				msg += "`campgrounds` `deepinside` `dreadfulplace` `grimdungeons` `hiddenfortress` `intervention` `limbus` `purgatory` `ragnarok` `realmofsteelrats` `terminatria` `tornado`"
				message.channel.send(msg)
			}
		}
	}
}