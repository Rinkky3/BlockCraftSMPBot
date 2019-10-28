module.exports.run = async(bot, message, prefix) =>{
  if(message.author.id === "186487324517859328" || message.member.roles.has('469488964391141376')) {
    let args = message.content.split(" ").slice(1)
    let num = Number(args[0]);
    if (num > 100 || num < 2){
        return message.reply('Please enter a number between 2 and 100')
    }
    message.channel.bulkDelete(num).then(() => {
      message.channel.send("Purged " + num + " messages.").then(msg => msg.delete(5300));
    });
  }else {return}  
}