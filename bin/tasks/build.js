function OrangeeJSBuildTask() {
};

OrangeeJSBuildTask.prototype.run = function() {
  mkdir('-p', 'build/samsung');
  mkdir('-p', 'build/lg');
  mkdir('-p', 'build/vizio')
  mkdir('-p', 'build/html5');
};

module.exports = OrangeeJSBuildTask;
