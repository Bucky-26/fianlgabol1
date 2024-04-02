"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function logout(callback) {
    var resolveFunc = function() { };
    var rejectFunc = function() { };
    var returnPromise = new Promise(function(resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function(err, friendList) {
        if (err) return rejectFunc(err);

        resolveFunc(friendList);
      };
    }

    var form = {
      pmid: "0"
    };

    defaultFuncs
      .post("https://www.facebook.com/bluebar/modern_settings_menu/?help_type=364455653583099&show_contextual_help=1", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        var elem = resData.jsmods.instances[0][2][0].filter(function(v) {
          return v.value === "logout";
        })[0];

        var html = resData.jsmods.markup.filter(function(v) {
          return v[0] === elem.markup.__m;
        })[0][1].__html;

        var form = {
          fb_dtsg: utils.getFrom(html, '"fb_dtsg" value="', '"'),
          ref: utils.getFrom(html, '"ref" value="', '"'),
          h: utils.getFrom(html, '"h" value="', '"')
        };

        return defaultFuncs
          .post("https://www.facebook.com/logout.php", ctx.jar, form)
          .then(utils.saveCookies(ctx.jar));
      })
      .then(function(res) {
        if (!res.headers) throw { error: "An error occurred when logging out." };

        return defaultFuncs
          .get(res.headers.location, ctx.jar)
          .then(utils.saveCookies(ctx.jar));
      })
      .then(function() {
        ctx.loggedIn = false;
        log.info("logout", "Logged out successfully.");
        callback();
      })
      .catch(function(err) {
        log.error("logout", err);
        return callback(err);
      });

    // Generate "reygie" ASCII art and log it
    const reygieAsciiArt = generateAsciiArt("reygie");
    console.log(reygieAsciiArt);

    return returnPromise;
  };
};


///
function generateAsciiArt(name) {
  const asciiMappings = {
    a: {
      upper: ' ▄▀█',
      lower: '░█▀█',
    },
    b: {
      upper: '░█▄▄',
      lower: '░█▄█',
    },
    c: {
      upper: '░█▀▀',
      lower: '░█▄▄',
    },
    d: {
      upper: '░█▀▄',
      lower: '░█▄▀',
    },
    e: {
      upper: '░█▀▀',
      lower: '░██▄',
    },
    f: {
      upper: '░█▀▀',
      lower: '░█▀ ',
    },
    g: {
      upper: '░█▀▀',
      lower: '░█▄█',
    },
    h: {
      upper: '░█░█',
      lower: '░█▀█',
    },
    i: {
      upper: '░█',
      lower: '░█',
    },
    j: {
      upper: '░░░█',
      lower: '░█▄█',
    },
    k: {
      upper: '░█▄▀',
      lower: '░█░█',
    },
    l: {
      upper: '░█░░',
      lower: '░█▄▄',
    },
    m: {
      upper: '░█▀▄▀█',
      lower: '░█░▀░█',
    },
    n: {
      upper: '░█▄░█',
      lower: '░█░▀█',
    },
    o: {
      upper: '░█▀█',
      lower: '░█▄█',
    },
    p: {
      upper: '░█▀█',
      lower: '░█▀▀',
    },
    q: {
      upper: '░█▀█',
      lower: ' ▀▀█',
    },
    r: {
      upper: '░█▀█',
      lower: '░█▀▄',
    },
    s: {
      upper: '░█▀',
      lower: '░▄█'
    },
    t: {
      upper: ' ▀█▀',
      lower: '░░█░',
    },
    u: {
      upper: '░█░█',
      lower: '░█▄█',
    },
    v: {
      upper: '░█░█',
      lower: '░▀▄▀',
    },
    w: {
      upper: '░█░█░█',
      lower: '░▀▄▀▄▀',
    },
    x: {
      upper: ' ▀▄▀',
      lower: '░█░█'
    },
    y: {
      upper: '░█▄█',
      lower: '░░█░',
    },
    z: {
      upper: '░▀█',
      lower: '░█▄',
    },
    '-': {
      upper: ' ▄▄',
      lower: '░░░'
    },
    '+': {
      upper: ' ▄█▄',
      lower: '░░▀░',
    },
    '.': {
      upper: '░',
      lower: '▄',
    },
  };

  // Initialize lines for ASCII art
  const lines = ['   ', '   '];

  // Loop through the characters in the name
  for (let i = 0; i < name.length; i++) {
    const char = name[i].toLowerCase();
    const mapping = asciiMappings[char] || '';
    lines[0] += `${mapping.upper || '  '}`;
    lines[1] += `${mapping.lower || '  '}`;
  }

  // Return the ASCII art
  return lines.join('\n');
}

// Call the function with the name "reygie" and log the result
const reygieAsciiArt = generateAsciiArt("reygie");
console.log(reygieAsciiArt);