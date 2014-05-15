var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var OrangeeJSUtil = require('./util');
require('shelljs/global');

function OrangeeJSInitTask() {
};

OrangeeJSInitTask.prototype.run = function() {
  mkdir('-p', 'app');
  mkdir('-p', 'assets');

  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  var name = path.basename(process.cwd());
  
  if (!fs.existsSync('package.json')) {
      OrangeeJSUtil.transform_template(src + "/package.json.template", "package.json", {name: name});
  };

  cp("-f", src + "/vendor/jquery.min.js", "app/jquery.min.js");
  OrangeeJSUtil.concat_css(src, OrangeeJSUtil.ui_css_sources, "app/orangeejs-ui.min.css");
  OrangeeJSUtil.concat_js(src, OrangeeJSUtil.core_js_sources.concat("/platforms/orangee.html5.js"), "app/orangee.min.js");
  OrangeeJSUtil.concat_js(src, OrangeeJSUtil.ui_js_sources, "app/orangee-ui.min.js");

  OrangeeJSUtil.copyUnlessExist(src + '/icon.example.png', 'assets/icon.png');
  OrangeeJSUtil.copyUnlessExist(src + '/splash-portrait.example.png',  'assets/splash-portrait.png');
  OrangeeJSUtil.copyUnlessExist(src + '/splash-landscape.example.png', 'assets/splash-landscape.png');
  OrangeeJSUtil.copyUnlessExist(src + "/index.example.html", 'app/index.html');
};

module.exports = OrangeeJSInitTask;
