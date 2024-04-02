const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "out",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "giee",
  description: "Leave the group",
  usePrefix: true,
  commandCategory: "Admin",
  usages: "out",
  cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
  if (!args[0]) {
    const gifPath = path.join(__dirname, "cache/bye.gif");
    const gifData = fs.readFileSync(gifPath);
    await api.sendMessage({
      body: "Bye! I'm leaving the group.",
      attachment: fs.createReadStream(gifPath),
    }, event.threadID);
    api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  }
  if (!isNaN(args[0])) {
    const gifPath = path.join(__dirname, "cache/bye.gif");
    const gifData = fs.readFileSync(gifPath);
    await api.sendMessage({
      body: "Bye! I'm leaving the group.",
      attachment: fs.createReadStream(gifPath),
    }, event.threadID);
    api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
  }
};
