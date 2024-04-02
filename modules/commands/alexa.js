const axios = require("axios");
const fs = require("fs");
const gtts = require('gtts');

module.exports.config = {
  name: "alexa",
  usePrefix: false,
  version: "2.8.8",
  hasPermission: 0,
  credits: "Hazeyy And Arjhil / contrinbute by giee",
  description: "( 𝙂𝙋𝙏-3.5 𝙏𝙪𝙧𝙗𝙤 )",
  commandCategory: "education",
  usages: "( GPT-3.5 Turbo Without Daily Usage Limit )",
  cooldowns: 3,
};

let lastQuery = "";

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    api.sendMessage("😺 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗊𝗎𝖾𝗋𝗒 𝗍𝗈 𝗌𝖾𝖺𝗋𝖼𝗁 𝗈𝗇 𝗍𝗁𝖾 𝗐𝖾𝖻", threadID, messageID);
    return;
  }

  const query = args.join(" ");

  if (query === lastQuery) {
    api.sendMessage("🕰️ | 𝘜𝘱𝘥𝘢𝘵𝘦𝘥 𝘈𝘯𝘴𝘸𝘦𝘳...", threadID, messageID);
    return;
  } else {
    lastQuery = query;
  }

  api.sendMessage("🕟 | 𝘚𝘦𝘢𝘳𝘤𝘩𝘪𝘯𝘨...", threadID, messageID);

  try {
    const response = await axios.get(`https://gpt-35-turbo-hazeyy-api.kyrinwu.repl.co/gpt?msg=${encodeURIComponent(query)}`);

    if (response.status === 200 && response.data && response.data.message) {
      const answer = response.data.message;
      const formattedAnswer = formatFont(answer);

      // Generate voice message using gTTS
      const gttsPath = 'voice.mp3';
      const gttsText = `📝 𝗔𝗟𝗘𝗫𝗔 (𝗜𝗡𝗩𝗢𝗜𝗖𝗘) ${formattedAnswer}`;
      const gttsInstance = new gtts(gttsText, 'en');
      gttsInstance.save(gttsPath, function(error, result) {
        if (error) {
          console.error("Error saving gTTS:", error);
        } else {
          // Send both text and voice together in a single message
          api.sendMessage({
            body: `📝 𝗔𝗟𝗘𝗫𝗔 (𝗔𝗜)\n\n📝: ${formattedAnswer}`,
            attachment: fs.createReadStream(gttsPath)
          }, threadID);
        }
      });
    } else {
      api.sendMessage("😿 𝖲𝗈𝗋𝗋𝗒, 𝗇𝗈 𝗋𝖾𝗅𝖾𝗏𝖺𝗇𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝖿𝗈𝗎𝗇𝖽", threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("‼️ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝖾𝖉, 𝖶𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝗈𝗇 𝖳𝗎𝗋𝖻𝗈", threadID, messageID);
    return;
  }

  // Search Pinterest and send pictures
  const imgData = await searchPinterest(query);

  if (imgData && imgData.length > 0) {
    api.sendMessage({
      body: `Pinterest Search results for keyword: ${query}`,
      attachment: imgData
    }, threadID, messageID);
  } else {
    api.sendMessage("‼️ An error occurred while searching on Pinterest or no results found.", threadID, messageID);
  }
};

async function searchPinterest(query) {
  const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(query)}`);
  const data = res.data.data;
  var num = 0;
  var imgData = [];
  for (var i = 0; i < 6; i++) {
    let path = __dirname + `/cache/${num += 1}.jpg`;
    let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
    imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
  }
  for (let ii = 1; ii < 6; ii++) {
    fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
  }
  return imgData;
}

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}
