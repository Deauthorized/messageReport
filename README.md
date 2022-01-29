# messageReport
inline message reporting plugin for dragory's modmailbot.

# First things first
This plugin has support for application commands, which the bundled version of eris that comes with modmailbot **does not support.**

Please run `npm install eris@0.16.1` in the root folder. Then replace line 145 in src/main.js with `if (msg.channel instanceof Eris.GuildChannel) return;`. If you don't do this, the bot will not be able to receive any DMs.

# Config
Add these lines.

```
plugins[] = npm:Deauthorized/messageReport
```

Optional.

```
mr.reportResponseMessage = Thank you! Our moderators will take a look and take any action if needed.
mr.categoryId = <will default to categoryAutomation.newThread>
```

# Caveats 

1) Only supports one main server (for now).
2) Users will need to have the "Use Application Commands" permission enabled.
