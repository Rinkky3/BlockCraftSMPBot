// Calling the package
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const ms = require("ms"); // npm install ms -s
const ytdl = require("ytdl-core");
const opus = require("opusscript");
const YouTube = require("simple-youtube-api")

// Okay, i wont worry about it ;)
const workCooldown = new Set();
const mutedSet = new Set();
const queue = new Map();
const youtube = new YouTube(process.env.ytapi)
var stopping = false;
var voteSkipPass = 0;
var voted = 0;
var playerVoted = [];
const profanities = ["test", "test2"];

const commands = ["pingrole", "leaderboard", "rpingrole", "botinfo", "serverinfo", "roleinfo", "member", "report", "coinflip", "diceroll", "work", "8ball", "play", "skip", "volume", "np", "queue"]

// json files
var userData = JSON.parse(fs.readFileSync("./storage/userData.json", "utf8"))
console.log(userData)

// Listener Event: Bot Launched
bot.on('ready', () => {
    console.log('Power Level Stabilised') // Runs when the bot is launched

    //const botchat = bot.channels.get("469992574791319552")
    //const generalchat = bot.channels.get("469490700845580298")
    //generalchat.send(`Topic of the week: `)
    
    
    bot.user.setActivity("Wᒷ ⍑ᔑ⍊ᒷ ╎リℸ ̣ ᒷ∷ᒷᓭℸ ̣  ℸ ̣ 𝙹 t⍑ᒷ eꖎ↸ᒷ∷ oリᒷᓭ") 

});

//event listener: join/leave a voice channel
bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  let ivc = newMember.guild.roles.find("name", "In Voice Call");
  
  if(oldUserChannel === undefined && newUserChannel !== undefined) { // User Joins a voice channel
    newMember.addRole(ivc).catch(console.error);
  } else if(newUserChannel === undefined) { // User leaves a voice channel
    newMember.removeRole(ivc).catch(console.error);
  }
});


// event listener: new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'pending');
    const channelinfo = member.guild.channels.find('name', 'info');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome ${member}! The applications are closed right now, but feel free to stay! We will be opening applications again the next season!`); //You can apply to get whitelisted, by clicking the link provided here: ${channelinfo}. Your answers must be a paragraph long. Good luck! 
    
  });

// Event listener: Message Received ( This will run every time a message is received)
bot.on('message', async message => {
    // Variables
    let sender = message.author; // The person who sent the message
    let msg = message.content.toLowerCase();
    let prefix = '`' // The text before commands
    if (bot.user.id === sender.id) { return }
    let nick = sender.username
    let Owner = message.guild.roles.find('name', "Owner")    
    let Staff = message.guild.roles.find('name', "Staff")
    let PlayerRole = message.guild.roles.find('name', "Player")
    let muted = message.guild.roles.find('name', "Muted")
    let pingRole = message.guild.roles.find('name', "Ping")
    
    
    //json stuff
    if (!userData[sender.id]) userData[sender.id] = {}
    if (!userData[sender.id].appsNumber) userData[sender.id].appsNumber = 0;
    if (!userData[sender.id].username) userData[sender.id].username = sender.username;
    if (!userData[sender.id].warns) userData[sender.id].warns = 0;

    fs.writeFile('./storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
    });
	
    
    // commands

    // Ping / Pong command
    if (msg === prefix + 'ping') {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
        let m = await message.channel.send("Ping?");
        m.edit(`Pong. Latency: ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
      } else {return}
    };
    
	
	// Help
    if(msg.split(' ')[0] === prefix + 'help'){
	console.log('HELP INITIATED!')
      	let args = msg.split(" ").slice(1);
	console.log(args[0])
	
	if(!args[0]){
		let embed = new Discord.RichEmbed()
		.setDescription("All available commands")
		.setColor(0x00fff3)
		for(var i = 0; i < commands.length; i++){
			embed.addField("Command:", commands[i])
		}
		await message.channel.send(embed)
		return await message.channel.send("For info on a specific command, do `help (command)")
	}

	if(args[0] === "pingrole"){
		let embed = new Discord.RichEmbed()
		.setDescription("Ping role")
		.setColor(0x00fff3)
		.addField("Usage:", "`pingrole")
		.addField("Description:", "Get the ping role for the announcements of lesser importance.")
		return await message.channel.send(embed)
	}
	if(args[0] === "rpingrole"){
		let embed = new Discord.RichEmbed()
		.setDescription("Remove ping role")
		.setColor(0x00fff3)
		.addField("Usage:", "`rpingrole")
		.addField("Description:", "Remove the ping role from yourself.")
		return await message.channel.send(embed)
	}
        if(args[0] === "botinfo"){
		let embed = new Discord.RichEmbed()
		.setDescription("Bot info")
		.setColor(0x00fff3)
		.addField("Usage:", "`botinfo")
		.addField("Description:", "Retrieve information about the bot.")
		return await message.channel.send(embed)
	}
	if(args[0] === "serverinfo"){
		let embed = new Discord.RichEmbed()
		.setDescription("Server info")
		.setColor(0x00fff3)
		.addField("Usage:", "`serverinfo")
		.addField("Description:", "Retrieve information about the server.")
		return await message.channel.send(embed)
	}
	if(args[0] === "roleinfo"){
		let embed = new Discord.RichEmbed()
		.setDescription("Role info")
		.setColor(0x00fff3)
		.addField("Usage:", "`roleinfo @(role)")
		.addField("Description:", "Retrieve information about a role, do not use this excessively!")
		return await message.channel.send(embed)
	}
	if(args[0] === "member"){
		let embed = new Discord.RichEmbed()
		.setDescription("Member info")
		.setColor(0x00fff3)
		.addField("Usage:", "`memberinfo @(member)")
		.addField("Description:", "Retrieve information about a member, do not over use this!")
		return await message.channel.send(embed)
	}
	if(args[0] === "report"){
		let embed = new Discord.RichEmbed()
		.setDescription("Report")
		.setColor(0x00fff3)
		.addField("Usage:", "`report @(member) (reason)")
		.addField("Description:", "Report another user.")
		return await message.channel.send(embed)
	}   
	if(args[0] === "play"){
		let embed = new Discord.RichEmbed()
		.setDescription("Play a song")
		.setColor(0x00fff3)
		.addField("Usage:", "`play (Search term/URL)")
		.addField("Description:", "Play some groovy tunes.")
		return await message.channel.send(embed)
	} 
	if(args[0] === "skip"){
		let embed = new Discord.RichEmbed()
		.setDescription("Skip a song")
		.setColor(0x00fff3)
		.addField("Usage:", "`skip")
		.addField("Description:", "Skip the worst songs, a vote!")
		return await message.channel.send(embed)
	}  
	if(args[0] === "np"){
		let embed = new Discord.RichEmbed()
		.setDescription("Now playing")
		.setColor(0x00fff3)
		.addField("Usage:", "`np")
		.addField("Description:", "Like this song, check its name.")
		return await message.channel.send(embed)
	}      
	if(args[0] === "volume"){
		let embed = new Discord.RichEmbed()
		.setDescription("Check/set the volume")
		.setColor(0x00fff3)
		.addField("Usage:", "`volume OR `volume (num)")
		.addField("Description:", "Check/set the volume. Do not do this to ear rape people!")
		return await message.channel.send(embed)
	}  
	if(args[0] === "queue"){
		let embed = new Discord.RichEmbed()
		.setDescription("List the queue")
		.setColor(0x00fff3)
		.addField("Usage:", "`queue")
		.addField("Description:", "See what tunes are in the queue.")
		return await message.channel.send(embed)
	}
	if(args[0]) return message.channel.send("Hm. Check your spelling and try again!")
    };
    
	
    // Applications and stuff
    if (msg === prefix + 'applied'){
        let appchannel = message.guild.channels.find(`name`, "staff")
        let pending = message.guild.roles.find('name', "In-Progress")    
        if (!message.member.roles.has(pending.id)) return message.channel.send(sender + ", you are not in-progress!")
        if(userData[sender.id].appsNumber === 5) return message.channel.send(sender + ', you have exceeded your maximum number of applications, if this is a mistake, please contact <@186487324517859328> or <@353782817777385472>')
        userData[sender.id].appsNumber = (userData[sender.id].appsNumber+1)
        let m = await message.reply('I have notified the staff that you have applied, please ensure that your answer\'s are at least a paragraph long, if they are not, your application will be discarded.')
        
        let m1 = await appchannel.send(`<@&${Staff.id}>`)
        let applyEmbed = new Discord.RichEmbed()
        .setDescription("**___New application___**")
        .setColor(0x15f153)
        .addField('Name:', sender)
        .addField("ID", sender.id)
        .addField("Applied at", message.createdAt)

        appchannel.send(applyEmbed)
        
        .then(message.guild.members.get("186487324517859328")
        .createDM()
        .then(dm => {
          dm.send({embed: {
            color: 0xff0000,
            title: "Application DM" ,
           description: `BlockCraft Has a new application you need to review, please do immidiately.` ,
           timestamp: new Date(),
            footer: {
            icon_url: "353782817777385472".avatarURL,
            text: "New Application"
            }
          }})
        }))
    };
 
    // Deny
    if (msg.split(" ")[0] === prefix + "deny"){
      let args = msg.split(" ").slice(1)
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      let rreason = args.join(" ").slice(22)
      message.delete()
      if (!message.member.roles.has(Owner.id) && !message.member.roles.has(Staff.id)) return message.channel.send("You do not have access to this command")
      if (!rUser) return message.channel.send('This user doesn\'t exist')
      let denyEmbed = new Discord.RichEmbed()
      .setDescription("**___User Denied___**")
      .setColor(0xFF0000)
      .addField('Name of user denied:', rUser)
      .addField('Reason', rreason)
      .addField('Retry', "Dont worry, you can just apply again!")
      message.guild.channels.find(`name`, "pending").send(denyEmbed)
    };
    
    // Accept
    if (msg.split(" ")[0] === prefix + "accept"){
      let pending = message.guild.roles.find('name', "In-Progress")    
      let args = msg.split(" ").slice(1)
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      message.delete()
      if (!message.member.roles.has(Owner.id) && !message.member.roles.has(Staff.id)) return message.channel.send("You do not have access to this command")
      if (!rUser) return message.channel.send('This user doesn\'t exist')
      rUser.addRole(PlayerRole.id);
      rUser.removeRole(pending.id);
      message.guild.channels.find(`name`, "general").send(`Welcome our newest member, ${rUser}! \n\n You will be whitelisted soon! Make sure to check the #info, #faq and #announcements channels, for any updates! Claim your land in #claimed-land channel, throw your ideas on #ideas and have a good one!`)
    };

    // Delete msgs
    if (msg.split(" ")[0] === prefix + "purge"){
        if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
            let args = msg.split(" ").slice(1)
            let num = Number(args[0]);
            if (num > 100 || num < 2){
                return message.reply('Please enter a number between 2 and 100')
            }
            message.channel.bulkDelete(num).then(() => {
            message.channel.send("Purged " + num + " messages.").then(msg => msg.delete(5300));
            });
        }else {return}
    };


    //Single Poll
    if (msg.startsWith("poll:")) {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) { 
            let m = await message.react("👍")
            let m2 = await message.react("👎")
            let m3 = await message.react("🤷")
        } else {return};
      };


    //4poll
    if (msg.startsWith("4poll:")) {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) { 
            let m = await message.react("🤔")
            let m2 = await message.react("👉")
            let m3 = await message.react("👌")
            let m4 = await message.react("🖕")
        } else {return};
      };


    //get ping role
    if (msg === prefix + "pingrole"){
	if(message.member.roles.has(pingRole.id)) return await message.channel.send("What? You already have the ping role? Make sure to count your apples and try again!")
        message.member.addRole(pingRole.id);
        return await message.reply('I have given you the ping role!')
    };
    

    //remove ping role
    if (msg === prefix + "rpingrole"){
	if(!message.member.roles.has(pingRole.id)) return await message.channel.send("Bu - Bu - But you don't even have it? What are you asking of me?")
        message.member.removeRole(pingRole.id);
        return await message.reply('I have removed the ping role from you!')
    };


    //timed message
    //const generalchat = bot.channels.get("469490700845580298")
    //let timer = bot.setInterval(timedMessage, /*172800000*/10800000);
    //let timer2 = bot.setInterval(timedMessage2, 300000);
    
    //function timedMessage() {
      //generalchat.send(`Topic of the week: `)
      //.catch(console.error)};


    //bot info command
    if (msg === prefix + "botinfo") {
        let bicon = bot.user.displayAvatarURL

        let botembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor(0x15f153)
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username)
        .addField("Created At", bot.user.createdAt)

        message.channel.send(botembed)
    };


    //serverinfo command
    if (msg === prefix + "serverinfo") {
      let sicon = message.guild.iconURL
        
        let serverembed = new Discord.RichEmbed()
        .setDescription("__**Server Information**__")
        .setColor(0x15f153)
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("Total Members", message.guild.memberCount)
        .addField("Emoji", message.guild.emojis + "*work in progress*")

        await message.channel.send(serverembed)

    };


    //member info
    if (msg.split(" ")[0] === prefix + "member") {
      //ex `member @Rinkky
      let args = msg.split(" ").slice(1)
      let rMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      let micon = rMember.displayAvatarURL

        if(!rMember) 
          return message.reply("Who dat user? I dunno him.")

          let memberembed = new Discord.RichEmbed()
          .setDescription("__**Member Information**__")
          .setColor(0x15f153)
          .setThumbnail(micon)
          .addField("Name", rMember)
          .addField("ID", rMember.id)
          .addField("Joined at", rMember.joinedAt)
  
          await message.channel.send(memberembed)

    };


    //role info
    if (msg.split(" ")[0] === prefix + "roleinfo") {
          //ex `roleinfo @owner
          //let args = msg.split(" ").slice(1)
          let rRole = message.mentions.roles.first()
          if(!rRole) return message.reply("Who dat role? I cant find it.")
          var rmembers = message.guild.roles.get(rRole.id).members.map(m=>m.user.tag)
          var numMembers = rmembers.length
          if(numMembers == 0) {
           let roleembed = new Discord.RichEmbed()
          .setDescription("__**Role Information**__")
          .setColor(0x15f153)
          .addField("Name", rRole)
          .addField("ID", rRole.id)
          .addField(`Members with this role (${numMembers}):`, "None");
          await message.channel.send(roleembed) 
          }
          let roleembed = new Discord.RichEmbed()
          .setDescription("__**Role Information**__")
          .setColor(0x15f153)
          .addField("Name", rRole)
          .addField("ID", rRole.id)
          .addField(`Members with this role (${numMembers}):`, rmembers.join('\n'));
          await message.channel.send(roleembed) 
    };

    //reports
    if (msg.split(" ")[0] === prefix + "report") {
      //ex `report @Rinkky racist
      let args = msg.split(" ").slice(1)
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      let rreason = args.join(" ").slice(22)
      let reportschannel = message.guild.channels.find(`name`, "staff")

        message.delete()

        if(!rUser) return message.reply("Da user you searchin, is unavailable, please report later.")
        if(!rreason) return message.reply("Where da reason? i dont see any.")

        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Report-ing for duty!")
        .setColor(0xe0782b)
        .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
        .addField("Reported By", `${sender} with ID: ${sender.id}`)
        .addField("Reason", rreason)
        .addField("Channel", message.channel)
        .addField("Reported At", message.createdAt)
        

        reportschannel.send(reportEmbed)
        message.guild.members.get(sender.id)
        .createDM()
              .then(dm => {
                dm.send({embed: {
                  color: 0x15f153,
                  title: "User Reported" ,
                 description: `You successfully reported ${rUser}. \nReason:${rreason} \n\n Thank you for your help, we'll investigate.`,
                 timestamp: new Date(),
                  footer: {
                  icon_url: "186487324517859328".avatarURL,
                  text: `Any intentionally misleading reports \nwill not be tolorated`
                  }
                }})
              })
    };
    
    
    // MUSIC STUFF

    const serverQueue = queue.get(message.guild.id);
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


    // I no touch dw

    if (msg.startsWith(prefix + "eval")) {
      if(sender.id !== "186487324517859328") return;
      const args = message.content.split(" ").slice(1);
      try {
        const code = args.join(" ");
        let evaled = eval(code);
  
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
  
        message.channel.send(clean(evaled), {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }


    //stopping the bot
    if (msg === prefix + 'stop') {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
        process.exit(1)
      } else {return}
    };

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
        queue.set(message.guild.id, queueConstruct);
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
	for (var prop in userData) {
		if (userData.hasOwnProperty(prop)) {
		    arr.push({
			'key': prop,
			'value': userData[prop].money
		    });
		}
	}
	arr.sort(function(a, b) { return b.value - a.value; });
	return arr;
}
//  Login

// the bot.token('token')
bot.login(process.env.token);
