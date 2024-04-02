const axios = require("axios");

module.exports.config = {
  name: "animev2",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Anjelo Cayao Arabis",
  description: "Get anime information.",
 usePrefix: "true",

  commandCategory: "anime",
  usages: "Usage: .anime [anime name]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const animeName = args.join(" ");

  if (!animeName) {
    return api.sendMessage("Please provide the name of the anime you want to search for.", event.threadID);
  }

  api.sendMessage("🔍 Searching for anime information...", event.threadID);

  try {
    const response = await axios.get(`https://official-anjelo-api.anjelopogialways.repl.co/anime?query=${encodeURIComponent(animeName)}`);

    if (response.data.error) {
      return api.sendMessage(response.data.error, event.threadID);
    }

    const animeInfo = response.data;
    const message = `𝗛𝗲𝗿𝗲'𝘀 𝘁𝗵𝗲 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗼𝗳 𝘁𝗵𝗲 𝗮𝗻𝗶𝗺𝗲\n𝗮𝗻𝗶𝗺𝗲 𝗻𝗮𝗺𝗲: ${animeInfo.animeName}
𝗿𝗮𝘁𝗶𝗻𝗴: ${animeInfo.rating}
𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${animeInfo.description}
𝗲𝗽𝗶𝘀𝗼𝗱𝗲 𝗰𝗼𝘂𝗻𝘁: ${animeInfo.episodeCount}`;
    api.sendMessage(message, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while fetching anime information.", event.threadID);
  }
};