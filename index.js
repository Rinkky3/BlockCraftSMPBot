// Calling the package
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const ms = require("ms"); // npm install ms -s
const ytdl = require("ytdl-core");
const opus = require("opusscript");
const YouTube = require("simple-youtube-api")
bot.commands = new Discord.Collection();

// Okay, i wont worry about it ;)
const workCooldown = new Set();
const mutedSet = new Set();
bot.queue = new Map();
const youtube = new YouTube(process.env.ytapi)
bot.stopping = false;
var voteSkipPass = 0;
var voted = 0;
var playerVoted = [];
const profanities = ["test", "test2"];

const requestOpts = {
	hostname: "mcapi.us",
	path: "/server/status?ip=54.39.87.40&port=25578",
	method: 'GET'
} 
const http = require('http')

const commands = ["admin","pingrole", "leaderboard", "rpingrole", "botinfo", "serverinfo", "roleinfo", "member", "report", "coinflip", "diceroll", "work", "8ball", "play", "skip", "volume", "np", "queue"]

// json files
bot.userData = JSON.parse(fs.readFileSync("./storage/userData.json", "utf8"))
console.log(bot.userData)

// Listener Event: Bot Launched
bot.on('ready', async () => {
    console.log('Power Level Stabilised') // Runs when the bot is launched

    //const botchat = bot.channels.get("469992574791319552")
    //const generalchat = bot.channels.get("469490700845580298")
    //generalchat.send(`Topic of the week: `)
    
		let status = await getUserCount()
		console.log(await status)
    
    bot.user.setActivity(`Current online members: ${status.players.now}`)
    fs.readdir("./cmds/", (err, files) => {
    	if(err) console.error(err)
    	
    	let jsfiles = files.filter(f => f.split(".").pop() === "js")
    	
    	if(jsfiles <= 0){
    		return console.log("Nothing loaded.")
    	}
    	
    	jsfiles.forEach((f, i) => {
    		let props = require(`./cmds/${f}`)
    		bot.commands.set(f, props)
    	});
    });
		setInterval(async () => {
			let stats = await getUserCount().catch((e) => console.error(e))
			bot.user.setActivity(`Current online members: ${await status.players.now}`)
		}, 300000)
});

//event listener: join/leave a voice channel
bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  let ivc = newMember.guild.roles.find(r => r.name == "In Voice call");
  
  if(oldUserChannel === undefined && newUserChannel !== undefined) { // User Joins a voice channel
    newMember.addRole(ivc).catch(console.error);
  } else if(newUserChannel === undefined) { // User leaves a voice channel
    newMember.removeRole(ivc).catch(console.error);
  }
});


// event listener: new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(c => c.name == 'pending');
    const channelinfo = member.guild.channels.find(c => c.name == "info");
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome ${member}! You can apply to get whitelisted, by clicking the link provided here: ${channelinfo}. Each answer must be a paragraph long. Good luck!`); //You can apply to get whitelisted, by clicking the link provided here: ${channelinfo}. Your answers must be a paragraph long. Good luck! 
    
  });

// Event listener: Message Received ( This will run every time a message is received)
bot.on('message', async message => {
    // Variables
    let sender = message.author; // The person who sent the message
    let msg = message.content.toLowerCase();
    let prefix = '`' // The text before commands
    if (bot.user.id === message.author.id) { return }
    let nick = sender.username
    let Owner = message.guild.roles.find(r => r.name == "Owner")    
    let Staff = message.guild.roles.find(r => r.name == "Staff")
    let PlayerRole = message.guild.roles.find(r => r.name == "Player")
    let muted = message.guild.roles.find(r => r.name == "Muted")
    let pingRole = message.guild.roles.find(r => r.name == "Ping")
    
    
    //json stuff
    if (!bot.userData[message.author.id]) bot.userData[message.author.id] = {}
    if (!bot.userData[message.author.id].appsNumber) bot.userData[message.author.id].appsNumber = 0;
    if (!bot.userData[message.author.id].username) bot.userData[message.author.id].username = sender.username;
    if (!bot.userData[message.author.id].warns) bot.userData[message.author.id].warns = 0;

    fs.writeFile('./storage/userData.json', JSON.stringify(bot.userData), (err) => {
        if (err) console.error(err)
    });
    if(message.author.bot) return;
    fs.readdir("./cmds/", (err, files) => {
    	if(err) console.error(err)
    	
    	let jsfiles = files.filter(f => f.split(".").pop() === "js")
    	
    	if(jsfiles <= 0){
    		return console.log("Nothing loaded.")
    	}
    	
    	jsfiles.forEach((f, i) => {
    		let props = require(`./cmds/${f}`)
    		bot.commands.set(f, props)
    	});
    });
	
    
    // commands
    let args = message.content.toLowerCase().split(" ")
  	let cmd = bot.commands.get(`${args[0].toLowerCase().slice(prefix.length).toLowerCase()}.js`);
  	if(cmd){
  	  try{
        cmd.run(bot, message, prefix)
  	  }catch(e){
  	    let echannel = message.guild.channels.find(c => c.name == "staff")
  	    echannel.send(e.stack)
  	  }
    }


    //Single Poll
    if (msg.startsWith("poll:")) {
      if(message.author.id === "186487324517859328" || message.member.roles.has(Owner.id)) { 
            let m = await message.react("👍")
            let m2 = await message.react("👎")
            let m3 = await message.react("🤷")
        } else {return};
      };

      
    //timed message
    //const generalchat = bot.channels.get("469490700845580298")
    //let timer = bot.setInterval(timedMessage, /*172800000*/10800000);
    //let timer2 = bot.setInterval(timedMessage2, 300000);
    
    //function timedMessage() {
      //generalchat.send(`Topic of the week: `)
      //.catch(console.error)};
    
    
    // MUSIC STUFF

    const serverQueue = bot.queue.get(message.guild.id);
    if(message.content.split(" ")[0] === prefix + "play"){
        let args = message.content.split(" ").slice(1)
        const searchString = args.join(' ')
        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        const permissions = voiceChannel.permissionsFor(bot.user)
        if(!permissions.has('CONNECT')) return message.channel.send('I can\'t connect here, how do you expect me to play music?')
        if(!permissions.has('SPEAK')) return message.channel.send('I can\'t speak here, how do you expect me to play music?')
	    
	if(!args[0]) return message.reply('Please provide a search term, url or playlist link!')
	if(stopping) stopping = false;
        
        if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            const playlist = await youtube.getPlaylist(args[0]);
            var videos = await playlist.getVideos();
            for(const video of Object.values(videos)){
                var video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true)
            }
            return await message.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`);
        }else{
            try{
                var video = await youtube.getVideo(args[0])
            }catch(error){
                try{
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    let videosEmbed = new Discord.RichEmbed()
                    .setDescription("Song selection")
                    .setColor(0x15f153)
                    .addField("Songs:", videos.map(video2 => `**${++index} -** ${video2.title}`))
                    message.channel.send(videosEmbed)
                    message.channel.send("Please provide a value from 1 to 10 to select a video! You have 10 seconds")
                    try{
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                      		      	maxMatches: 1,
					time: 10000,
					errors: ['time']
				});
                    }catch(err){
                        return message.channel.send('No value given, or value was invalid, video selection canceled.')
                    }
		    	const videoIndex = parseInt(response.first().content);
                    	var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                }catch(err){
                    console.log(err)
                    return await message.channel.send("Sorry bro, cant find any results!");
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    } else if(msg === prefix + "mstop"){
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
	stopping = true;
	serverQueue.voiceChannel.leave();
        return serverQueue.textChannel.send('Cya, I\'m leaving!');
    }else if(msg === prefix + "skip"){
      if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
      if(!serverQueue) return await message.channel.send("Nothing is playing!")
	    const voiceChannel = message.member.voiceChannel;
	    for (var x = 0; x < playerVoted.length; x++) {
	    	if(sender === playerVoted[x]){
			return message.channel.send(`${sender.username}, you think you run the place? You cant vote twice!`)
		}
	    }
	    voted++;
	    playerVoted.push(sender);
	    if(voteSkipPass === 0){
		    voiceChannel.members.forEach(function() {
			 voteSkipPass++;
		    })
	    }
	    var voteSkipPass1 = voteSkipPass - 1;
	    var voteSkip = Math.floor(voteSkipPass1/2);
	    if(voteSkip === 0) voteSkip = 1;
	    
	    if(voted >= voteSkip){
		await message.channel.send('Vote skip has passed!')
	    	serverQueue.connection.dispatcher.end();
		voted = 0;
		voteSkipPass = 0;
		playerVoted = [];
	    }else{
	    	await message.channel.send(voted + '\/' + voteSkip + ' players voted to skip!')
	    }
        return undefined;
    }else if(msg === prefix + "np"){
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        
        return await message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`)
    }else if(msg.split(" ")[0] === prefix + "volume"){
        let args = msg.split(" ").slice(1)
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        if(!args[0]) return await message.channel.send(`The current volume is **${serverQueue.volume}**`);
	if(args[0] > 10 || args[0] < 0) return await message.channel.send('Please choose a number between 0 and 10!');
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5)
        serverQueue.volume = args[0];
        return await message.channel.send(`I set the volume to: **${args[0]}**`);
    }else if(msg === prefix + "queue"){
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        let queueEmbed = new Discord.RichEmbed()
        .setDescription("Queue")
        .setColor(0x15f153)
        .addField("Now playing:", `**${serverQueue.songs[0].title}**`)
        .addField("Songs:", serverQueue.songs.map(song => `**-** ${song.title}`))
        return await message.channel.send(queueEmbed)
    }
}); //the end of bot.on ------------------------------


/*one time event function
  function onetime(node, type, callback) {
    //create event
    node.addEventListener(type, function(e) {
      //remove event
      e.target.removeEventListener(e, type, arguments.callee)
        //call gandler
        return callback(e)
    })
  } draaaaaft*/

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

async function handleVideo(video, message, voiceChannel, playlist = false){
    const serverQueue = queue.get(message.guild.id)
    const song = {
                id: video.id,
                title: video.title,
                url: `https://www.youtube.com/watch?v=${video.id}`
            }
        
    if(!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        bot.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        message.channel.send(`Yo bro, you wont believe it ${song.title} has been added to the queue`)
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(error)
            queue.delete(message.guild.id)
            return message.channel.send('Sorry bro, there was an error')
        }
    } else {
        serverQueue.songs.push(song);
        if(playlist) return undefined
        return message.channel.send(`Yo bro, you wont believe it ${song.title} has been added to the queue`)
    }
    return undefined;
}

function play(guild, song){
    const serverQueue = queue.get(guild.id)
    if(stopping){
       queue.delete(guild.id);
       return;
    }
    
    if(!song){
	console.log('No song')
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return undefined;
    }
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () =>{
                console.log('Song ended');
		if(!serverQueue.songs){
		        serverQueue.voiceChannel.leave();
        		queue.delete(guild.id);
        		voted = 0;
			voteSkipPass = 0;
			playerVoted = [];
        		return undefined;
		}
		serverQueue.songs.shift();
		voted = 0;
		voteSkipPass = 0;
		playerVoted = [];
                play(guild, serverQueue.songs[0]);
            })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    if(song){
    	serverQueue.textChannel.send(`Now playing: **${song.title}**`)
    }
}

function sortObject() {
	var arr = [];
	for (var prop in bot.userData) {
		if (bot.userData.hasOwnProperty(prop)) {
		    arr.push({
			'key': prop,
			'value': bot.userData[prop].money
		    });
		}
	}
	arr.sort(function(a, b) { return b.value - a.value; });
	return arr;
}

async function getUserCount(){
	console.log("Get user count")
	return new Promise(async (resolve, reject) => {
		let body = ""
		const req = http.request(requestOpts, async (res) => {
			res.setEncoding('utf8')
			res.on('data', (chunk) => {
				body += chunk
			})
			res.on('end', () => {
				resolve(JSON.parse(body))
			})
		})

		req.on('error', (e) => {
			reject(`Error... ${e.message}`)
		})

		req.end()
	})
}
//  Login

// the bot.token('token')
bot.login(process.env.token);
