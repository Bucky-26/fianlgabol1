const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: "giee",
  usePrefix: false,
  version: "1.0.5",
  hasPermssion: 0,
  credits: "giee",
  description: "Can assist you in completing your homework, speech, and even essays.",
  commandCategory: "chatbots",
  usages: "ask anything",
  cooldowns: 7,
  dependencies: {}
};

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID].name;
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.run = async function({ api, event, args, Users, Threads }) {
  api.setMessageReaction("⏳", event.messageID, (err) => { }, true);

  const apiKey = "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";
  const url = "https://api.openai.com/v1/chat/completions";
  const senderID = event.senderID;

  // Get the user's name
  const userName = await getUserName(api, senderID);
  const currentTime = moment().tz("Asia/Manila").format("MMM D, YYYY - hh:mm A");

  const promptMessage =
    "System: Act as a Messenger Chatbot. As a Chatbot you will be responsible";
  const blank = args.join(" ");
  const data = `User: ${args.join(" ")}\nYou: `;

  const greeting = `Hi, I'm Giee-bot🤖\n`;

  if (blank.length < 2) {
    if (args.includes("time") || args.includes("oras") || args.includes("panahon")) {
      api.sendMessage(`${greeting}\nThe current time is ${currentTime}.`, event.threadID, event.messageID);
      api.setMessageReaction("✅", event.messageID, (err) => { }, true);
    } else if (args.includes("image") || args.includes("larawan")) {
      const imageUrl = "https://example.com/image.jpg";
      api.sendMessage(
        {
          body: "",
          attachment: axios.get(imageUrl, { responseType: "arraybuffer" }),
        },
        event.threadID,
        (err, messageInfo) => {
          if (err) console.error(err);
          api.setMessageReaction("✅", messageInfo.messageID, (err) => { }, true);
        }
      );
    } else {
      api.sendMessage(`${greeting}\nHow may I assist you today?`, event.threadID, event.messageID);
      api.setMessageReaction("✅", event.messageID, (err) => { }, true);
    }
  } else {
    api.sendMessage("Searching for: " + args.join(" "), event.threadID, event.messageID);
    try {
      const response = await axios.post(
        url,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: promptMessage },
            { role: "user", content: data },
          ],
          temperature: 0.7,
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
      api.sendMessage(`${greeting}\n${message}`, event.threadID, event.messageID);
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
