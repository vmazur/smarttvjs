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
};

orangee.debug = function(s) {
  if (orangee.debug_enabled) {
    orangee.log(s);
  }
};

//https://developers.google.com/youtube/iframe_api_reference
orangee._loadYoutubeApi = function() {
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};
