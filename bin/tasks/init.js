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

  fs.exists('package.json', function(exists) {
    if (!exists) {
      exec("npm init");
    }
  });

  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  fs.exists('app/icons', function(exists) {
    if (!exists) {
      mkdir('-p', 'app/icons');
      cp(src + '/icons/*.png', 'app/icons')
    }
  });

  fs.exists('app/index.html', function(exists) {
    if (!exists) {
      cp(src + "/index.example.html", 'app/index.html')
    }
  });
};

module.exports = OrangeeJSInitTask;
