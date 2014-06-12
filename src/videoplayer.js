orangee.videoplayer = function() {
  this.playlist = [];
  this.currentVideo = 0;
  this.lastPosition = 0;
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

orangee.videoplayer.prototype.load = function(playlist, currentVideo, divid, options) {
  this.playlist = playlist;
  this.lastPosition = 0;
  this.options = options || {};
  this.divid = divid;

  this.switchVideo(currentVideo, true);
};

orangee.videoplayer.prototype.switchVideo = function(index, called_from_load) {
  called_from_load = (typeof called_from_load !== 'undefined') ? called_from_load : false;
  this.currentVideo = index;

  var url = this.playlist[this.currentVideo]['url'];
  if (url.indexOf('youtube.com') > -1 && 
      (null == this.currentplayer || this.currentplayer.constructor.name != orangee.ytplayer.name)) {
    this.currentplayer = new orangee.ytplayer();
  } else if (null == this.currentplayer || this.currentplayer.constructor.name != orangee.html5player.name){
    this.currentplayer = new orangee.html5player();
  }

  this.currentplayer.load(url, this.lastPosition, this.divid, this.options);
  if (!called_from_load && this.connectplayer) {
    this.connectplayer.load(url, this.lastPosition, this.divid, this.options);
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
  this.connectplayer.disconnect();
  this.connectplayer = null;
};
