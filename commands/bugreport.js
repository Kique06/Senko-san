const Discord = require('discord.js')
const client = new Discord.Client();
const myID = '680893803590189096' 
//var lockedList = ["680893803590189096"]; 


exports.run = async (client, message, args) => {
    var lockedList = ['613831867606630451', ''];
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
                .setImage(message.author.displayAvatarURL())
                .setColor('5a5a5a')
                .addField('Usuario:', message.author.tag)
                .addField(`Nome do servidor`, `${message.guild.name}`)
                .addField('ID da guld da mensagem', `${message.guild.id}`)
                .addField('ID do usuario', `${userID}`)
                .addField('Reportou o bug:', `${bug}`)
                .setAuthor(message.author.tag, avatar));

                var guild123 = client.guilds.cache.get('886972849997369394')
                canal = guild123.channels.cache.get('900067135143948389')
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
    

    
