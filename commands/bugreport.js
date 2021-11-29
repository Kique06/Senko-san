const Discord = require('discord.js')
const client = new Discord.Client();
const myID = 'YourIdHere' 


exports.run = async (client, message, args) => {
    var lockedList = ['Bad People here', ''];
    args.join(" ");

        const person = message.author.username
        const userID = message.author.id
        
        for(i=0;i<lockedList.length;i++){
            let locked = lockedList[i];
            if (userID == locked) {
                return message.channel.send('***You have abused this feature before and as such have been blacklisted***')
            }
        }
        
        let bug = args.slice(0).join(' ');
        
        if (!bug) {
            message.channel.send('You are trying to submit a bug report... without listing a bug!')
        } else {
            client.users.fetch(myID).then((user) => {
                let avatar = message.author.displayAvatarURL({format: "png"});
                user.send(new Discord.MessageEmbed()
                .setTitle(`bug report by ${person}`)
                .setColor('5a5a5a')
                .addField('Usuario:', message.author.tag)
                .addField(`Nome do servidor`, `${message.guild.name}`)
                .addField('ID do usuario', `${userID}`)
                .addField('Reportou o bug:', `${bug}`)
                .setAuthor(message.author.tag, avatar));

                var guild123 = client.guilds.cache.get('BugReportGuildIdHere')
                canal = guild123.channels.cache.get('BugReportChannelIdHere')
                canal.send(
                new Discord.MessageEmbed()
                .setColor('5a5a5a')
                .setTitle(`bug report by ${person}`)
                .addField('Usuario:', message.author.tag)
                .addField('Reportou o bug:', `${bug}`)
                    )
            });
            message.channel.send('**Your bug has been reported!! thanks!!....But if you abuse this feature, you will be blacklisted and prevented from using this command, beware!**');
        };
    };
    

    
