module.exports.run = async(bot, message, prefix) =>{
let Owner = message.guild.roles.find(r => r.name == "Owner")    
    let Staff = message.guild.roles.find(r => r.name == "Staff")
    let PlayerRole = message.guild.roles.find(r => r.name == "Player")
    let muted = message.guild.roles.find(r => r.name == "Muted")
    let pingRole = message.guild.roles.find(r => r.name == "Ping")
  if(message.author.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
    process.exit(1)
  } else {return}  
}