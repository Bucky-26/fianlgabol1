const { writeFileSync, existsSync } = require('fs-extra');
const { resolve } = require("path");

module.exports.config = {
  name: "maintenance",
  version: "1.0",
  hasPermission: 2,
  credits: "fix by giee",
  description: "Maintenance",
  usePrefix: false,
  commandCategory: "Admin",
  usages: "for maintenance",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "^10.0.0"
  }
};

module.exports.onLoad = function() {
  const path = resolve(__dirname, 'config.json');
  if (!existsSync(path)) {
    const obj = {
      adminbox: {}
    };
    writeFileSync(path, JSON.stringify(obj, null, 4));
  } else {
    const data = require(path);
    if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
    writeFileSync(path, JSON.stringify(data, null, 4));
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  const pathData = resolve(__dirname, 'cache/data.json');
  const database = require(pathData);
  const { adminbox } = database;

  if (adminbox[threadID] == true) {
    adminbox[threadID] = false;
    api.sendMessage("✅ MAINTENANCE MODE COMPLETE", threadID, messageID);
  } else {
    adminbox[threadID] = true;
    api.sendMessage("🚧 MAINTENANCE MODE ENABLE", threadID, messageID);
  }
};