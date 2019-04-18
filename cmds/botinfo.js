const Discord = require("discord.js")
module.exports.run = async(bot, message, prefix) =>{
  let bicon = bot.user.displayAvatarURL
  let botembed = new Discord.RichEmbed()
  .setDescription("Bot Information")
  .setColor(0x15f153)
  .setThumbnail(bicon)
  .addField("Bot Name", bot.user.username)
  .addField("Created At", bot.user.createdAt)
  return await message.channel.send(botembed)  
}
