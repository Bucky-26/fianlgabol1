module.exports.config = {
  name: "uid",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Blue",
  description: "get user UID",
  commandCategory: "system",
  usages: "[uid]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: '',
};

async function getUserInfo(api, sid) {
  
  try {
    const userInfo = await api.getUserInfo(sid);
    return userInfo[sid].name;
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.run = async function ({ api, event }) {
  const tid = event.threadID;
  const mid = event.messageID;
  const sid = event.senderID;
  try {
    let mainId;
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      mainId = Object.keys(event.mentions)[0];
    } else {
      mainId = sid;
    }
    const userInfo = await getUserInfo(api, mainId);
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      //get mo id nung nimention mo
      const mentionuid = Object.keys(event.mentions)[0];
      //get mo name nung nimention mo sa userInfo
      const mentionname = userInfo;
      const message = { 
        body: `Username : \n\n@${mentionname} \n\nFacebook UID : \n\n${mentionuid}`,
        mentions: [{
          // pwede mo tanggalin yung "@" tas + if ayaw mo like @miko to miko
          tag: "@" + mentionname,
          id: mentionuid
        }]
      };
      return api.sendMessage(message, tid, mid);
    } else {
      const message = { 
        body: `Username : \n\n@${userInfo} \n\nFacebook UID : \n\n${sid}`,
        // pwede mo tanggalin yung "@" tas + if ayaw mo like @miko to miko
        mentions: [{
          tag: "@" + userInfo,
          id: sid
        }]
      };
      return api.sendMessage(message, tid, mid);
    }
  } catch (error) {
    console.log(error);
    return api.sendMessage("an error occured.", tid, mid);
  }
};