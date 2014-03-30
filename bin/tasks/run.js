var fs = require('fs');
var path = require('path');

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
    } else {
      console.log("please specify samsung_vm in package.json");
    }
  }
};

module.exports = OrangeeJSRunTask;
