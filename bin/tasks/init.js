var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var OrangeeJSUtil = require('./util');
require('shelljs/global');

function OrangeeJSInitTask() {
};

OrangeeJSInitTask.prototype.run = function(debug) {
  mkdir('-p', 'app/lib');
  mkdir('-p', 'assets');
 
  if (debug) {
    console.log("DEBUG: js will not be minified");
  }

  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  var name = path.basename(process.cwd());
  
  if (!fs.existsSync('package.json')) {
      OrangeeJSUtil.transform_template(src + "/example/package.json.template", "package.json", {name: name});
  };

  cp(src + "/assets/stylesheets/bootstrap.min.css", "app/lib/bootstrap.min.css");
  cp(src + "/assets/javascripts/jquery.min.js", "app/lib/jquery.min.js");
  cp(src + "/assets/javascripts/underscore-min.js", "app/lib/underscore-min.js");
  cp(src + "/assets/javascripts/backbone-min.js", "app/lib/backbone-min.js");
  cp(src + "/assets/javascripts/backbone.marionette.min.js", "app/lib/backbone.marionette.min.js");
  cp(src + "/assets/javascripts/backbone.paginator.min.js", "app/lib/backbone.paginator.min.js");
  cp(src + "/assets/javascripts/backbone.select.min.js", "app/lib/backbone.select.min.js");
  cp("-r", src + "/assets/fonts", "app/");
  OrangeeJSUtil.concat_css(src, OrangeeJSUtil.ui_css_sources, "app/lib/orangee-ui.css");
  OrangeeJSUtil.concat_js(src, OrangeeJSUtil.core_js_sources.concat("/platforms/orangee.html5.js"), "app/lib/orangee.js", debug);
  OrangeeJSUtil.concat_js(src, OrangeeJSUtil.ui_js_sources, "app/lib/orangee-ui.js", debug);

  cp(src + '/example/icon.example.png', 'assets/icon.png');
  cp(src + '/example/splash-portrait.example.png',  'assets/splash-portrait.png');
  cp(src + '/example/splash-landscape.example.png', 'assets/splash-landscape.png');
  cp(src + "/example/index.example.html", 'app/index.html');
  cp(src + "/example/app.example.js", 'app/app.js');
  cp(src + "/example/app.example.css", 'app/app.css');
};

module.exports = OrangeeJSInitTask;
