orangee.dmplayer = function _OrangeeJSDMplayer() {
  this.player = null;
  this.support_translate = false;
};

orangee.dmplayer.prototype.play = function() {
  this.player.play();
};

orangee.dmplayer.prototype.pause = function() {
  this.player.pause();
};

orangee.dmplayer.prototype.stop = function() {
  this.player.pause();
};

orangee.dmplayer.prototype.currentTime = function() {
   return this.player.currentTime;
};

orangee.dmplayer.prototype.seek = function(second) {
   return this.player.seek(second);
};

orangee.dmplayer.prototype.load = function(url, startSeconds, divid, options) {
  var vid = orangee._findDailymotionId(url);
  startSeconds = Math.round(startSeconds);

  if (this.player) {
    orangee.debug("orangee.dmplayer#load");
    this.player.load(vid);
  } else {
    orangee.debug("orangee.dmplayer#load new iframe");

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

orangee.dmplayer.prototype.disconnect = function() {
};
