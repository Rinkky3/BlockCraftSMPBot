module.exports.run = async(bot, message, prefix) =>{
  let Owner = message.guild.roles.find(r => r.name == "Owner")
  if(message.author.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
    let m = await message.channel.send("Ping?");
    m.edit(`Pong. Latency: ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
  } else {return}  
}
