var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
var OrangeeJSUtil = require('./util');

function OrangeeJSServerTask() {
};

OrangeeJSServerTask.prototype.run = function(port, dir) {

  http.createServer(function(request, response) {
    request.on('data', function(data) {
      console.log(data.toString());
    });
    var uri = url.parse(request.url).pathname
      , filename = path.join(dir, uri);
    
    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }
   
      if (fs.statSync(filename).isDirectory()) filename += '/index.html';
   
      fs.readFile(filename, "binary", function(err, file) {
        if(err) {        
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }
   
        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  }).listen(parseInt(port, 10)).on('close', function() {
    console.log("http server closed....");
  });

  console.log("Static file server running at");
  console.log("  => http://" + OrangeeJSUtil.getip() + (port == 80 ? '' : (":" + port)));
  console.log("CTRL + C to shutdown");
};

module.exports = OrangeeJSServerTask;
