function OrangeeJSInitTask() {
};

OrangeeJSInitTask.prototype.run = function() {
  mkdir('-p', 'app');
};

module.exports = OrangeeJSInitTask;
