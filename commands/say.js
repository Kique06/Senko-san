const Discord = require("discord.js");



module.exports.run = async (client, message, args) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    const sayMessage = args.join(" ");
    message.delete().catch(O_o => {});
    message.channel.send(`${sayMessage} `) 
    console.log(`${message.guild.name}__${message.author.username}_` + 'usou say' )

}