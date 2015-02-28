orangee.html5player = function _OrangeeJSHTML5Player() {
  this.video = null;
  this.player = null;
  this.inactivityTimeout = null;
  this.support_translate = true;
};

orangee.html5player.prototype.play = function() {
  this.video.play();
};

orangee.html5player.prototype.pause = function() {
  this.video.pause();
};

orangee.html5player.prototype.stop = function() {
  this.video.pause();
  this.video.src="";
};

orangee.html5player.prototype.currentTime = function() {
  return this.video.currentTime;
};

orangee.html5player.prototype.seek = function(second) {
  var seekToTime = this.video.currentTime + second;
  if (seekToTime < 0 || seekToTime > this.video.duration) {
    return;
  }

  this.video.currentTime = seekToTime;

  this.player.userActive(true);
  var self = this;
  if (this.inactivityTimeout) {
    clearTimeout(this.inactivityTimeout);
  }
  this.inactivityTimeout = setTimeout(function(){
    self.player.userActive(false);
  }, 2000);
};

orangee.html5player.prototype.load = function(url, startSeconds, divid, options) {
  orangee.debug(url);
  orangee.debug(options);

  if (orangee.PLATFORM === 'samsung' && url.match(/\.m3u8$/) && !url.match(/COMPONENT=HLS$/)) {
    url = url + "?|COMPONENT=HLS";
  }

  if (this.video == null) {
    this.video = document.createElement("video");
    this.video.id = divid;

    var div = document.getElementById(divid);
    this.video.setAttribute("class", div.getAttribute("class"));
    //this.video.setAttribute("poster", div.getAttribute("poster"));
    div.parentNode.replaceChild(this.video, div);
    this.video.src = url;
    if (options['playsinline']) {
      this.video.setAttribute("webkit-playsinline", "");
    }

    var vjsopt = {
      poster: div.getAttribute("poster") || options['poster'],
      width:  options['width']  || "100%",
      height: options['height'] || "100%",
    };
    var self = this;
    videojs(divid, vjsopt, function(){
      self.player = this;
      orangee.debug("orangee.html5player#ready");
      self._load(url, startSeconds, options);
    });
    //this._load(url, startSeconds, options);
  } else {
    this._load(url, startSeconds, options);
  }
};

orangee.html5player.prototype._load = function(url, startSeconds, options) {
  /*
  //this.video.width = options['width'] || '100%';
  if (options['onplaying']) {
    this.video.addEventListener("playing", options['onplaying']);
  }
  if (options['onpause']) {
    this.video.addEventListener("pause", options['onpause']);
  }
  if (options['onend']) {
    this.video.addEventListener("ended", options['onend']);
  }
  if (options['onerror']) {
    this.video.addEventListener("error", options['onerror'], true);
  }
  if ((options['autoplay'] || 0) == 1) {
    this.video.autoplay = true;
  }

  this.video.controls = true;
  orangee.debug("orangee.html5player.prototype._load " + url);
  this.video.load();
  if (startSeconds > 0) {
    var self = this;
    this.video.addEventListener("canplay",function() { 
      orangee.debug("orangee.html5player#canplay");
      self.video.currentTime = startSeconds;
    });
  }*/

  if (options['onplaying']) {
    this.player.on("playing", options['onplaying']);
  }
  if (options['onpause']) {
    this.player.on("pause", options['onpause']);
  }
  if (options['onend']) {
    this.player.on("ended", options['onend']);
  }
  if (options['onerror']) {
    this.player.on("error", options['onerror'], true);
  }
  if (options['autoplay']) {
    this.player.autoplay(true);
  }
  this.player.controls(true);
  this.player.load();
  if (startSeconds > 0) {
    var self = this;
    this.player.one("canplay",function() {
      orangee.debug("orangee.html5player#canplay");
      self.player.currentTime(startSeconds);
    });
  }
};

orangee.html5player.prototype.disconnect = function() {
  orangee.debug("orangee.html5player.prototype.disconnect");
  if (this.player) {
    this.player.dispose();
  }
};
