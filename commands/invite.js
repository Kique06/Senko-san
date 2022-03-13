const Discord = require('discord.js')

exports.run = async (client, message, args) => {
   
   let avatar = message.author.displayAvatarURL({format: "png"});
   const embed = new Discord.MessageEmbed()
       .setTitle('Want to add me to your server?')
       .setColor('5a5a5a')
       .setDescription('Click here to add me! --> [link](<Your invite here>)')
       .setFooter('Ty')
       .setAuthor(message.author.tag, avatar);
   await message.channel.send(embed);
}
