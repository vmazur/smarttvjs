var fs = require('fs');
var path = require('path');

function OrangeeJSRunTask() {
};

OrangeeJSRunTask.prototype.run = function(name) {
  //VBoxManage list vms
  //VBoxManage list runningvms
  //VBoxManage controlvm "Name_of_VM" poweroff
  if (name === 'samsung') {
    exec('VBoxManage controlvm "2014_Smart_TV_Emulator_5_0" poweroff');
    exec('VBoxManage sharedfolder remove "2014_Smart_TV_Emulator_5_0" -name "Apps"');
    exec('VBoxManage sharedfolder add "2014_Smart_TV_Emulator_5_0" -name "Apps" -hostpath "' + process.cwd() + '/build" --automount');
    exec('VBoxManage startvm 2014_Smart_TV_Emulator_5_0');
  }
};

module.exports = OrangeeJSRunTask;
