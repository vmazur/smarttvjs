var fs = require('fs');

function OrangeeJSBuildTask() {
};

OrangeeJSBuildTask.prototype.run = function(name) {
  this._build_samsung();
  mkdir('-p', 'build/lg');
  mkdir('-p', 'build/vizio')
  mkdir('-p', 'build/html5');
};

OrangeeJSBuildTask.prototype._build_samsung = function() {
  console.log("build samsung");
  mkdir('-p', 'build/samsung');
  var content = "Use Alpha Blending? = Yes\n" + 
    "Screen Resolution = 1280x720";
  fs.writeFile("build/samsung/widget.info", content, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  }); 
}

module.exports = OrangeeJSBuildTask;
