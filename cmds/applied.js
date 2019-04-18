const Discord = require("discord.js")
module.exports.run = async(bot, message, prefix) =>{
  let sender = message.author; // The person who sent the message
  let msg = message.content.toLowerCase();
  if (bot.user.id === message.author.id) { return }
  let nick = sender.username
  let Owner = message.guild.roles.find(r => r.name == "Owner")    
  let Staff = message.guild.roles.find(r => r.name == "Staff")
  let PlayerRole = message.guild.roles.find(r => r.name == "Player")
  let muted = message.guild.roles.find(r => r.name == "Muted")
  let pingRole = message.guild.roles.find(r => r.name == "Ping")
  let pending = message.guild.roles.find(r => r.name == "In-Progress")    
  let args = msg.split(" ").slice(1)
  let appchannel = message.guild.channels.find(c => c.name == "staff")
  let pending = message.guild.roles.find(r => r.name == "In-Progress")    
  if (!message.member.roles.has(pending.id)) return message.channel.send(sender + ", you are not in-progress!")
  if(bot.userData[message.author.id].appsNumber === 3) return message.channel.send(sender + ', you have exceeded your maximum number of applications, if this is a mistake, please contact <@186487324517859328> or <@353782817777385472>')
  bot.userData[message.author.id].appsNumber = (bot.userData[message.author.id].appsNumber+1)
  let m = await message.reply('I have notified the staff that you have applied, please ensure that your answers are at least a paragraph long, if they are not, your application will be discarded.')
  
  let m1 = await appchannel.send(Staff.toString())
  let applyEmbed = new Discord.RichEmbed()
  .setDescription("**___New application___**")
  .setColor(0x15f153)
  .addField('Name:', sender)
  .addField("ID", message.author.id)
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
      icon_url: bot.user.avatarURL,
      text: "New Application"
      }
    }})
  }))  
}
