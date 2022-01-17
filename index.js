module.exports = function({ bot, knex, config, commands, threads }) {
  const responseMsg = (!config.mr["reportResponseMessage"] ? "Thank you! Our moderators will take a look and take any action if needed." : config.mr["reportResponseMessage"])

  // Misc functions

  function log(log) {
    console.info(`[messageReport:log] ${log}`);
  }

  function err(err) {
    console.error(`[messageReport:error] ${err}`);
  }

  function escape(str) {
    let strs = str.replace(/`/g, "")
    return strs;
  }

  async function isBlocked(userId) {
    const row = await knex("blocked_users").where("user_id", userId).first();
    return !!row;
  }

  // Publish the app interaction to the main server

  bot.guilds.get(config.mainServerId[0]).createCommand({
    name: "Report Message",
    type: 3
  })
    .then(cmd => {
      log("Ready! Usage: Right Click > App > Report Message");
    })

    .catch(error => {

      // The only time this would error I think is if the bot lacked the application.commands scope, so we'll just assume that's why
      
      err("Fatal: Failed to publish the Report Message interaction in the main server. Unfortunately, the only way to correct this problem is to kick the bot and re-invite it with the `application.commands` scope.");
      err(error);
      return;
    })

  bot.on("interactionCreate", async i => {

    // Making sure this is the interaction we want

    if (!i.data.type == 3) {return;}
    if (!i.name == "Report Message") {return;}

    await i.acknowledge(64)

    if (await isBlocked(i.member.id)) {
      const row = await knex("blocked_users").where("user_id", i.member.id).first();
      await i.createFollowup( { content: `**You are currently blocked from creating threads.** This block ${(row.expires_at == null ? "has not been set to expire automatically." : `will expire <t:${Math.round(Date.parse(row.expires_at + " UTC") / 1000)}:R>.`)}` } );
      return;
    }

    // Format the reported message. Probably shouldn't be using random() but I was tired and this worked so ¯\_(ツ)_/¯

    const reportMsg = i.data.resolved.messages.random()

    const msgModel = `:pencil: **${i.member.username}** reported a message:\n**${reportMsg.author.username}#${reportMsg.author.discriminator} (<@${reportMsg.author.id}>) => <#${reportMsg.channel.id}>:** ${(reportMsg.content.substring(0, 1800).length == 0 ? "[no content]" : `\`\`\`${escape(reportMsg.content.substring(0, 300))}\`\`\``)}${(reportMsg.attachments.length !== 0 ? ` [${reportMsg.attachments.length} attachments]` : "")}\n\n(https://discord.com/channels/${reportMsg.guildID}/${reportMsg.channel.id}/${reportMsg.id})`
    
    // Only allows regular messages to be reported for compatibility reasons

    if (reportMsg.type !== 0) {
      await i.createFollowup( { content: "This type of message cannot be reported." } );
      return;
    }

    // If the user already has an active thread then add it to that and stop there
    
    if (await threads.findOpenThreadByUserId(i.member.id)){
      const t = await threads.findOpenThreadByUserId(i.member.id)
      await t.postSystemMessage(msgModel);
      await i.createFollowup( { content: responseMsg } )
      return;
    }

    // Actually do the thing

    await threads.createNewThreadForUser(i.member, {
      source: "messagereport",
      categoryId: config.categoryAutomation.newThread
    })
      .then(nt => {
        nt.postSystemMessage(msgModel);
        i.createFollowup( { content: responseMsg } );
      })

    // Okay we're done bye

  })
}
