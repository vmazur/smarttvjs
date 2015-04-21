smarttv.html5player = function _SmartTVJSHTML5Player() {
  this.video = null;
  this.player = null;
  this.inactivityTimeout = null;
  this.support_translate = true;
  this.native_controls = false;(smarttv.PLATFORM == 'lg');//lg's os will crash with videojs if video is paused
};

smarttv.html5player.prototype.play = function() {
  this.video.play();
};

smarttv.html5player.prototype.pause = function() {
  this.video.pause();
};

smarttv.html5player.prototype.stop = function() {
  this.video.pause();
  this.video.src="";
};

smarttv.html5player.prototype.currentTime = function() {
  return this.video.currentTime;
};

smarttv.html5player.prototype.seek = function(second) {
  var seekToTime = this.video.currentTime + second;
  if (seekToTime < 0 || seekToTime > this.video.duration) {
    return;
  }

  this.video.currentTime = seekToTime;

  if (!this.native_controls) {
    this.player.userActive(true);
    var self = this;
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.inactivityTimeout = setTimeout(function(){
      self.player.userActive(false);
    }, 2000);
  }
};

smarttv.html5player.prototype.load = function(url, startSeconds, divid, options) {
  smarttv.debug(url);
  smarttv.debug(options);
  var ext = smarttv.url('fileext', url);

  if (smarttv.PLATFORM === 'samsung' && ext === "m3u8" && !url.match(/COMPONENT=HLS$/)) {
    if (url.indexOf("?") > 0) {
      url = url + "|COMPONENT=HLS";
    } else {
      url = url + "?|COMPONENT=HLS";
    }
  }

  if (this.video == null) {
    if (ext === 'mp3' || ext === 'm4a') {
      this.video = document.createElement("audio");
    } else {
      this.video = document.createElement("video");
    }
    this.video.id = divid;

    var div = document.getElementById(divid);
    this.video.setAttribute("class", div.getAttribute("class"));
    //this.video.setAttribute("poster", div.getAttribute("poster"));
    div.parentNode.replaceChild(this.video, div);
    this.video.src = url;
    if (options['playsinline']) {
      this.video.setAttribute("webkit-playsinline", "");
    }

    if (this.native_controls) {
      this._load(url, startSeconds, options);
    } else {
      var vjsopt = {
        poster: div.getAttribute("poster") || options['poster'],
        width:  options['width']  || "100%",
        height: options['height'] || "100%",
        children: {
          controlBar: {
            children: {
              muteToggle: false,
              fullscreenToggle: false,
              volumeControl: false,
            },
          },
        },
      };
      var self = this;
      videojs(divid, vjsopt, function(){
        self.player = this;
        smarttv.debug("smarttv.html5player#ready");
        self._load(url, startSeconds, options);
      });
    }
  } else {
    this._load(url, startSeconds, options);
  }
};

smarttv.html5player.prototype._load = function(url, startSeconds, options) {
  if (this.native_controls) {
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
    if (options['autoplay']) {
      this.video.autoplay = true;
    }

    this.video.controls = true;
    smarttv.debug("smarttv.html5player.prototype._load " + url);
    this.video.load();
    if (startSeconds > 0) {
      var self = this;
      this.video.addEventListener("canplay",function() { 
        smarttv.debug("smarttv.html5player#canplay");
        self.video.currentTime = startSeconds;
      });
    }
  } else {
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
        smarttv.debug("smarttv.html5player#canplay");
        self.player.currentTime(startSeconds);
      });
    }
  }
};

smarttv.html5player.prototype.disconnect = function() {
  smarttv.debug("smarttv.html5player.prototype.disconnect");
  if (this.player && !this.native_controls) {
    this.player.dispose();
  }
};
