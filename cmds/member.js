const Discord = require("discord.js")
module.exports.run = async(bot, message, prefix) =>{
  let msg = message.content.toLowerCase()
  let args = msg.split(" ").slice(1)
  let rMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
  if(!rMember) return await message.channel.send("Please provide an id or @mention")
  let micon = rMember.displayAvatarURL
  
  if(!rMember)  return message.reply("Who dat user? I dunno him.")
  
  let memberembed = new Discord.MessageEmbed()
  .setDescription("__**Member Information**__")
  .setColor(0x15f153)
  .setThumbnail(micon)
  .addField("Name", rMember)
  .addField("ID", rMember.id)
  .addField("Joined at", rMember.joinedAt)

  await message.channel.send(memberembed)
}
