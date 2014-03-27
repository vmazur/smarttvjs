var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

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

  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  this._transform_template(src + "/platforms/samsung/config.xml.template", "build/samsung/config.xml", appdata);
  this._transform_template(src + "/platforms/samsung/eclipse.project.template", "build/samsung/.project", appdata);
  this._transform_template(src + "/platforms/samsung/index.html.template", "build/samsung/index.html", {});

  cp(src + "/platforms/samsung/widget.info", "build/samsung/")
  cp("-r", 'app', 'build/samsung/')
}

OrangeeJSBuildTask.prototype._transform_template = function(inputfile, outputfile, data) {
  var template = fs.readFileSync(inputfile, "utf8");
  var s = mustache.render(template, data);
  fs.writeFileSync(outputfile, s);
}

module.exports = OrangeeJSBuildTask;
