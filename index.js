module.exports = function({ bot, knex, config, commands }) {
    function log(log) {
      console.info(`[messageReport:log] ${log}`)
    }

    function err(err) {
      console.error(`[messageReport:error] ${err}`)
    }

    log("Initializing...")

    const appId = config.mr["appId"];

    console.log(bot.application)

    if (!appId) {
      err("An Application ID is required to publish my interaction commands.")
      return;
    }

    log(`Configured Application ID is: ${appId.substring(0,10)}********`)
  }
