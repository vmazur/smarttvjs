var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var OrangeeJSUtil = require('./util');

function OrangeeJSBuildTask() {
};

OrangeeJSBuildTask.prototype.run = function(name) {
  mkdir("-p", 'build');
  if (name === 'samsung') {
    this._build_samsung();
  } else if (name === 'lg') {
    this._build_lg();
  } else if (name === 'ios') {
    this._build_ios();
  } else if (name === 'android') {
    this._build_android();
  } else if (name === 'roku') {
    this._build_roku();
  }
};

OrangeeJSBuildTask.prototype._build_lg = function() {
  console.log("build lg");
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  mkdir('-p', 'build/lg/WebContent');
  
  cp("-rf", 'app/', 'build/lg/WebContent');
  OrangeeJSUtil.concat_js(src, OrangeeJSUtil.core_js_sources.concat("/platforms/orangee.lg.js"), "build/lg/WebContent/lib/orangee.js");

  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  OrangeeJSUtil.transform_template(src + "/platforms/lg/eclipse.project.template", "build/lg/.project", appdata);
  cp("-rf", src + '/platforms/lg/eclipse.settings/', 'build/lg/.settings');
  OrangeeJSUtil.transform_template(src + "/platforms/lg/eclipse.settings/org.eclipse.wst.common.component.template", "build/lg/.settings/org.eclipse.wst.common.component", appdata);
  rm("-rf", "build/lg/.settings/org.eclipse.wst.common.component.template")

  OrangeeJSUtil.zip("build/lg/WebContent", "build/lg.zip");
};

OrangeeJSBuildTask.prototype._build_android = function() {
  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  var resizes = [
    ['assets/icon.png',96,96, 'assets/android/appicon-drawable.png'],
    ['assets/icon.png',72 ,72,  'assets/android/appicon-drawable-hdpi.png'],
    ['assets/icon.png',36,36, 'assets/android/appicon-drawable-ldpi.png'],
    ['assets/icon.png',48 ,48,  'assets/android/appicon-drawable-mdpi.png'],
    //['assets/icon.png',96 ,96,  'assets/android/icon-drawable-xhdpi.png'],
    ['assets/icon.png',144,144,  'assets/android/icon-drawable-xxhdpi.png']
  ];
  var icon_map = [
    ['appicon-drawable.png', 'res/drawable/icon.png'],
    ['appicon-drawable-hdpi.png', 'res/drawable-hdpi/icon.png'],
    ['appicon-drawable-ldpi.png', 'res/drawable-ldpi/icon.png'],
    ['appicon-drawable-mdpi.png', 'res/drawable-mdpi/icon.png'],
    ['appicon-drawable.png', 'res/drawable-xhdpi/icon.png'],
    ['appicon-drawable-xxhdpi.png', 'res/drawable-xxhdpi/icon.png']
  ];
  var splash_map = [];

  this._build_cordova('android', resizes, icon_map, splash_map, appdata);
};

OrangeeJSBuildTask.prototype._build_ios = function() {
  //http://docs.appcelerator.com/titanium/3.0/#!/guide/Icons_and_Splash_Screens
  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  var resizes = [
    //phonegap build
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
  ];
  var icon_map = [ 
    ["icon-57.png", appdata['name'] + "/Resources/icons/icon.png"],
    ["icon-57-2x.png", appdata['name'] + "/Resources/icons/icon@2x.png"],
    ["icon-72.png", appdata['name'] + "/Resources/icons/icon-72.png"],
    ["icon-72-2x.png", appdata['name'] + "/Resources/icons/icon-72@2x.png"],

    ["appicon-40.png", appdata['name'] + "/Resources/icons/icon-40.png"],
    ["appicon-40@2x.png", appdata['name'] + "/Resources/icons/icon-40@2x.png"],
    ["appicon-50.png", appdata['name'] + "/Resources/icons/icon-50.png"],
    ["appicon-50@2x.png", appdata['name'] + "/Resources/icons/icon-50@2x.png"],
    ["appicon-60.png", appdata['name'] + "/Resources/icons/icon-60.png"],
    ["appicon-60@2x.png", appdata['name'] + "/Resources/icons/icon-60@2x.png"],
    ["appicon-76.png", appdata['name'] + "/Resources/icons/icon-76.png"],
    ["appicon-76@2x.png", appdata['name'] + "/Resources/icons/icon-76@2x.png"],
    ["appicon-small.png", appdata['name'] + "/Resources/icons/icon-small.png"],
    ["appicon-small@2x.png", appdata['name'] + "/Resources/icons/icon-small@2x.png"],
  ];
  var splash_map = [
    ["screen-iphone-portrait-568h-2x.png",  appdata['name'] + "/Resources/splash/Default-568h@2x~iphone.png"],	
    ["screen-ipad-landscape.png", appdata['name'] + "/Resources/splash/Default-Landscape~ipad.png"],	
    ["screen-ipad-portrait.png", appdata['name'] + "/Resources/splash/Default-Portrait~ipad.png"],
    ["screen-iphone-portrait.png", appdata['name'] + "/Resources/splash/Default~iphone.png"],
    ["screen-ipad-landscape-2x.png", appdata['name'] + "/Resources/splash/Default-Landscape@2x~ipad.png"],
    ["screen-ipad-portrait-2x.png", appdata['name'] + "/Resources/splash/Default-Portrait@2x~ipad.png"],
    ["screen-iphone-portrait-2x.png", appdata['name'] + "/Resources/splash/Default@2x~iphone.png"]
  ];

  this._build_cordova('ios', resizes, icon_map, splash_map, appdata);
};

OrangeeJSBuildTask.prototype._build_cordova = function(os_name, resizes, icon_map, splash_map, appdata) {
  console.log("build " + os_name);
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  if (!which('cordova')) {
    echo('Please install cordova: "sudo npm install -g cordova"');
    return;
  }
  
  if (!fs.existsSync('build/' + os_name)) {
    OrangeeJSUtil.exec('cordova create build/' + os_name + ' ' + appdata['package'] + " " + appdata['name']);
    cd('build/' + os_name);
    OrangeeJSUtil.exec('cordova platform add ' + os_name);
    appdata['cordova_plugins'].forEach(function(plugin) {
      OrangeeJSUtil.exec('cordova plugin add ' + plugin);
    });
    cd("../../");
    rm("-rf", "build/" + os_name + "/www/*");
  }
  
  mkdir('-p', 'assets/' + os_name);
  mkdir("-p", 'build/' + os_name + '/www/res/icon/' + os_name);
  mkdir("-p", 'build/' + os_name + '/www/res/screen/' + os_name);
  OrangeeJSUtil.resize_image(resizes, function() {
    cp("-f", 'config.' + os_name + '.xml', 'build/' + os_name + '/config.xml');
    cp("-rf", 'app/', 'build/' + os_name + '/www');
    OrangeeJSUtil.concat_js(src, OrangeeJSUtil.core_js_sources.concat("/platforms/orangee.html5.js"), 'build/' + os_name + '/www/lib/orangee.js');
    
    //for phonegap build
    cp("-rf", 'assets/' + os_name + '/icon*', 'build/' +os_name + '/www/res/icon/' + os_name);
    cp("-rf", 'assets/' + os_name + '/screen*', 'build/' + os_name + '/www/res/screen/' + os_name);

    //to build locally
    //http://devgirl.org/2013/11/12/three-hooks-your-cordovaphonegap-project-needs/
    //http://stackoverflow.com/questions/17999766/app-icon-not-changing-to-custom-icon-using-cordova
    icon_map.forEach(function(value) {
      console.log('assets/' + os_name + '/' + value[0] + "->"+ 'build/' + os_name + '/platforms/' + os_name + '/' + value[1]);
      cp("-rf", 'assets/' + os_name + '/' + value[0], 'build/' + os_name + '/platforms/' + os_name + '/' + value[1]);
    });
    splash_map.forEach(function(value) {
      console.log('assets/' + os_name + '/' + value[0] + "->"+ 'build/' + os_name + '/platforms/' + os_name + '/' + value[1]);
      cp("-rf", 'assets/' + os_name + '/' + value[0], 'build/' + os_name + '/platforms/' + os_name + '/' + value[1]);
    });

    cd('build/' + os_name);
    exec('cordova build ' + os_name);
    cd("../../");
  });

};

OrangeeJSBuildTask.prototype._build_roku = function() {
  console.log("build roku");
  mkdir('-p', 'roku/images');

  OrangeeJSUtil.resize_image([
    ['assets/icon.png', 336,210, 'roku/images/icon_focus_hd.png'],
    ['assets/icon.png', 248,140, 'roku/images/icon_focus_sd.png'],
    ['assets/icon.png', 108, 69, 'roku/images/icon_side_hd.png'],
    ['assets/icon.png', 80, 46,  'roku/images/icon_side_sd.png'],
    ['assets/splash-landscape.png',1280,720,'roku/images/hd_splash.png'],
    ['assets/splash-landscape.png',720,480, 'roku/images/sd_splash.png']
  ], function() {
    OrangeeJSUtil.zip("roku", "build/roku.zip");
  });
}

OrangeeJSBuildTask.prototype._build_samsung = function() {
  console.log("build samsung");
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  mkdir('-p', 'build/samsung/icons');
  mkdir('-p', 'assets/samsung');

  cp("-rf", 'app/', 'build/samsung/');
  OrangeeJSUtil.concat_js(src, OrangeeJSUtil.core_js_sources.concat("platforms/orangee.samsung.js", "samsungplayer.js"), "build/samsung/lib/orangee.js");

  var indexhtml = fs.readFileSync("build/samsung/index.html", "utf8");
  indexhtml = indexhtml.replace("</head>",
"<script type='text/javascript' language='javascript' src='$MANAGER_WIDGET/Common/API/Widget.js'></script>"+
"<script type='text/javascript' language='javascript' src='$MANAGER_WIDGET/Common/API/TVKeyValue.js'></script>"+
"<script type='text/javascript' language='javascript' src='$MANAGER_WIDGET/Common/API/Plugin.js'></script>"+
"<object id='pluginAudio' border=0 classid='clsid:SAMSUNG-INFOLINK-AUDIO'></object>\n" +
"<object id='pluginObjectTVMW' border=0 classid='clsid:SAMSUNG-INFOLINK-TVMW'></object>\n" +
"<object id='pluginObjectNNavi' border=0 classid='clsid:SAMSUNG-INFOLINK-NNAVI' style='opacity:0.0;background-color:#000000;width:0px;height:0px;'></object>\n" +
"<object id='pluginWindow' classid='clsid:SAMSUNG-INFOLINK-WINDOW' style='visibility:hidden; position:absolute; width: 0; height: 0; opacity: 0;'></object>\n" +
"<object id='pluginObjectNetwork' border='0' classid='clsid:SAMSUNG-INFOLINK-NETWORK'></object>\n" +
"<object id='pluginObjectTV' border=0 classid='clsid:SAMSUNG-INFOLINK-TV' style='opacity:0.0;background-color:#000000;width:0px;height:0px;'></object>\n" +
"<object id='pluginPlayer' border=0 classid='clsid:SAMSUNG-INFOLINK-PLAYER' style='visibility:hidden; position:absolute; width: 0; height: 0; opacity: 0;'></object>\n" +
"</head>");
  fs.writeFileSync("build/samsung/index.html", indexhtml);

  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  OrangeeJSUtil.transform_template(src + "/platforms/samsung/config.xml.template", "build/samsung/config.xml", appdata);
  OrangeeJSUtil.transform_template(src + "/platforms/samsung/eclipse.project.template", "build/samsung/.project", appdata);
  
  cp("-f", src + "/platforms/samsung/widget.info", "build/samsung/");

  OrangeeJSUtil.resize_image([
    //['assets/icon.png',512, 423, 'assets/samsung/icon_512_423.png'],
    ['assets/icon.png',115, 95, 'assets/samsung/icon_115.png'],
    ['assets/icon.png', 106,87, 'assets/samsung/icon_106.png'],
    ['assets/icon.png', 95, 78, 'assets/samsung/icon_95.png'],
    ['assets/icon.png', 85, 70, 'assets/samsung/icon_85.png'],
  ], function() {
    cp("-rf", 'assets/samsung/', 'build/samsung/icons');

    rm("-rf", "build/samsung/samsung.zip")
    var self = this;
    OrangeeJSUtil.zip("build/samsung", "build/samsung.zip", function(size) {
      appdata['filesize'] = size;
      appdata['downloadurl'] = "http://" + OrangeeJSUtil.getip() + "/samsung.zip";
      OrangeeJSUtil.transform_template(src + "/platforms/samsung/widgetlist.xml.template", "build/widgetlist.xml", appdata);
    })
  });

};

module.exports = OrangeeJSBuildTask;
