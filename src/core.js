'use strict';

var orangee = {};
var Orangee = {};

orangee.xml2json = function(xml) {
  var x2js = new X2JS();
  return x2js.xml_str2json(xml);
};

orangee.log = function(s) {
  if (orangee.PLATFORM != 'samsung') {
    console.log(s);
  } else {
    alert(s);
  }
}

orangee.debug = function(s) {
  if (orangee.debug_enabled) {
    orangee.log(s);
  }
}
