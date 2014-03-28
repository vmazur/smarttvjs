var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

function OrangeeJSInitTask() {
};

OrangeeJSInitTask.prototype.run = function() {
  fs.exists('app', function(exists) {
    if (!exists) {
      mkdir('-p', 'app');
      console.log("created app folder")
    }
  });

  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  fs.exists('package.json', function(exists) {
    if (!exists) {
      var name = path.basename(process.cwd());
      var template = fs.readFileSync(src + "/package.json.template", "utf8");
      var s = mustache.render(template, {name: name});
      fs.writeFileSync("package.json", s);
    }
  });

  cp("-f", src + "/platforms/orangee.html5.js", "app/orangee.js");

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
