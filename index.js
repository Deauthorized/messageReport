module.exports = function({ bot, knex, config, commands }) {
    function log(log) {
      console.info(`[messageReport:log] ${log}`)
    }

    function err(err) {
      console.error(`[messageReport:error] ${err}`)
    }

    log("Initializing...")

    const appId = config.mr["appId"];

    if (!appId) {
      err("An Application ID is required to publish my interaction commands.")
      return;
    }

    log(`Configured Application ID is: ${config["mr.appId"].substring(0,10)}********`)
  }
