var fs = require('fs');
var path = require('path');

function OrangeeJSRunTask() {
};

OrangeeJSRunTask.prototype.run = function(name) {
  //VBoxManage list vms
  //VBoxManage list runningvms
  //VBoxManage controlvm "Name_of_VM" poweroff
  if (name === 'samsung') {
    exec("VBoxManage startvm 2014_Smart_TV_Emulator_5_0");
  }
};

module.exports = OrangeeJSRunTask;
