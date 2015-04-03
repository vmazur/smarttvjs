smarttv.dmplayer = function _SmartTVJSDMplayer() {
  this.player = null;
  this.support_translate = false;
};

smarttv.dmplayer.prototype.play = function() {
  this.player.play();
};

smarttv.dmplayer.prototype.pause = function() {
  this.player.pause();
};

smarttv.dmplayer.prototype.stop = function() {
  this.player.pause();
};

smarttv.dmplayer.prototype.currentTime = function() {
   return this.player.currentTime;
};

smarttv.dmplayer.prototype.seek = function(second) {
   return this.player.seek(second);
};

smarttv.dmplayer.prototype.load = function(url, startSeconds, divid, options) {
  var vid = smarttv._findDailymotionId(url);
  startSeconds = Math.round(startSeconds);

  if (this.player) {
    smarttv.debug("smarttv.dmplayer#load");
    this.player.load(vid);
  } else {
    smarttv.debug("smarttv.dmplayer#load new iframe");

    var div = document.getElementById(divid);

    this.player = new DM.player(div, {video: vid, params: {autoplay: (options['autoplay'] || 0)}});

    if (options['onplaying']) {
      this.player.addEventListener("playing", options['onplaying']);
    }
    if (options['onpause']) {
      this.player.addEventListener("pause", options['onpause']);
    }
    if (options['onend']) {
      this.player.addEventListener("ended", options['onend']);
    }
  }

  var self = this;
  this.player.addEventListener("canplay",function() { 
    self.player.currentTime = startSeconds;
  });
};

smarttv.dmplayer.prototype.disconnect = function() {
};
