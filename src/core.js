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
  window.onYouTubeIframeAPIReady = function() {
    orangee.debug("onYouTubeIframeAPIReady");
    orangee._youtubeReady = true;
    $(document).trigger("oge-youtubeready");
  };

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

orangee._findYoutubeId = function(urlString) {
  if (window.url('domain', urlString) === "youtube.com") {
    return window.url('?v', urlString);
  } else if (window.url('domain', urlString) === "youtu.be") {
    window.url('file', urlString);
  }

  return null;
};

