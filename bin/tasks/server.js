var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

function OrangeeJSServerTask() {
};

OrangeeJSServerTask.prototype.run = function(port) {
  http.createServer(function(request, response) {
   
    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd(), uri);
    
    path.exists(filename, function(exists) {
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
  }).listen(parseInt(port, 10));

  console.log("Static file server running at");
  console.log("  => http://" + this._getip() + (port == 80 ? '' : (":" + port)));
  console.log("CTRL + C to shutdown");
};

OrangeeJSServerTask.prototype._getip = function() {
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

module.exports = OrangeeJSServerTask;
