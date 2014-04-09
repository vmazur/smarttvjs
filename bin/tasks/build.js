var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var OrangeeJSUtil = require('./util');

function OrangeeJSBuildTask() {
};

OrangeeJSBuildTask.prototype.run = function(name) {
  if (name === 'samsung') {
    this._build_samsung();
  } else if (name === 'lg') {
    this._build_lg();
  } else if (name === 'ios') {
    this._build_ios();
  }
};

OrangeeJSBuildTask.prototype._build_lg = function() {
  console.log("build lg");
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  mkdir('-p', 'build/lg/WebContent')
  
  cp("-rf", 'app/', 'build/lg/WebContent');
  cp("-f", src + "/platforms/orangee.lg.js", "build/lg/WebContent/orangee.js");
  
  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  OrangeeJSUtil.transform_template(src + "/platforms/lg/eclipse.project.template", "build/lg/.project", appdata);
  cp("-rf", src + '/platforms/lg/eclipse.settings/', 'build/lg/.settings');
  OrangeeJSUtil.transform_template(src + "/platforms/lg/eclipse.settings/org.eclipse.wst.common.component.template", "build/lg/.settings/org.eclipse.wst.common.component", appdata);
  rm("-rf", "build/lg/.settings/org.eclipse.wst.common.component.template")

  OrangeeJSUtil.zip("build/lg/WebContent", "build/lg.zip");
};

OrangeeJSBuildTask.prototype._build_ios = function() {
  console.log("build ios");
  mkdir('-p', 'build');
  if (!which('cordova')) {
    echo('Please install cordova: "sudo npm install -g cordova"');
    return;
  }

  fs.exists('build/ios', function(exists) {
    if (!exists) {
      var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
      exec('cordova create build/ios ' + appdata['name'] + " " + appdata['name'], {async:false});
      exec('cordova plugin add org.apache.cordova.device', {async:false});
      exec('cordova plugin add org.apache.cordova.console', {async:false});
      exec('cordova plugin add org.apache.cordova.statusbar', {async:false});
      rm("-rf", "build/ios/www/*")
    }

    cp("-rf", 'app/', 'build/ios/www');

    cd('build/ios');
    if (!exists) {
      exec('cordova platform add ios', {async:false});
    }
    //TODO cp app

    exec('cordova build ios');
    cd("../../");
 
  });
};

OrangeeJSBuildTask.prototype._build_samsung = function() {
  console.log("build samsung");
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  mkdir('-p', 'build/samsung/icons');
  mkdir('-p', 'assets/samsung');

  cp("-rf", 'app/', 'build/samsung/');
  cp("-f", src + "/platforms/orangee.samsung.js", "build/samsung/orangee.js");
  
  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  OrangeeJSUtil.transform_template(src + "/platforms/samsung/config.xml.template", "build/samsung/config.xml", appdata);
  OrangeeJSUtil.transform_template(src + "/platforms/samsung/eclipse.project.template", "build/samsung/.project", appdata);
  
  cp("-f", src + "/platforms/samsung/widget.info", "build/samsung/");

  var i = 0; 
  var gm = require('gm');
  var array =  [[115, 95], [106,87], [95, 78], [85, 70]];
  array.forEach(function(dim) {
    if (!fs.existsSync('assets/samsung/icon_' + dim[0] + '.png')) {
      gm('assets/icon.png').resize(dim[0], dim[1]).autoOrient().write('assets/samsung/icon_' + dim[0] + '.png', function(err) {
        console.log(err ? err : 'assets/samsung/icon_' + dim[0] + '.png');
        i++;
      });
    } else {
      i++;
    }
  });

  var sleep = require('sleep');
  while (i != array.length) {
    sleep.usleep(100);
  }

  cp("-rf", 'assets/samsung/', 'build/samsung/icons');

  rm("-rf", "build/samsung/samsung.zip")
  var self = this;
  OrangeeJSUtil.zip("build/samsung", "build/samsung.zip", function(size) {
    appdata['filesize'] = size;
    appdata['downloadurl'] = "http://" + OrangeeJSUtil.getip() + "/samsung.zip";
    OrangeeJSUtil.transform_template(src + "/platforms/samsung/widgetlist.xml.template", "build/widgetlist.xml", appdata);
  });

};

module.exports = OrangeeJSBuildTask;
