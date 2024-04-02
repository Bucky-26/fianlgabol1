module.exports.config = {
  name: 'remini',
  version: '0.0.1',
  hasPermssion: 0,
  credits: 'remod giee',
  description: 'Increase image quality to 4k',
  usePrefix: "false",
  commandCategory: 'image increase',
  usages: 'replyimage <cmd name>',
  cooldowns: 3,
  apiKey: 'iUfHnyhyP8VBrbPXWM34qXZo-VOszrY3nusl2M6Ie-onI9Aa',
};

let eta = 3;
exports.run = async (o) => {
  let send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
  if (o.event.type != 'message_reply') return send(`Please reply with 1 photo!\n`);
  send(`Increasing the resolution for ${o.event.messageReply.attachments.length} image(s) (${o.event.messageReply.attachments.length * eta}s)`);

  let stream = [];
  let exec_time = 0;
  let totalResolution = 0; // Initialize total resolution

  for (let i of o.event.messageReply.attachments) {
    try {
      let res = await require('axios').get(encodeURI(`https://nams.live/upscale.png?{"image":"${i.url}","model":"4x-UltraSharp","apiKey":"${module.exports.config.apiKey}"}`), {
        responseType: 'stream',
      });

      exec_time += +res.headers.exec_time;
      eta = res.headers.exec_time / 1000 << 0;
      res.data.path = 'tmp.png';
      stream.push(res.data);

      // Calculate the resolution of the current image and add it to the total
      totalResolution += i.width * i.height;
    } catch (e) { }
  }

  send({
    body: `Successful (${exec_time / 1000 << 0}s)\nTotal Resolution: ${totalResolution}px²`, // Display total resolution
    attachment: stream,
  });
};
