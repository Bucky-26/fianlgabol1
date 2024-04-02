module.exports.config = {
  name: "prefix",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Blue",
  description: "prefix",
  usePrefix: "false",
  commandCategory: "system",
  usages: "[Name module]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.run = async function({ api, event }) {

  api.sendMessage(`
    🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
    Hey there! My new prefix is now: [*] 
    Type *help to view all available commands
    🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟`,

    event.threadID, event.messageID);


}
