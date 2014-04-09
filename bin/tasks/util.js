var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
require('shelljs/global');

function OrangeeJSUtil() {
};

OrangeeJSUtil.copyUnlessExist = function(src, dst) {
  if (!fs.existsSync(dst)) {
    cp(src, dst);
  }
};

OrangeeJSUtil.getip = function() {
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

OrangeeJSUtil.transform_template = function(inputfile, outputfile, data) {
  var template = fs.readFileSync(inputfile, "utf8");
  var s = mustache.render(template, data);
  fs.writeFileSync(outputfile, s);
};

OrangeeJSUtil.zip = function(inputdir, zipfilename, callback) {
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

module.exports = OrangeeJSUtil;
