var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var SmartTVJSUtil = require('./util');
require('shelljs/global');

function SmartTVJSInitTask() {
};

SmartTVJSInitTask.prototype.run = function(debug) {
  mkdir('-p', 'app/lib');
  mkdir('-p', 'assets');

  if (debug) {
    console.log("DEBUG: js will not be minified");
  }

  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  var name = path.basename(process.cwd());

  if (!fs.existsSync('package.json')) {
      SmartTVJSUtil.transform_template(src + "/example/package.json.template", "package.json", {name: name});
  };
  SmartTVJSUtil.create_version_js();

  SmartTVJSUtil.lib_js_sources.forEach(function(value) {
    cp(src + "/assets/javascripts/" + value, "app/lib/" + value);
  });
  SmartTVJSUtil.lib_css_sources.forEach(function(value) {
    cp(src + "/assets/stylesheets/" + value, "app/lib/" + value);
  });
  cp("-r", src + "/assets/fonts", "app/lib/");
  SmartTVJSUtil.concat_css(src, SmartTVJSUtil.core_css_sources, "app/lib/smarttv.css");
  SmartTVJSUtil.concat_js(src, SmartTVJSUtil.core_js_sources.concat("/platforms/smarttv.html5.js"), "app/lib/smarttv.js", debug);

  cp(src + '/example/icon.example.png', 'assets/icon.png');
  cp(src + '/example/splash-portrait.example.png',  'assets/splash-portrait.png');
  cp(src + '/example/splash-landscape.example.png', 'assets/splash-landscape.png');
  cp(src + "/example/index.example.html", 'app/index.html');
  cp(src + "/example/app.example.js", 'app/app.js');
  cp(src + "/example/app.example.css", 'app/app.css');
};

module.exports = SmartTVJSInitTask;
