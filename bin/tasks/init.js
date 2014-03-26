var fs = require('fs');

function OrangeeJSInitTask() {
};

OrangeeJSInitTask.prototype.run = function() {
  fs.exists('app', function(exists) {
    if (!exists) {
      mkdir('-p', 'app');
      console.log("created app folder")
    }
  });

  fs.exists('app/icons', function(exists) {
    if (!exists) {
      mkdir('-p', 'app/icons');
      cp('src/icons/*.png', 'app/icons')
    }
  });
};

module.exports = OrangeeJSInitTask;
