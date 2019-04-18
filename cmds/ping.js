module.exports.run = async(bot, message, prefix) =>{
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
  let Owner = message.guild.roles.find(r => r.name == "Owner")
  if(message.author.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
    let m = await message.channel.send("Ping?");
    m.edit(`Pong. Latency: ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
  } else {return}  
}
