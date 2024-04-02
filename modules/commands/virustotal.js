module.exports.config = {
  name: "virustotal",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "blue",//credits api owner
  description: "Check if the URL is malicious or not.",
  usePrefix: "true",
  commandCategory: "check",
  usages: "[URL]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const { execSync } = require('child_process');
  let { threadID, messageID } = event;
  const response = args.join(" ");
  if (!response) return api.sendMessage(`Wrong Format\nUse: ${global.config.PREFIX}${this.config.name} ${this.config.usages}`, threadID, messageID);

  try {
    const res = await axios.get(`https://totalvirusapi-2.ryywuuu.repl.co/check?url=${response}`);
    const { success, message, reports } = res.data;

    if (success) {
      api.sendMessage("⏳ Scanning for results:", threadID, messageID);
      api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);

      setTimeout(() => {
        api.sendMessage(`🤖 ${message}\nReports: ${reports}`, threadID, messageID);

        if (message.includes("potentially malicious")) {
          api.setMessageReaction("⚠", event.messageID, (err) => {
     }, true);
        } else if (message.includes("safe")) {
          api.setMessageReaction("✅", event.messageID, (err) => {
     }, true);
        }
      }, 6000);
    } else {
      api.sendMessage(`🤖 API Error: ${message}`, threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while making the API request.", threadID, messageID);
  }
};

                             