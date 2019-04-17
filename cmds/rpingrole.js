module.exports.run = async(bot, message, prefix) =>{
  let Owner = message.guild.roles.find(r => r.name == "Owner")    
  let Staff = message.guild.roles.find(r => r.name == "Staff")
  let PlayerRole = message.guild.roles.find(r => r.name == "Player")
  let muted = message.guild.roles.find(r => r.name == "Muted")
  let pingRole = message.guild.roles.find(r => r.name == "Ping")  
  if(!message.member.roles.has(pingRole.id)) return await message.channel.send("Bu - Bu - But you don't even have it? What are you asking of me?")
  message.member.removeRole(pingRole.id);
  return await message.reply('I have removed the ping role from you!')
}