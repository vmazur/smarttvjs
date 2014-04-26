var fs = require('fs');
var path = require('path');
require('shelljs/global');

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
      exec('VBoxManage controlvm ' + vm + ' poweroff');
      exec('VBoxManage sharedfolder remove '+ vm + ' -name Apps');
      exec('VBoxManage sharedfolder add ' + vm + ' -name Apps -hostpath "' + process.cwd() + '/build" --automount');
      exec('VBoxManage startvm ' + vm);
    }
  } else if (name === 'lg') {
    exec('open -a LG_SMART_TV_Emulator_2013');
  } else if (name === 'ios' || name === 'iphone') {
    cd('build/ios')
    exec('cordova emulate ios');//cordova emulate emulate --target="iPhone"
    cd('../..')
  } else if (name === 'iphone5') {
    cd('build/ios')
    exec('cordova emulate emulate --target="iPhone (Retina 4-inch)"');
    cd('../..')
  } else if (name === 'iphone4') {
    cd('build/ios')
    exec('cordova emulate emulate --target="iPhone (Retina 3.5-inch)"');
    cd('../..')
  } else if (name === 'ipad') {
    cd('build/ios')
    exec('cordova emulate emulate --target="iPad"');
    cd('../..')
  } else if (name === 'ipad4') {
    cd('build/ios')
    exec('cordova emulate emulate --target="iPad (Retina)"');
    cd('../..')
  }
};

module.exports = OrangeeJSRunTask;
