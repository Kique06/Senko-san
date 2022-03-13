const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let author = message.author

    let avatar = message.author.displayAvatarURL({format: "png"});
    const helpembed = new Discord.MessageEmbed()
        .setColor('5a5a5a')
        .setTitle('Hi I\'m senko! Below you can see my commands')
        .addField('🎵 Music 🎵', `-S!play \n -S!stop \n -S!pause \n -S!resume \n -S!queue \n -S!loop (beta test)`)
        .addField("🔧 Support 🔧", "-S!invite \n -S!bugreport")
        .setFooter('I hope you enjoy')
        .setAuthor(message.author.tag, avatar);

    await message.channel.send(helpembed)
}
