var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

function OrangeeJSBuildTask() {
};

OrangeeJSBuildTask.prototype.run = function(name) {
  if (name === 'samsung') {
    this._build_samsung();
  } else if (name === 'lg') {
    this._build_lg();
  } else if (name === 'vizio') {
    this._build_vizio();
  } else {
    this._build_samsung();
    this._build_lg();
    this._build_vizio();
  }
};

OrangeeJSBuildTask.prototype._build_lg = function() {
  console.log("build lg");
  mkdir('-p', 'build/lg')
};

OrangeeJSBuildTask.prototype._build_vizio = function() {
  console.log("build vizio");
  mkdir('-p', 'build/vizio')
};

OrangeeJSBuildTask.prototype._build_samsung = function() {
  console.log("build samsung");
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  mkdir('-p', 'build/samsung');

  cp("-rf", 'app/', 'build/samsung/');
  cp("-f", src + "/platforms/orangee.samsung.js", "build/samsung/orangee.js");
  
  var appdata = JSON.parse(fs.readFileSync("package.json", "utf8"));
  this._transform_template(src + "/platforms/samsung/config.xml.template", "build/samsung/config.xml", appdata);
  this._transform_template(src + "/platforms/samsung/eclipse.project.template", "build/samsung/.project", appdata);
  
  //this._build_index_html(src + "/platforms/samsung/index.html.template", "build/samsung/index.html");

  cp("-f", src + "/platforms/samsung/widget.info", "build/samsung/");
  
  rm("-rf", "build/samsung/icons/default.icon")
  rm("-rf", "build/samsung/samsung.zip")
  this._zip("build/samsung", "build/samsung/samsung.zip");
};

OrangeeJSBuildTask.prototype._transform_template = function(inputfile, outputfile, data) {
  var template = fs.readFileSync(inputfile, "utf8");
  var s = mustache.render(template, data);
  fs.writeFileSync(outputfile, s);
};

OrangeeJSBuildTask.prototype._build_index_html = function(inputfile, outputfile) {
  var header = fs.readFileSync(inputfile, "utf8");
  var body = fs.readFileSync("app/index.html", "utf8");;
  var footer = "\n</body>\n</html>"
  fs.writeFileSync(outputfile, header + body + footer);
};

OrangeeJSBuildTask.prototype._zip = function(inputdir, zipfilename) {
  var archiver = require('archiver');

  var output = fs.createWriteStream(zipfilename);
  var archive = archiver('zip');

  output.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function(err){
      throw err;
  });

  archive.pipe(output);
  archive.bulk([
      { expand: true, cwd: inputdir, src: ['**'], dest: ""}
  ]);
  archive.finalize();
};

module.exports = OrangeeJSBuildTask;
