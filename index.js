module.exports = function({ bot, knex, config, commands, threads }) {
  function log(log) {
    console.info(`[messageReport:log] ${log}`);
  }

  function err(err) {
    console.error(`[messageReport:error] ${err}`);
  }

  async function isBlocked(userId) {
    const row = await knex("blocked_users").where("user_id", userId).first();
    return !!row;
  }

  bot.guilds.get(config.mainServerId[0]).createCommand({
    name: "Report Message",
    type: 3
  })
    .then(cmd => {
      log("Ready! Usage: Right Click > App > Report Message");
    })

    .catch(error => {
      err("Fatal: Failed to publish the Report Message interaction in the main server. Unfortunately, the only way to correct this problem is to kick the bot and re-invite it with the `application.commands` scope.");
      err(error);
      return;
    })

  bot.on("interactionCreate", async i => {
    if (!i.data.type == 3) {return;}
    if (!i.name == "Report Message") {return;}

    await i.acknowledge(64)

    if (await isBlocked(i.member.id)) {
      const row = await knex("blocked_users").where("user_id", i.member.id).first();
      await i.createFollowup( { content: `**You are currently blocked from creating threads.** This block ${(row.expires_at == null ? "has not been set to expire automatically." : `will expire <t:${Math.round(Date.parse(row.expires_at + " UTC") / 1000)}:R>.`)}` } );
      return;
    }

    const reportMsg = i.data.resolved.messages.random()

    const msgModel = `:page_with_curl: **Message Report** (https://discord.com/channels/${reportMsg.guildID}/${reportMsg.channel.id}/${reportMsg.id})\n\n**${reportMsg.author.username}#${reportMsg.author.discriminator} => <#${reportMsg.channel.id}>:** ${(reportMsg.cleanContent.substring(0, 300).length == 0 ? "[no content]" : reportMsg.cleanContent.substring(0, 300))}`

    console.log(await threads.findOpenThreadByUserId(i.member.id));

    if (await threads.findOpenThreadByUserId(i.member.id)) t => {
      console.log(t);
      i.createFollowup( { content: "You already have an active thread." } )
      return;
    }

    if (reportMsg.type !== 0) {
      await i.createFollowup( { content: "This type of message cannot be reported." } );
      return;
    }

    await threads.createNewThreadForUser(i.member, {
      source: "messagereport",
      categoryId: config.categoryAutomation.newThread
    })
      .then(nt => {
        nt.postSystemMessage(msgModel);
        i.createFollowup( {content: (!config.mr["reportResponseMessage"] ? "Thank you! A modmail thread has been created with this message attached." : config.mr["reportResponseMessage"])} );
      })

  })
}
