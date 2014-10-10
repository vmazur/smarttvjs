var orangee = {};
var Orangee = {};

orangee.xml2json = function(xml) {
  var x2js = new X2JS();
  return x2js.xml_str2json(xml);
};
