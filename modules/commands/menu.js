const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "menu",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Beginner's Guide",
  usePrefix: true,
  commandCategory: "Command list",
  usages: "[Name module]",
  cooldowns: 60,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
    "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
    "user": "User",
    "adminGroup": "Admin group",
    "adminBot": "Admin bot"
  }
};

module.exports.handleEvent = function({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};

module.exports.run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const groupMap = new Map();

    commandList.forEach(cmd => {
      const group = cmd.config.commandCategory.toLowerCase();
      if (!groupMap.has(group)) {
        groupMap.set(group, []);
      }
      groupMap.get(group).push(cmd.config.name);
    });

    let msg = `❍──────────❍\nThis is how to use the command:\nuse the prefix then the command name\nexample: ${prefix}help\n❍──── Giee-Gpt ──────❍\n`;

    groupMap.forEach((cmds, group) => {
      msg += `[ ${group.charAt(0).toUpperCase() + group.slice(1)} ]\n${cmds.join(', ')}\n\n`;
    });

    return api.sendMessage(
      `${msg}${getText("helpList", commandList.length, prefix)}`,
      threadID,
      async (error, info) => {
        if (autoUnsend) {
          await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
          return api.unsendMessage(info.messageID);
        } else return;
      }
    );

  }

  return api.sendMessage(
    getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits),
    threadID,
    messageID
  );
};
