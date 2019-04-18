const Discord = require("discord.js")
module.exports.run = async(bot, message, prefix) =>{
  let msg = message.content.toLowerCase()
  let args = msg.split(" ").slice(1)
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      let rreason = args.join(" ").slice(22)
      let reportschannel = message.guild.channels.find(c => c.name == "staff")

        message.delete()

        if(!rUser) return message.reply("Da user you searchin, is unavailable, please report later.")
        if(!rreason) return message.reply("Where da reason? i dont see any.")

        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Report-ing for duty!")
        .setColor(0xe0782b)
        .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
        .addField("Reported By", `${sender} with ID: ${message.author.id}`)
        .addField("Reason", rreason)
        .addField("Channel", message.channel)
        .addField("Reported At", message.createdAt)
        

        reportschannel.send(reportEmbed)
        message.guild.members.get(message.author.id)
        .createDM()
              .then(dm => {
                dm.send({embed: {
                  color: 0x15f153,
                  title: "User Reported" ,
                 description: `You successfully reported ${rUser}. \nReason:${rreason} \n\n Thank you for your help, we'll investigate.`,
                 timestamp: new Date(),
                  footer: {
                  icon_url: "186487324517859328".avatarURL,
                  text: `Any intentionally misleading reports \nwill not be tolorated`
                  }
                }})
              }).catch(console.error)  
}
