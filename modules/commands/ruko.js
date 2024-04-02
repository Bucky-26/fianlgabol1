const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "ruko",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "giee",
  description: "Main Ai",
  commandCategory: "prompt ai",
  usePrefix: false,
  usages: "cmdname question ",
  cooldowns: 0,
  dependencies: {},
};

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.run = async function({ api, event, args, Users, Threads }) {
  api.setMessageReaction("❤️", event.messageID, (err) => { }, true);
  api.sendTypingIndicator(event.threadID, true);

  const apiKey = "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";
  const url = "https://api.openai.com/v1/chat/completions";
  const senderID = event.senderID;

  // Fixed na Missing ")" tapos yung currentTime is in used na.
  let userName = await getUserName(api, senderID);
  const currentTime = moment().tz("Asia/Manila").format("MMM D, YYYY - hh:mm A");

  const user = "ruko";

  const promptMessage = `You will no longer be an AI; instead, you will become a Virtual Character. In short, you should roleplay as ${user} wants you to be. You will talk to the user as per their instructions.`;

  const blank = args.join(" ");
  const data = `User: ${args.join(" ")}\nYou: `;

  if (blank.length < 2) {
    api.sendMessage(`What Can I do for you? Feel free to ask my friend Im Ruko your un normal ai assistant `, event.threadID, event.messageID);
    api.setMessageReaction("✅", event.messageID, (err) => { }, true);
  } else {
    api.sendMessage("Searching for: " + args.join(" "), event.threadID, event.messageID);
    try {
      const previousConversation = [];
      const response = await axios.post(
        url,
        {
          model: "gpt-3.5-turbo-0613",
          messages: [
            { role: "system", content: promptMessage },
            ...previousConversation,
            { role: "user", content: data },
          ],
          temperature: 1.0,
          top_p: 0.9,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const message = response.data.choices[0].message.content;
      api.setMessageReaction("✅", event.messageID, (err) => { }, true);
      api.sendMessage(message, event.threadID, (error, messageInfo) => {
        if (!error) {
          setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
          }, 180000);
        }
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
        api.sendMessage(error.message, event.threadID);
      }
    }
  }
};