//it is better to wait until onYouTubePlayerAPIReady(playerId)
orangee.ytplayer = function() {
  this.player = null;
  this.options = {};
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
   this.player.getCurrentTime();
};

orangee.ytplayer.prototype.load = function(url, lastPosition, divid, options) {
  var vid = url.split('watch?v=')[1];
  this.options = options;

  if (this.player) {
    this.player.loadVideoById(vid);
  } else {
    this.player = new YT.Player(divid, {
      width: options['width'] || '100%', //viewportwidth will not not consider the size of scroll bar
      height: options['height'] || '100%',
      videoId: vid,
      playerVars: {
        'html5': 1,
        'start': lastPosition,
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
        'onReady': this.onPlayerReady,
        'onStateChange': this.onPlayerStateChange,
        'onError': this.onPlayerError
      }
    });
  }
};

// This function is called when the player changes state
orangee.ytplayer.prototype.onPlayerStateChange = function(event) {
  /*if(event.data == 0) {
    //document.getElementById('logs').innerHTML += currentVideo
    this.Next();
  } else if (event.data == 1 && this.lastPosition !=0) {
    this.player.seekTo(this.lastPosition, true);
    this.lastPosition = 0;
  }*/
  // Can not use this in callback
  if (event.data == YT.PlayerState.PLAYING && this.options['onplaying']) {
    this.options['onplaying']();
  }
};

orangee.ytplayer.prototype.onPlayerReady = function(event) {
  //player.setPlaybackQuality("hd720");
  //player.setVolume(100);
  //player.playVideo(); calling this will cause problem on iphone
  if (this.options && this.options['onready']) {
    this.options['onready']();
  }
};

orangee.ytplayer.prototype.onPlayerError = function(event) {
  if ((event.data == 2 ||
      event.data == 100 ||
      event.data == 101 ||
      event.data == 150) && this.options['onerror']) {
    this.options['onerror']();
  }
};

/*
loadProgress: function(url) {
  var vid = url.split('watch?v=')[1];
  var v = readCookie("youtube_progress_" + "TODO!!!!!");//FIXME
  if (v != null && v != "") {
    a = v.split(":");
    currentVideo = parseInt(a[0]);
    if (this.currentVideo >= this.playlist.length) {
      this.currentVideo = 0; //playlist changed, cookie is invalid
    } else if (a.length > 1) {
      this.lastPosition = parseInt(a[1]);
    }
  }

},*/

