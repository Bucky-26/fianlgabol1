module.exports.config = {
  name: "bible",
  usePrefix: true,
  version: "1.0.2",
  hasPermision: 0,
  credit: "giee",
  description: "Random Bible Verse with Picture.",
  commandCategory: "random-quote",
  cooldowns: 1,
};
module.exports.run = async function({ api, event, args, utils, Users, Threads }) {
  const axios = require("axios")
  const request = require("request")
  const fs = require("fs-extra")
  var link = ["https://i.imgur.com/IEyYKzn.jpeg", "https://i.imgur.com/En3e5AJ.jpg", "https://i.imgur.com/iGSJ1SK.jpg", "https://i.imgur.com/7UiYEWh.jpg", "https://i.imgur.com/QtbGfTV.jpg",
    "https://i.ibb.co/6mr4bDj/images-12.jpg",
    "https://i.ibb.co/3rgBH19/images-11.jpg",
    "https://i.ibb.co/tps3TBD/images-8.jpg"];
  try {
    const res = await axios.get(`https://labs.bible.org/api/?passage=random&type=json`);
    var callback = () => api.sendMessage({ body: `${res.data[0].bookname} ${res.data[0].chapter}:${res.data[0].verse}\n${res.data[0].text}`, attachment: fs.createReadStream(__dirname + "/cache/giee.jpg") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/giee.jpg"));
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/giee.jpg")).on("close", () => callback());
  } catch (error) {
    api.sendMessage("An error occurred while making the API request.", threadID, messageID);
  }
};