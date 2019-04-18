const Discord = require("discord.js")
module.exports.run = async(bot, message, prefix) =>{
  let sicon = message.guild.iconURL
  
  let serverembed = new Discord.RichEmbed()
  .setDescription("__**Server Information**__")
  .setColor(0x15f153)
  .setThumbnail(sicon)
  .addField("Server Name", message.guild.name)
  .addField("Created On", message.guild.createdAt)
  .addField("Total Members", message.guild.memberCount)
  .addField("Emoji", message.guild.emojis.map(e => e.toString()) + " *work in progress*")

  return await message.channel.send(serverembed)  
}
