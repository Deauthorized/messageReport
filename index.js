module.exports = function({ bot, knex, config, commands, threads }) {
  function log(log) {
    console.info(`[messageReport:log] ${log}`)
  }

  function err(err) {
    console.error(`[messageReport:error] ${err}`)
  }

  function sanitise(string) {
    string.replace("`", "\\`")
    string.replace("@", "\\@")
    return string;
  }

  async function isBlocked(userId) {
    const row = await knex("blocked_users").where("user_id", userId).first();
    return !!row;
  }

  log("Initializing...")

  bot.guilds.get(config.mainServerId[0]).createCommand({
    name: "Report Message",
    type: 3
  })
    .then(cmd => {
      log("Application command published to main server successfully.")
    })

    .catch(error => {
      err("Failed to publish application command. This usually means that I do not have permissions to create guild commands in the main server. Unfortunately, the only way to correct this problem is to kick the bot and re-invite it with the `application.commands` scope.")
      err(error)
      return;
    })

  bot.on("interactionCreate", async i => {
    if (!i.data.type == 3) {return;}
    if (!i.name == "Report Message") {return;}

    await i.acknowledge(64)

    if (await threads.findOpenThreadByUserId(i.member.id)) {
      await i.createFollowup( {content: "You already have an active thread."} )
      return;
    }

    if (await isBlocked(i.member.id)) {
      await i.createFollowup( {content: "You are currently blocked from creating threads."} )
      return;
    }
    const reportMsg = i.data.resolved.messages.first()

    await threads.createNewThreadForUser(i.member, {
      source: "messagereport",
      categoryId: config.categoryAutomation.newThread
    })
      .then(nt => {
        nt.postSystemMessage(`:gear: **Message Report**\n\n**${reportMsg.author.username}#${reportMsg.author.discriminator} =>  <#${reportMsg.channel.id}>:** ${sanitise(reportMsg.content)}`)
        i.createFollowup( {content: (!config.mr["reportResponseMessage"] ? "Thank you! A modmail thread has been created with this message attached." : config.mr["reportResponseMessage"])} )
      })

  })
}
