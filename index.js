module.exports = function({ bot, knex, config, commands }) {
    function log(log) {
      console.info(`[messageReport:log] ${log}`)
    }

    function err(err) {
      console.error(`[messageReport:error] ${err}`)
    }

    log("Initializing...")

    const appId = bot.application.id;

    bot.get_guild(config["mainServerId"]).createCommand({
      name: "Report Message",
      description: "Report this message.",
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
  }
