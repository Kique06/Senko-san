const Discord = require('discord.js')

exports.run = async (client, message, args) => {
  function makeNegative(args) {
  var a = args.Number
  if (a > 1) {
    return message.channel.send(`-${args}`)
  } else {
    return message.channel.send(args)
  }
}
makeNegative(args)
}