const { Configuration, OpenAIApi } = require("openai");

const config = {
  name: "detect",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "@Hazeyy",
  description: "( 𝘿𝙚𝙩𝙚𝙘𝙩 𝘼𝙄-𝙂𝙚𝙣 𝙤𝙧 𝙃𝙪𝙢𝙖𝙣-𝙈𝙖𝙙𝙚 )",
  usePrefix: "false",
  commandCategory: "detector",
  usages: "( Detects text if AI-Generated or Human-Made )",
  cooldowns: 5,
  dependencies: {
    "openai": "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"
  }
};

const run = async function({ api, event, args }) {
  const configuration = new Configuration({
    apiKey: config.dependencies.openai
  });
  const openai = new OpenAIApi(configuration);
  const message = args.join(" ");

  if (message.length < 2) {
    api.sendMessage("😿 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖢𝗈𝗆𝗆𝖺𝗇𝖽\n💡 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 +𝖽𝖾𝗍𝖾𝖼𝗍 >𝗍𝖾𝗑𝗍<", event.threadID);
  } else {
    try {
      const completions = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Is the following message AI-generated or human-made?\n"${message}"\n\nAI: It is`,
        temperature: 0.2,
        max_tokens: 1,
        n: 5,
        stop: "\n"
      });

      let aiCount = 0;
      let humanCount = 0;

      completions.data.choices.forEach((choice) => {
        const result = choice.text.toLowerCase();
        if (result.includes("ai")) {
          aiCount++;
        } else {
          humanCount++;
        }
      });

      const aiPercentage = (aiCount / (aiCount + humanCount)) * 100;
      const humanPercentage = 100 - aiPercentage;

      let output = `🕵️‍♂️ 𝖠𝖨 𝖣𝖾𝗍𝖾𝖼𝗍𝗈𝗋 2.0\n\n`;
      output += `Message: ${message}\n\n`;

      if (aiPercentage >= 50) {
        output += "🔴 𝖠𝖨-𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽\n\n";
        output += `𝗔𝗜: ${aiPercentage.toFixed(2)}% ▴\n`;
        output += `𝗛𝘂𝗺𝗮𝗻: ${humanPercentage.toFixed(2)}% ▾`;
      } else {
        output += "🟢 𝖧𝗎𝗆𝖺𝗇-𝖬𝖺𝖽𝖾\n\n";
        output += `𝗔𝗜: ${aiPercentage.toFixed(2)}% ▾\n`;
        output += `𝗛𝘂𝗺𝗮𝗻: ${humanPercentage.toFixed(2)}% ▴`;
      }

      api.sendMessage(output, event.threadID);
    } catch (error) {
      console.log(error);
      api.sendMessage("😿 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖠𝗇𝖺𝗅𝗒𝗓𝖾𝖽 𝗍𝖾𝗑𝗍, 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋...", event.threadID);
    }
  }
};

module.exports = { config, run };