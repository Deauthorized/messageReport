# messageReport
inline message reporting plugin for dragory's modmailbot.

# First things first
Please run `npm install eris@0.16.1` in the root folder. Then replace line 145 in main.js with `if (msg.channel instanceof Eris.GuildChannel) return;`. If you don't do this, the bot will not be able to receive any DMs.

# Config
Add these lines.
`mr.reportResponseMessage = "Thank you. A thread has been created with the attached message."
plugins[] = npm:Deauthorized/messageReport
`
