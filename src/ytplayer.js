smarttv.ytplayer = function _SmartTVJSYTPlayer() {
  this.player = null;
  this.support_translate = false;
};

smarttv.ytplayer.prototype.play = function() {
  this.player.playVideo();
};

smarttv.ytplayer.prototype.pause = function() {
  this.player.pauseVideo();
};

smarttv.ytplayer.prototype.stop = function() {
  this.player.stopVideo();
};

smarttv.ytplayer.prototype.currentTime = function() {
   return this.player.getCurrentTime();
};

smarttv.ytplayer.prototype.seek = function(second) {
   return this.player.seekTo(second, true);
};

smarttv.ytplayer.prototype.load = function(url, startSeconds, divid, options) {
  var vid = smarttv._findYoutubeId(url);
  startSeconds = Math.round(startSeconds);// youtube api only takes positive integer

  if (this.player) {
    smarttv.debug("smarttv.ytplayer#load cueVideoById");
    this.player.cueVideoById(vid, startSeconds);
  } else {
    smarttv.debug("smarttv.ytplayer#load new iframe");
    var e = document.createElement("iframe");
    //e.width =  options['width'] || '100%'; //viewportwidth will not not consider the size of scroll bar
    //e.height = options['height'] || '100%';
    e.setAttribute("frameborder", 0);
    e.src = "https://www.youtube.com/embed/" + vid + "?enablejsapi=1&fs=0&autohide=0&iv_load_policy=3&rel=0&showinfo=0&start=" +startSeconds;
    if (typeof(options['playsinline']) != 'undefined') {
      e.src += "&playsinline=" + (options['playsinline'] ? 1 : 0);
    }
    if (typeof(options['autoplay']) != 'undefined') {
      e.src += "&autoplay=" + (options['autoplay'] ? 1 : 0);
    }
    if (typeof(options['controls']) != 'undefined') {
      e.src += "&controls=" + (options['controls'] ? 1 : 0);
    }
    /*
    playerVars: {
        'html5': 1,
        'start': startSeconds,
        'autoplay':  options['autoplay'] || 0,
        'playsinline': options['playsinline'] || 0,
        'controls': options['controls'] || 1,
        'fs': options['fs'] || 0,
        'autohide': 0,
        'enablejsapi': 1,
        'iv_load_policy': 3,
        'rel': 0,
        'showinfo': 0,
        'hd': 1
      },*/

    e.id = divid;
    var div = document.getElementById(divid);
    e.setAttribute("class", div.getAttribute("class"));
    div.parentNode.replaceChild(e, div);

    this.player = new YT.Player(divid, {
      events: {
        /*'onReady': function() {
        },
        'onError': function() {
        },*/
       // does not work on file://
        'onStateChange': function(event) {
          smarttv.debug("onStateChange");
          if (event.data == YT.PlayerState.PLAYING && options['onplaying']) {
            options['onplaying']();
          } else if (event.data == YT.PlayerState.PAUSED && options['onpause']) {
            options['onpause']();
          } else if (event.data == YT.PlayerState.ENDED && options['onend']) {
            options['onend']();
          //} else if (event.data == YT.PlayerState.CUED && options['onready']) {
          //  options['onready']();
          }
          /*
           YT.PlayerState.ENDED
           YT.PlayerState.PLAYING
           YT.PlayerState.PAUSED
           YT.PlayerState.BUFFERING
           YT.PlayerState.CUED
           */
        }
      }
    });
  }
};

smarttv.ytplayer.prototype.disconnect = function() {
};
