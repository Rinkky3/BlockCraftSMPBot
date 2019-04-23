module.exports.run = async(bot, message, prefix) =>{
  const fs = require("fs")
  if(message.author.id !== "186487324517859328" && message.author.id !== "353782817777385472") return;
  const args = message.content.split(" ").slice(1);
  try {
    var evaled;
    if(args[0] != "-ml"){
      var code = args.join(" ");
      evaled = await eval(code);
    }else{
      args.shift()
      var code = args.join(" ");
      let f = new Function('message', 'bot', code)
      evaled = f(message, bot, code);
    }

    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    try{
      message.channel.send(clean(evaled), {code:"xl"}).catch(function(err) {
        console.log("new eval")
        message.channel.send("Thats one big eval")
        fs.writeFileSync("./storage/eval.txt", evaled)
        message.channel.send({
          files: [{
            attachment: "./storage/eval.txt",
            name: "eval.txt"
          }]
        })
      })
    }catch(err){

    }
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
};


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}
