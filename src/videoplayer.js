orangee.videoplayer = function() {
  this.playlist = [];
  this.currentIndex = 0;
  this.currentplayer = null;
  this.connectplayer = null;//this player is special, other players can not coexist
  this.div = null;
};

orangee.videoplayer.prototype.play = function() {
  if (this.connectplayer) {
    this.connectplayer.play();
  } else {
    this.currentplayer.play();
  }
};

orangee.videoplayer.prototype.pause = function() {
  if (this.connectplayer) {
    this.connectplayer.play();
  } else {
    this.currentplayer.pause();
  }
};

orangee.videoplayer.prototype.currentTime = function() {
  if (this.connectplayer) {
    return this.connectplayer.currentTime();
  } else {
    return this.currentplayer.currentTime();
  }
};

orangee.videoplayer.prototype.currentVideo = function() {
  return this.playlist[this.currentIndex];
};

orangee.videoplayer.prototype.load = function(playlist, divid, options, index, startSeconds) {
  this.playlist = playlist;
  this.divid = divid;
  this.options = options || {};
  this.currentIndex = (typeof index !== 'undefined') ? index : 0;
  startSeconds = (typeof startSeconds !== 'undefined') ? startSeconds : 0;

  var url = this.playlist[this.currentIndex]['url'];
  this._buildPlayer(url);

  this.currentplayer.load(url, startSeconds, this.divid, this.options);
};

orangee.videoplayer.prototype.switchVideo = function(index) {
  this.currentIndex = index;
  var startSeconds = 0;
  
  var url = this.playlist[this.currentIndex]['url'];
  this._buildPlayer(url);
  
  if (this.connectplayer) {
    this.connectplayer.load(url, startSeconds, this.divid, this.options);
    //beamed video always play automatically
  } else {
    this.currentplayer.load(url, startSeconds, this.divid, this.options);
    this.currentplayer.play();
  }
};

orangee.videoplayer.prototype._buildPlayer = function(url) {
  if (url.indexOf('youtube.com') > -1) {
    if (null == this.currentplayer || this.currentplayer.constructor.name != orangee.ytplayer.name) {
      this.currentplayer = new orangee.ytplayer();
    }
  } else {
    if (null == this.currentplayer || this.currentplayer.constructor.name != orangee.html5player.name){
      this.currentplayer = new orangee.html5player();
    }
  }
};

orangee.videoplayer.prototype.init_connectsdk = function() {
  orangee.connectplayer.init();
};

orangee.videoplayer.prototype.showDevicePicker = function(callback) {
  var self = this;
  orangee.connectplayer.showDevicePicker().success(function(device) {
    self.connectplayer = new orangee.connectplayer(device);
    device.connect();
    if (typeof callback === "function") {
      callback(this.connectplayer);
    }
  });
};

orangee.videoplayer.prototype.disconnect = function() {
  this.connectplayer.pause();
  this.connectplayer.disconnect();
  this.connectplayer = null;
};
