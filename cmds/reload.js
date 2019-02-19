module.exports.run = async(bot, message, prefix) =>{
        var args = message.content.split(' ').slice(1)
        if(message.author.id != '353782817777385472' && message.author.id != "186487324517859328") return await message.channel.send("This command is restricted to developers!");
        try{
          delete require.cache[require.resolve(`./${args[0]}.js`)]
        }catch(err){
                console.log(err)
                return message.channel.send("Error in reloading, check console.")
        }
        
        return message.channel.send(`${args[0]} has been reloaded on all shards!`)
}
