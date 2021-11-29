const Discord = require('discord.js')

exports.run = async (client, message, args) => {

if (user = message.mentions.users.first() || client.users.cache.get(args[0])) return;
   

let avatar = message.author.displayAvatarURL({format: "png"});
const embed = new Discord.MessageEmbed()
    .setTitle('Want to add me to your server?')
    .setColor('5a5a5a')
    .setDescription('Click here to add me! --> [link](<https://discord.com/api/oauth2/authorize?client_id=818887799104471100&permissions=137475935824&scope=bot>)')
    .setFooter('Ty')
    .setAuthor(message.author.tag, avatar);
await message.channel.send(embed);
}