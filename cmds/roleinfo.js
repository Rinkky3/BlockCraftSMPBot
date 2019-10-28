const Discord = require("discord.js")
module.exports.run = async(bot, message, prefix) =>{
  let rRole = message.mentions.roles.first()
  if(!rRole) return message.reply("Who dat role? I cant find it.")
  var rmembers = message.guild.roles.get(rRole.id).members.map(m=>m.user.tag)
  var numMembers = rmembers.length
  if(numMembers == 0) {
     let roleembed = new Discord.MessageEmbed()
    .setDescription("__**Role Information**__")
    .setColor(0x15f153)
    .addField("Name", rRole)
    .addField("ID", rRole.id)
    .addField(`Members with this role (${numMembers}):`, "None");
    return await message.channel.send(roleembed) 
  }
  let roleembed = new Discord.MessageEmbed()
  .setDescription("__**Role Information**__")
  .setColor(0x15f153)
  .addField("Name", rRole)
  .addField("ID", rRole.id)
  .addField(`Members with this role (${numMembers}):`, rmembers.join('\n'));
  await message.channel.send(roleembed)   
}
