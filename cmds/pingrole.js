module.exports.run = async(bot, message, prefix) =>{
  let Owner = message.guild.roles.find(r => r.name == "Owner")    
  let Staff = message.guild.roles.find(r => r.name == "Staff")
  let PlayerRole = message.guild.roles.find(r => r.name == "Player")
  let muted = message.guild.roles.find(r => r.name == "Muted")
  let pingRole = message.guild.roles.find(r => r.name == "Ping")
  if(message.member.roles.has(pingRole.id)) return await message.channel.send("What? You already have the ping role? Make sure to count your apples and try again!")
  message.member.addRole(pingRole.id);
  return await message.reply('I have given you the ping role!')  
}