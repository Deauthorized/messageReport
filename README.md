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

```
mr.reportResponseMessage = ""**Message reported.** If you'd like to add any additional information, you may do so in my direct messages. Thank you!"
```

# Caveat's 

1) Only supports one main server (for now)
