'use strict';

var smarttv = {};
var SmartTV = {};

smarttv.xml2json = function(xml) {
  var x2js = new X2JS();
  return x2js.xml_str2json(xml);
};

smarttv.log = function(s) {
  if (smarttv.PLATFORM != 'samsung') {
    console.log(s);
  } else {
    alert(s);
  }
};

smarttv.debug = function(s) {
  if (smarttv.debug_enabled) {
    smarttv.log(s);
  }
};

//https://developers.google.com/youtube/iframe_api_reference
smarttv._loadYoutubeApi = function() {
  window.onYouTubeIframeAPIReady = function() {
    smarttv.debug("onYouTubeIframeAPIReady");
    smarttv._youtubeReady = true;
    $(document).trigger("oge-youtubeready");
  };

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

smarttv._loadDailymotionApi = function() {
  window.dmAsyncInit = function() {
    //DM.init({apiKey: 'your app id', status: true, cookie: true});
    smarttv.debug("onYouTubeIframeAPIReady");
    smarttv._dailymotionReady = true;
    $(document).trigger("oge-dailymotionready");
  };
  var e = document.createElement('script'); e.async = true;
  e.src = 'http://api.dmcdn.net/all.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(e, s);
};

smarttv._findYoutubeId = function(urlString) {
  if (window.url('domain', urlString) === "youtube.com") {
    return window.url('?v', urlString);
  } else if (window.url('domain', urlString) === "youtu.be") {
    return window.url('file', urlString);
  }

  return null;
};

smarttv._findDailymotionId = function(urlString) {
  return window.url('file', urlString);
};
