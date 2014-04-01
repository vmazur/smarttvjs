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
  var os=require('os');
  var ifaces=os.networkInterfaces();
  for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
        console.log("  => http://" + details.address + (port == 80 ? '' : (":" + port)));
        ++alias;
      }
    });
  }

  console.log("CTRL + C to shutdown");
};

module.exports = OrangeeJSServerTask;
