var fs = require('fs');
var path = require('path');
var needle = require('needle');
require('shelljs/global');
var SmartTVJSUtil = require('./util');

function SmartTVJSRunTask() {
};

SmartTVJSRunTask.prototype.run = function(name) {
  //VBoxManage list vms
  //VBoxManage list runningvms
  //VBoxManage controlvm "Name_of_VM" poweroff
  if (name === 'samsung') {
    //var vm = "2014_Smart_TV_Emulator_5_0";
    //var vm = "2013_Smart_TV_Emulator_4_5";
    var vm = JSON.parse(fs.readFileSync("package.json", "utf8"))['samsung_vm'];
    if (vm) {
      if (SmartTVJSUtil.exec('VBoxManage list runningvms').output.indexOf('"' + vm + '"') > -1) {
        console.log("SmartTVJS: trying to shutdown existing vm...");
        SmartTVJSUtil.exec('VBoxManage controlvm ' + vm + ' poweroff');
      }
      console.log("SmartTVJS: statring new vm...");
      SmartTVJSUtil.exec('VBoxManage sharedfolder remove '+ vm + ' -name Apps');
      SmartTVJSUtil.exec('VBoxManage sharedfolder add ' + vm + ' -name Apps -hostpath "' + process.cwd() + '/build" --automount');
      SmartTVJSUtil.exec('VBoxManage startvm ' + vm);
    }
  } else if (name === 'lg') {
    if (process.platform === 'darwin') {
      var port = JSON.parse(fs.readFileSync("package.json", "utf8"))['lg_port'] || 8088;
      var T = require('./server');
      (new T()).run(port, process.cwd() + '/build/lg/WebContent');

      SmartTVJSUtil.exec_background('/opt/LG_Smart_TV_SDK/LG_Smart_TV_Emulator_2013/LG_Smart_TV_Emulator_2013_RCU.app/Contents/MacOS/JavaApplicationStub -b http://127.0.0.1:' + port);
    } else {
      console.log("we havn't implmenent this feature on your operating sysytem, please help us by contributing to smarttvjs");
    }
  } else if (name === 'ios' || name === 'iphone') {
    cd('build/ios');
    SmartTVJSUtil.exec('cordova emulate ios');//cordova emulate emulate --target="iPhone"
    cd('../..');
  } else if (name === 'iphone5') {
    cd('build/ios');
    SmartTVJSUtil.exec('cordova emulate emulate --target="iPhone (Retina 4-inch)"');
    cd('../..');
  } else if (name === 'iphone4') {
    cd('build/ios');
    SmartTVJSUtil.exec('cordova emulate emulate --target="iPhone (Retina 3.5-inch)"');
    cd('../..');
  } else if (name === 'ipad') {
    cd('build/ios');
    SmartTVJSUtil.exec('cordova emulate emulate --target="iPad"');
    cd('../..');
  } else if (name === 'ipad4') {
    cd('build/ios');
    SmartTVJSUtil.exec('cordova emulate emulate --target="iPad (Retina)"');
    cd('../..');
  } else if (name === 'android') {
    var vm = JSON.parse(fs.readFileSync("package.json", "utf8"))['android_vm'];
    if (vm) {
      //unliks samsung, genymotion allow us to replace exsiting app inside a running vm
      if (SmartTVJSUtil.exec('VBoxManage list runningvms').output.indexOf('"' + vm + '"') == -1) {
        console.log("!!!!vm is not running, please start one from genymotion first...");
        //SmartTVJSUtil.exec_background('/Applications/Genymotion.app/Contents/MacOS/player --vm-name "' + vm + '"');
        //TODO we can start with command above, but we need to find a way to wait for it finish starting
      }
    } else {
      console.log('android vm found, try to attach to exsiting one...');
    }
    cd('build/android');
    SmartTVJSUtil.exec('cordova run android');
    cd('../..');
  } else if (name === 'roku') {
    var roku = JSON.parse(fs.readFileSync("package.json", "utf8"))['roku'];
    if (!roku) {
      console.log("please config roku ip/password first");
      return;
    }
    var data = {
      mysubmit: "Install",
      archive: {file: 'build/roku.zip'},
    };
    var options = {
      multipart: true,
      auth: 'digest',
      username: 'rokudev',
      password: roku['password'],
    };

    console.log('http://' + roku['ip'] + '/plugin_install');
    console.log(options);
    needle.post('http://' + roku['ip'] + '/plugin_install', data, options, function(err, resp, body) {
      console.log(err);
      console.log(body);
    });
  } else {
    console.log("UNKNOWN: " + name);
  }
};

module.exports = SmartTVJSRunTask;
