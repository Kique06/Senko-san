const Discord = require('discord.js');

exports.run = async (client, message, args) => {

let author = message.author
let arg = args.slice(0).join(" ")

let avatar = message.author.displayAvatarURL({format: "png"});
const helpembed = new Discord.MessageEmbed()
    .setColor('5a5a5a')
    .setTitle('Hi I\'m senko! Below you can see my commands')
    .addField('🎵 Music 🎵', `-S!play \n -S!stop \n -S!pause \n -S!resume \n -S!queue \n -S!loop (beta test)`)
    .addField("🔧 Support 🔧", "-S!invite \n -S!bugreport")
    .setFooter('I hope you enjoy')
    .setAuthor(message.author.tag, avatar);

    await message.channel.send(helpembed)
    await message.channel.send('**Dev note: Playlist support is ready to use! I hope you enjoy <:kiki_joinha:898695390474420244>**')
    //await message.channel.send(`<:kiki:848588352118718494> DM sent! ${message.author}!`)
}