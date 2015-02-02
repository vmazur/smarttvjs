var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
require('shelljs/global');

function OrangeeJSUtil() {
};

OrangeeJSUtil.core_js_sources = [
  'core.js',
  'ytplayer.js',
  'connectplayer.js',
  'html5player.js',
  'videoplayer.js',
  'lib/openfb.js',
  'lib/xml2json.min.js',
  'lib/keys.js',
  'storage.js',
];

OrangeeJSUtil.ui_js_sources = [
  'lib/snap.min.js',
  'lib/iscroll.js',
  'lib/spin.min.js',
  'models.js',
  'views.js',
];

OrangeeJSUtil.ui_css_sources = [
  'orangeejs.css',
  'lib/snap.css',
];

OrangeeJSUtil.lib_js_sources = [
  'jquery.min.js',
  'jquery.lazyload.min.js', //sluggish on samsung tv
  'jquery.fullPage.min.js',
  'underscore-min.js',
  'backbone-min.js',
  'backbone.marionette.min.js',
  'backbone.paginator.min.js',
  'backbone.select.min.js',
  'move.min.js',
];

OrangeeJSUtil.lib_css_sources = [
  'bootstrap.min.css',
  'font-awesome.min.css',
];

OrangeeJSUtil.exec = function(cmd) {
  console.log(cmd);
  return exec(cmd, {async: false});
};

OrangeeJSUtil.exec_background = function(cmd) {
  console.log(cmd);
  return exec(cmd, {async: true});
};
//exec will block forerver if a app does not return
/*OrangeeJSUtil.exec_background = function(cmd) {
  var exec_command = require('child_process').exec;
  console.log(cmd);
  exec_command(cmd, function (error, stdout, stderr) {
    if (error != null) {
        console.log('exec_background error: ' + error);
    }
  });
};*/

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

OrangeeJSUtil.resize_image = function(size_array, callback) {
  var i = 0;
  var gm = require('gm');

  size_array.forEach(function(dim) {
    if (!fs.existsSync(dim[3])) {
      console.log("creating " + dim[3]  + " (" + dim[1] + "x" + dim[2] + ") using " + dim[0]);
      gm(dim[0]).resize(dim[1], dim[2], "!").write(dim[3], function(err) {
        console.log(err ? "error:" + err : dim[3]);
        i++;
        if (i == size_array.length) {
          callback();
        }
      });
    } else {
      i++;
      if (i == size_array.length) {
        callback();
      }
    }
  });

  if (size_array.length == 0) {
    callback();
  }
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

OrangeeJSUtil.concat_js = function(source_dir, source_files, outputfile, debug) {
  var new_sources = [];
  source_files.forEach(function(x) {
    new_sources = new_sources.concat(source_dir + '/' + x);
  });

  if (debug) {
    var compressor = require('node-minify');
    new compressor.minify({
      type: 'no-compress',
      fileIn: new_sources,
      fileOut: outputfile,
      callback: function(err, min){
        if (err) {
          console.log(err);
        }
      }
    });
  } else {
    var UglifyJS = require("uglify-js");
    var result = UglifyJS.minify(new_sources, {mangle: false, compress: false});
    fs.writeFileSync(outputfile, result.code);
  }
};

OrangeeJSUtil.concat_css = function(source_dir, source_files, outputfile) {
  var new_sources = [];
  source_files.forEach(function(x) {
    new_sources = new_sources.concat(source_dir + '/' + x);
  });
  var UglifyCSS = require("uglifycss");
  var result = UglifyCSS.processFiles(new_sources, {maxLineLen: 500, expandVars: true});
  fs.writeFileSync(outputfile, result);
}

OrangeeJSUtil.version = function() {
  var file = path.join(path.dirname(fs.realpathSync(__filename)), '../../package.json');
  return JSON.parse(fs.readFileSync(file, "utf8"))['version']
}

module.exports = OrangeeJSUtil;
