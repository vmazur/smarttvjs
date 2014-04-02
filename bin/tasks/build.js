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
  var src = path.join(path.dirname(fs.realpathSync(__filename)), '../../src');
  mkdir('-p', 'build/lg')
  
  cp("-rf", 'app/', 'build/lg/');
  cp("-f", src + "/platforms/orangee.html5.js", "build/samsung/orangee.js");
  
  this._zip("build/lg", "build/lg.zip");
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
  var self = this;
  this._zip("build/samsung", "build/samsung.zip", function(size) {
    appdata['filesize'] = size;
    appdata['downloadurl'] = "http://" + self._getip() + "/samsung.zip";
    self._transform_template(src + "/platforms/samsung/widgetlist.xml.template", "build/widgetlist.xml", appdata);
  });
};

OrangeeJSBuildTask.prototype._transform_template = function(inputfile, outputfile, data) {
  var template = fs.readFileSync(inputfile, "utf8");
  var s = mustache.render(template, data);
  fs.writeFileSync(outputfile, s);
};

/*
OrangeeJSBuildTask.prototype._build_index_html = function(inputfile, outputfile) {
  var header = fs.readFileSync(inputfile, "utf8");
  var body = fs.readFileSync("app/index.html", "utf8");;
  var footer = "\n</body>\n</html>"
  fs.writeFileSync(outputfile, header + body + footer);
};*/

OrangeeJSBuildTask.prototype._zip = function(inputdir, zipfilename, callback) {
  var archiver = require('archiver');

  var output = fs.createWriteStream(zipfilename);
  var archive = archiver('zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    if (typeof callback === "function") {
      callback(archive.pointer());
    }
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

OrangeeJSBuildTask.prototype._getip = function() {
  var os=require('os');
  var ifaces=os.networkInterfaces();
  for (var dev in ifaces) {
    for (var i = 0; i < ifaces[dev].length; i++) {
      var details = ifaces[dev][i]; 
      if (details.family=='IPv4' && details.address != "127.0.0.1") {
        return details.address;
        ++alias;
      }
    }
  }
  return "127.0.0.1";
};

module.exports = OrangeeJSBuildTask;
