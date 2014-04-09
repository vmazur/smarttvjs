var fs = require('fs');
var path = require('path');
var gm = require('gm');

function OrangeeJSIconTask() {
};

OrangeeJSIconTask.prototype.run = function() {
  fs.exists('app/icons/icon.png', function(exists) {
    if (exists) {
      var gm = require('gm');

      [[115, 95], [106,87], [95, 78], [85, 70]].forEach(function(dim) {
        gm('app/icons/icon.png').resize(dim[0], dim[1]).autoOrient().write('app/icons/icon_' + dim[0] + '.png', function(err) {
          console.log(err ? err : 'app/icons/icon_' + dim[0] + '.png');
        });
      });
    } else {
      console.log('app/icons/icon.png not found');
    }
  });
};

module.exports = OrangeeJSIconTask;
