var fs = require('fs');
var path = require('path');
require('shelljs/global');
var OrangeeJSUtil = require('./util');

function OrangeeJSRunTask() {
};

OrangeeJSRunTask.prototype.run = function(name) {
  //VBoxManage list vms
  //VBoxManage list runningvms
  //VBoxManage controlvm "Name_of_VM" poweroff
  if (name === 'samsung') {
    //var vm = "2014_Smart_TV_Emulator_5_0";
    //var vm = "2013_Smart_TV_Emulator_4_5";
    var vm = JSON.parse(fs.readFileSync("package.json", "utf8"))['samsung_vm'];
    if (vm) {
      if (OrangeeJSUtil.exec('VBoxManage list runningvms').output.indexof('"' + vm + '"') > -1) {
        console.log("OrangeeJS: trying to shutdown existing vm...");
        OrangeeJSUtil.exec('VBoxManage controlvm ' + vm + ' poweroff');
      }
      console.log("OrangeeJS: statring new vm...");
      OrangeeJSUtil.exec('VBoxManage sharedfolder remove '+ vm + ' -name Apps');
      OrangeeJSUtil.exec('VBoxManage sharedfolder add ' + vm + ' -name Apps -hostpath "' + process.cwd() + '/build" --automount');
      OrangeeJSUtil.exec('VBoxManage startvm ' + vm);
    }
  } else if (name === 'lg') {
    if (process.platform === 'darwin') {
      var port = JSON.parse(fs.readFileSync("package.json", "utf8"))['lg_port'] || 8088;
      var T = require('./server');
      (new T()).run(port, process.cwd() + '/build/lg/WebContent');

      OrangeeJSUtil.exec_background('/opt/LG_Smart_TV_SDK/LG_Smart_TV_Emulator_2013/LG_Smart_TV_Emulator_2013_RCU.app/Contents/MacOS/JavaApplicationStub -b http://127.0.0.1:' + port);
    } else {
      console.log("we havn't implmenent this feature on your operating sysytem, please help us by contributing to orangeejs");
    }
  } else if (name === 'ios' || name === 'iphone') {
    cd('build/ios');
    OrangeeJSUtil.exec('cordova emulate ios');//cordova emulate emulate --target="iPhone"
    cd('../..');
  } else if (name === 'iphone5') {
    cd('build/ios');
    OrangeeJSUtil.exec('cordova emulate emulate --target="iPhone (Retina 4-inch)"');
    cd('../..');
  } else if (name === 'iphone4') {
    cd('build/ios');
    OrangeeJSUtil.exec('cordova emulate emulate --target="iPhone (Retina 3.5-inch)"');
    cd('../..');
  } else if (name === 'ipad') {
    cd('build/ios');
    OrangeeJSUtil.exec('cordova emulate emulate --target="iPad"');
    cd('../..');
  } else if (name === 'ipad4') {
    cd('build/ios');
    OrangeeJSUtil.exec('cordova emulate emulate --target="iPad (Retina)"');
    cd('../..');
  } else if (name === 'android') {
    var vm = JSON.parse(fs.readFileSync("package.json", "utf8"))['android_vm'];
    if (vm) {
      //unliks samsung, genymotion allow us to replace exsiting app inside a running vm
      if (OrangeeJSUtil.exec('VBoxManage list runningvms').output.indexOf('"' + vm + '"') == -1) {
        console.log("vm is not running launch one...");
        OrangeeJSUtil.exec_background('/Applications/Genymotion.app/Contents/MacOS/player --vm-name "' + vm + '"');
      }
    } else {
      console.log('no android vum found, try to attach to exsiting one...');
    }
    cd('build/android');
    OrangeeJSUtil.exec('cordova run android');
    cd('../..');
  }
};

module.exports = OrangeeJSRunTask;
