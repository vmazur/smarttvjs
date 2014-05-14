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
      console.log("OrangeeJS: trying to shutdown existing vm, you will see some warning if no vm is running, just ignore...");
      exec('VBoxManage controlvm ' + vm + ' poweroff');
      console.log("OrangeeJS: statring new vm...");
      exec('VBoxManage sharedfolder remove '+ vm + ' -name Apps');
      exec('VBoxManage sharedfolder add ' + vm + ' -name Apps -hostpath "' + process.cwd() + '/build" --automount');
      exec('VBoxManage startvm ' + vm);
    }
  } else if (name === 'lg') {
    if (process.platform === 'darwin') {
      var port = JSON.parse(fs.readFileSync("package.json", "utf8"))['lg_port'] || 8088;
      var T = require('./server');
      (new T()).run(port, process.cwd() + '/build/lg/WebContent');
      
      var exec_command = require('child_process').exec;
      var command = '/opt/LG_Smart_TV_SDK/LG_Smart_TV_Emulator_2013/LG_Smart_TV_Emulator_2013_RCU.app/Contents/MacOS/JavaApplicationStub -b http://127.0.0.1:' + port;
      cosnole.log(command);
      exec_command(command, function (error, stdout, stderr) {
        if (error != null) {
            console.log('exec error: ' + error);
        }
      });
    } else {
      console.log("we havn't implmenent this feature on your operating sysytem, please help us by contributing to orangeejs");
    }
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
