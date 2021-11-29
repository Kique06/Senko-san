/*
Codigo feito por Nya.#5157
Code made by Nya.#5157

Add my bot:
https://discord.com/oauth2/authorize?client_id=813800050987106326&permissions=8&scope=bot
*/


const {  Client, MessageEmbed } = require('discord.js');
const config = require('./config');
const YouTube = require('simple-youtube-api')
const { Util } = require('discord.js')
const ytdl = require('ytdl-core')
const queue = new Map();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const youtube = new YouTube(GOOGLE_API_KEY)
const commands = require('./help');
const talkedRecently = new Set();
const prefix = config.prefix;

let bot = new Client();

bot.on('ready', () => {
    bot.user.setStatus("online")
        .catch(console.log)
    console.log('I am ready!');
});


var servers = {};

bot.on("error", (e) => console.log(e));
bot.on("warning", (e) => console.log(e));
bot.on("debug", (e) => console.log(e));

bot.on('message', (message) => {
  
    if (message.author.bot) return;
    if (message.channel.type === "dm") return; 
    if (message.content.startsWith(`<@${bot.user.id}`) || message.content.startsWith(`<@${bot.user.id}`)) return 
    
    let args = message.content.split(" ").slice(1);
    let command = message.content.split(" ")[0];

    if(command.startsWith(config.prefix)){
        command = command.slice(config.prefix.length)
        try {
            let commandFile = require(`./commands/${command}.js`);
            if (talkedRecently.has(message.author.id)) {
              return message.channel.send(`${message.author} wait 5s to use a command again!`);
            }
            delete require.cache[require.resolve(`./commands/${command}.js`)];
            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, 5000);
            return commandFile.run(bot, message, args, servers);
        } catch (err) {
            console.error("error" + err);
        }
    }
     if (message.content === '680893803590189096') {
        console.log(message.member);
        message.channel.send(`${bot.users.cache.size} users ${bot.guilds.cache.size} Islands`);

    }
    //HORA DA MÚSICA--------------------------------------------------------
    const serverQueue = queue.get(message.guild.id);
  if (message.content.startsWith(`${prefix}play`)) {//PLAY
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {//SKIP
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {//STOP
    stop(message, serverQueue);
    return
  } else if (message.content.startsWith(`${prefix}queue`)) {//QUEUE
    if (!serverQueue)
    return message.channel.send("Sorry, but there is no music playing!")
    const embed3 = new MessageEmbed()
    .setColor('5a5a5a')
    .setAuthor('Songs on the waiting list')
    .setDescription(`\n:notes: \n\n${joinObj(serverQueue.songs, "title")}`)
    message.channel.send(embed3)
    return;
  } else if (message.content.startsWith(`${prefix}pause`)) {//PAUSE
    pause(message, serverQueue)
    return;
  }
  else if (message.content.startsWith(`${prefix}resume`)) {//RESUME
    resume(message, serverQueue)
    return;
  } else if (message.content.startsWith(`${prefix}loop`)) {//loop
    loop(message, args, serverQueue)
    return;
  } else if (message.content.startsWith(`${prefix}lyrics`)) {//lyrics command
    lyrics(message, args)
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const searchString = args.slice(1).join(' ')

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You have to be on a voice channel!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Sorry I can't do this, I don't have enough permissions!"
    );
  }


  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id)
      await handleVideo(video2, message, voiceChannel, true)
    }

    return message.channel.send(`Playlist **${playlist.title}** has been added to the queue!`)

  } else {
        try {
      var video = await youtube.getVideo(url)
    } catch (error) {
      try {
        var videos = await youtube.searchVideos(searchString, 1)
        var video = await youtube.getVideoByID(videos[0].id)
      } catch (err) {
        console.log(err)
        return message.channel.send('I didn\'t find anything with that title!')
      }
    }
    return handleVideo(video, message, voiceChannel);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be on a voice channel to skip the current song!"
    );
  if (!serverQueue)
    return message.channel.send("Sorry, but there is no music playing");
  serverQueue.connection.dispatcher.end();
}

function joinObj(a, attr){
  var out = [];
  
  for (var i = 0; i < a.length; i++){
    out.push(a[i][attr]);
  }
  return out.join("\n\n--");
  
}
function loop(message, args, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be on a voice channel to use the loop command!"
    );
  if (!args) return message.channel.send("a")
  switch(args[0]) {
    case 'all':
      serverQueue.loopall = !serverQueue.loopall
      serverQueue.loopone = false
      
      if (serverQueue.loopall === true) {
        message.channel.send('Looping!')
      } else {
        message.channel.send('Unlooping!')
      }
    break;
    case 'one':
      serverQueue.loopone = !serverQueue.loopone
      serverQueue.loopall = false
      
      if (serverQueue.loopone === true) {
        message.channel.send('Looping 1 music!')
      } else {
        message.channel.send('Unlooping 1 music!')
      }
      break;
      case 'off':
        serverQueue.loopall = false
        serverQueue.loopone = false
        message.channel.send('Loop off')
        break;
      default:
        message.channel.send('Use <K!loop one> or <K!loop all>!')
  }

}

async function lyrics(message, args) {
  const lyricsFinder = require("lyrics-finder")
  let lyrics = null;
  if (!args[0]) {
    return message.channel.send("Hey, Remember to put the song author! <author> <song name>")
  }

    try {
      lyrics = await lyricsFinder(args.join(' '), "");
      if (!lyrics) lyrics = `Humm... nothing here!`;
    } catch (error) {
      lyrics = `Humm... nothing here`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setDescription(lyrics)
      .setColor("5a5a5a")

    return message.channel.send(lyricsEmbed).catch(console.error);
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be on a voice channel to stop the current song!");
    
  if (!serverQueue)
    return message.channel.send("There's no music for me to stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}
function pause(message, serverQueue) {
  if(!message.member.voice.channel)
  return message.channel.send(
      "You have to be in a voice channel to pause the current song!"
  );
  if(!serverQueue)
  return message.channel.send("the music is over!"
  );
  serverQueue.connection.dispatcher.pause();
}
function resume(message, serverQueue) {
  if(!message.member.voice.channel)
  return message.channel.send(
      "You have to be on a voice channel to be able to use this command!");
  message.channel.send('The music is playing again!')
  if(!serverQueue)
  return message.channel.send("the music is over!"
  );
  serverQueue.connection.dispatcher.resume();
}

async function handleVideo(video, message, voiceChannel, playlist = false) {
  const serverQueue = queue.get(message.guild.id)
  console.log(video)
  const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
   };

  

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join()
      .then(connection => {
        connection.voice.setSelfDeaf(true);
      queueContruct.connection = connection;
      console.log("SONG ==> ");
      console.log(queueContruct.songs[0]);
      play(message.guild, queueContruct.songs[0]);
      //ytdl(url, { filter: format => format.container === 'mp4' })
    });
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    if (playlist) return undefined
    else return message.channel.send(`🎧 | **${song.title}** Added the queue!`);
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    try {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    } catch(e) {
      return console.log(e)
    }
  }

  bot.user.setActivity(`${song.title}`, {type: "LISTENING"})
  const dispatcher = serverQueue.connection
  .play(ytdl(song.url, { filter: format => format.container === 'mp4' }))
    .on("finish", () => {
      if(serverQueue.loopone) {
        play(guild, serverQueue.songs[0]);
      }
      else if (serverQueue.loopall) {
        serverQueue.songs.push(serverQueue.songs[0])
        serverQueue.songs.shift()
      } else {
        serverQueue.songs.shift();
      }
        console.log("terminou");
      play(guild, serverQueue.songs[0]);
    })
    
    .on("error", error => console.error(error));         
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5); 
  serverQueue.textChannel.send(`🎧 | Playing: **${song.title}**`)
}

require('./server')();
bot.login(config.token);