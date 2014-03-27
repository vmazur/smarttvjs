var fs = require('fs');
var path = require('path');

function OrangeeJSInitTask() {
};

OrangeeJSInitTask.prototype.run = function() {
  fs.exists('app', function(exists) {
    if (!exists) {
      mkdir('-p', 'app');
      console.log("created app folder")
    }
  });

  fs.exists('package.json', function(exist)) {
    if (!exist) {
      exec("npm init");
    }
  }

  fs.exists('app/icons', function(exists) {
    if (!exists) {
      mkdir('-p', 'app/icons');
      var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
      cp(src + '/icons/*.png', 'app/icons')
    }
  });
};

module.exports = OrangeeJSInitTask;
