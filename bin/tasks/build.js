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
  mkdir('-p', 'build/lg/WebContent');
  
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
  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  if (!which('cordova')) {
    echo('Please install cordova: "sudo npm install -g cordova"');
    return;
  }
  
  if (!fs.existsSync('build/ios')) {
    exec('cordova create build/ios ' + appdata['name'] + " " + appdata['name'], {async:false});
    cd('build/ios');
    exec('cordova platform add ios', {async:false});
    appdata['cordova_plugins'].forEach(function(plugin) {
      exec('cordova plugin add ' + plugin, {async:false});
    });
    cd("../../");
    rm("-rf", "build/ios/www/*");
  }
  
  mkdir('-p', 'assets/ios');
  mkdir("-p", 'build/ios/www/res/icon/ios');
  mkdir("-p", 'build/ios/www/res/screen/ios');
  //http://docs.appcelerator.com/titanium/3.0/#!/guide/Icons_and_Splash_Screens
  OrangeeJSUtil.resize_image([
    ['assets/icon.png',114,114, 'assets/ios/icon-57-2x.png'],
    ['assets/icon.png',57 ,57,  'assets/ios/icon-57.png'],
    ['assets/icon.png',144,144, 'assets/ios/icon-72-2x.png'],
    ['assets/icon.png',72 ,72,  'assets/ios/icon-72.png'],

    ['assets/icon.png',40 ,40,  'assets/ios/appicon-40.png'],
    ['assets/icon.png',80 ,80,  'assets/ios/appicon-40@2x.png'],
    ['assets/icon.png',50 ,50,  'assets/ios/appicon-50.png'],
    ['assets/icon.png',100 ,100,  'assets/ios/appicon-50@2x.png'],
    ['assets/icon.png',60 ,60,  'assets/ios/appicon-60.png'],
    ['assets/icon.png',120 ,120,  'assets/ios/appicon-60@2x.png'],
    ['assets/icon.png',76 ,76,  'assets/ios/appicon-76.png'],
    ['assets/icon.png',152 ,152,  'assets/ios/appicon-76@2x.png'],
    ['assets/icon.png',29 ,29,  'assets/ios/appicon-small.png'],
    ['assets/icon.png',58 ,58,  'assets/ios/appicon-small@2x.png'],

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
    cp("-f", src + "/platforms/orangee.html5.js", "build/ios/www/orangee.js");
    
    //for phonegap build
    cp("-rf", 'assets/ios/icon*', 'build/ios/www/res/icon/ios');
    cp("-rf", 'assets/ios/screen*', 'build/ios/www/res/screen/ios');

    //to build locally
    //http://devgirl.org/2013/11/12/three-hooks-your-cordovaphonegap-project-needs/
    //http://stackoverflow.com/questions/17999766/app-icon-not-changing-to-custom-icon-using-cordova
    var icon_map = [ 
      ["icon-57.png", "icon.png"],
      ["icon-57-2x.png", "icon@2x.png"],
      ["icon-72.png", "icon-72.png"],
      ["icon-72-2x.png", "icon-72@2x.png"],

      ["appicon-40.png", "icon-40.png"],
      ["appicon-40@2x.png", "icon-40@2x.png"],
      ["appicon-50.png", "icon-50.png"],
      ["appicon-50@2x.png", "icon-50@2x.png"],
      ["appicon-60.png", "icon-60.png"],
      ["appicon-60@2x.png", "icon-60@2x.png"],
      ["appicon-76.png", "icon-76.png"],
      ["appicon-76@2x.png", "icon-76@2x.png"],
      ["appicon-small.png", "icon-small.png"],
      ["appicon-small@2x.png", "icon-small@2x.png"],
    ];
    icon_map.forEach(function(value) {
      console.log('assets/ios/' + value[0] + "->"+ 'build/ios/platforms/ios/' + appdata['name'] + '/Resources/icons/' + value[1]);
      cp("-rf", 'assets/ios/' + value[0], 'build/ios/platforms/ios/' + appdata['name'] + '/Resources/icons/' + value[1]);
    });
    var splash_map = [
      ["screen-iphone-portrait-568h-2x.png", "Default-568h@2x~iphone.png"],	
      ["screen-ipad-landscape.png", "Default-Landscape~ipad.png"],	
      ["screen-ipad-portrait.png", "Default-Portrait~ipad.png"],
      ["screen-iphone-portrait.png", "Default~iphone.png"],
      ["screen-ipad-landscape-2x.png", "Default-Landscape@2x~ipad.png"],
      ["screen-ipad-portrait-2x.png", "Default-Portrait@2x~ipad.png"],
      ["screen-iphone-portrait-2x.png", "Default@2x~iphone.png"]
    ];
    splash_map.forEach(function(value) {
      console.log('assets/ios/' + value[0] + "->"+ 'build/ios/platforms/ios/' + appdata['name'] + '/Resources/splash/' + value[1]);
      cp("-rf", 'assets/ios/' + value[0], 'build/ios/platforms/ios/' + appdata['name'] + '/Resources/splash/' + value[1]);
    });

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
