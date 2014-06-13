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

  if (this.player) {
    this.player.cueVideoById(vid, startSeconds);
  } else {
    this.player = new YT.Player(divid, {
      width: options['width'] || '100%', //viewportwidth will not not consider the size of scroll bar
      height: options['height'] || '100%',
      videoId: vid,
      playerVars: {
        'html5': 1,
        'start': startSeconds,
        'autoplay':  options['autoplay'] || 0,
        'playsinline': options['playsinline'] || 1,
        'controls': options['controls'] || 1,
        'fs': 1,
        'autohide': 0,
        'enablejsapi': 1,
        'iv_load_policy': 3,
        'rel': 0,
        'showinfo': 0,
        'hd': 1
      },
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
          } else if (event.data == YT.PlayerState.PAUSED && options['onend']) {
            options['onend']();
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

