const Command = require('./../Command')
const mongoose = require('mongoose')

module.exports = 
{
    name: 'customcommand',
    description: "set / update / delete custom commands",

    execute(command, message, args)
    {
        if (command === 'set')
        {
            var cmd = args[0]
            args.shift()

            const newCommand = new Command({
                Command: cmd,
                Response: args.join(' ')
            })

            newCommand.save()
            .then((command_set) => {
                message.channel.send(`Command: ${command_set.Command} added.`)
            })
            .catch(err => message.channel.send('Command already exists!'))
        }
        else if (command === 'delete')
        {
            Command.findOneAndDelete({ Command: args })
            .then(message.channel.send(`Command: ${args} deleted successfully.`))
        }
        else if (command === 'update')
        {
            var cmd = args[0]
            args.shift()
            Command.findOneAndUpdate({ Command: cmd }, { $set:{ Response: args.join(' ')}}, { new: true }, (err, doc) => {
                if(err)
                {
                    console.log('Error')
                }
                else 
                {
                    message.channel.send(`Command: ${cmd} updated successfully.`)
                }
            })
        }
    }
}