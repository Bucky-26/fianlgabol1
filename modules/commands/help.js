const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Mirai Team and blue",
  description: "Beginner's Guide",
  usePrefix: "false",
  commandCategory: "system",
  usages: "[Name module]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
    "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
    "user": "Anyone",
    "adminGroup": "Admin of group",
    "adminBot": "Admin of bot"
  }
};

module.exports.run = async function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const commandName = (args[0] || "").toLowerCase();
  const command = commands.get(commandName);
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 10;
    let i = 0;
    let msg = `\n❍──────────❍\nThis is how to use the command:\nuse the prefix then the command name\nexample: ${prefix}help\n❍──── Giee-Gpt ──────❍\n`;

    for (var [name, value] of commands) {
      name += `  ${value.config.usages}`;
      arrayInfo.push(name);
    }

    arrayInfo.sort((a, b) => a.data - b.data);

    const startSlice = numberOfOnePage * page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    for (let item of returnArray) msg += `${prefix}${item}\n`;

    const text = `Page ${page} of ${Math.ceil(arrayInfo.length / numberOfOnePage)}\nTotal Commands: ${arrayInfo.length}\n\n[ use ${prefix}help ]`;

    const messageInfo = await api.sendMessage(
      {
        body: `Available commands:\n\n${msg}\n${text}`,
      },
      threadID
    );

    if (autoUnsend) {
      // Delay for 10 seconds before unsending the message
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(messageInfo.messageID);
    }
  } else {
    if (autoUnsend) {
      const result = await api.sendMessage(
        getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits),
        threadID,
        messageID
      );

      // Delay for 10 seconds before unsending the message
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(result.messageID);
    } else {
      return api.sendMessage(
        getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits),
        threadID,
        messageID
      );
    }
  }
};
