//it is better to wait until onYouTubePlayerAPIReady(playerId)
orangee.ytplayer = function _OrangeeJSYTPlayer() {
  this.player = null;
};

orangee.ytplayer.prototype.play = function() {
  this.player.playVideo();
};

orangee.ytplayer.prototype.pause = function() {
  this.player.pauseVideo();
};

orangee.ytplayer.prototype.stop = function() {
  this.player.stopVideo();
};

orangee.ytplayer.prototype.currentTime = function() {
   return this.player.getCurrentTime();
};

orangee.ytplayer.prototype.seek = function(second) {
   return this.player.seekTo(second, true);
};

orangee.ytplayer.prototype.load = function(url, startSeconds, divid, options) {
  var vid = url.split('watch?v=')[1];
  startSeconds = Math.round(startSeconds);// youtube api only takes positive integer

  if (this.player) {
    this.player.cueVideoById(vid, startSeconds);
  } else {
    var e = document.createElement("iframe");
    //e.width =  options['width'] || '100%'; //viewportwidth will not not consider the size of scroll bar
    //e.height = options['height'] || '100%';
    e.frameborder=0;
    e.src = "https://www.youtube.com/embed/" + vid + "?enablejsapi=1&start=" +startSeconds;
    if (typeof(options['playsinline']) != 'undefined') {
      e.src += "&playsinline=" + options['playsinline'];
    }
    if (typeof(options['autoplay']) != 'undefined') {
      e.src += "&autoplay=" + options['autoplay'];
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
    div.parentNode.replaceChild(e, div);

    this.player = new YT.Player(divid, {
      events: {
        /*'onReady': function() {
        },
        'onError': function() {
        },*/
       // does not work on file://
        'onStateChange': function(event) {
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

