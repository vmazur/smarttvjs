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
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  mkdir("-p", 'build/ios/www/res/icons/ios');
  mkdir("-p", 'build/ios/www/res/screens/ios');
  mkdir('-p', 'assets/ios');
  if (!which('cordova')) {
    echo('Please install cordova: "sudo npm install -g cordova"');
    return;
  }

  if (!fs.existsSync('build/ios')) {
    var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
    exec('cordova create build/ios ' + appdata['name'] + " " + appdata['name'], {async:false});
    //exec('cordova plugin add org.apache.cordova.device', {async:false});
    //exec('cordova plugin add org.apache.cordova.console', {async:false});
    //exec('cordova plugin add org.apache.cordova.statusbar', {async:false});
    cd('build/ios');
    exec('cordova platform add ios', {async:false});
    cd("../../");
    rm("-rf", "build/ios/www/*");
  }

  OrangeeJSUtil.resize_image([
    ['assets/icon.png',114,114, 'assets/ios/icon-57-2x.png'],
    ['assets/icon.png',57 ,57,  'assets/ios/icon-57.png'],
    ['assets/icon.png',144,144, 'assets/ios/icon-72-2x.png'],
    ['assets/icon.png',72 ,72,  'assets/ios/icon-72.png'],
    ['assets/splash-landscape.png',2048,1496,'assets/ios/screen-ipad-landscape-2x.png'],
    ['assets/splash-landscape.png',1024,748, 'assets/ios/screen-ipad-landscape.png'],
    ['assets/splash-landscape.png',960 ,640, 'assets/ios/screen-iphone-landscape-2x.png'],
    ['assets/splash-landscape.png',480 ,320, 'assets/ios/screen-iphone-landscape.png'],
    ['assets/splash-portrait.png',1536,2008,'assets/ios/screen-ipad-portrait-2x.png'],
    ['assets/splash-portrait.png',768 ,1004,'assets/ios/screen-ipad-portrait.png'],
    ['assets/splash-portrait.png',640 ,960, 'assets/ios/screen-iphone-portrait-2x.png'],
    ['assets/splash-portrait.png',320 ,480, 'assets/ios/screen-iphone-portrait.png'],
    ['assets/splash-portrait.png',640 ,1136,'assets/ios/screen-iphone-portrait-568h-2x.png']
  ], function() {
    cp("-rf", 'app/', 'build/ios/www');
    cp("-f", src + "/platforms/orangee.html5.js", "build/samsung/orangee.js");
    cp("-rf", 'assets/ios/icon*', 'build/ios/www/res/icons/ios');
    cp("-rf", 'assets/ios/screen*', 'build/ios/www/res/screens/ios');

    cd('build/ios');
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

  OrangeeJSUtil.resize_image('assets/icon.png', [[115, 95, 'assets/samsung/icon_115.png'], 
                             [106,87, 'assets/samsung/icon_106.png'], 
                             [95, 78, 'assets/samsung/icon_9.png'], 
                             [85, 70, 'assets/samsung/icon_85.png']]);

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
