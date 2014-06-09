orangee.videoplayer = function() {
  this.device = null;
  this.playlist = [];
  this.currentVideo = 0;
  this.lastPosition = 0;
  this.currentplayer = null;
  this.STATUS = {YOUTUBE : 0, HTML5 : 1, CONNECTSDK : 2};
  this.status = null;
  this.div = null;
};

orangee.videoplayer.prototype.play = function() {
  this.currentplayer.play();
};

orangee.videoplayer.prototype.stop = function() {
  this.currentplayer.stop();
};

orangee.videoplayer.prototype.pause = function() {
  this.currentplayer.pause();
};

orangee.videoplayer.prototype.load = function(playlist, currentVideo, divid, options) {
  this.playlist = playlist;
  this.lastPosition = 0;
  this.options = options || {};
  this.divid = divid;

  this.switchVideo(currentVideo);
};

orangee.videoplayer.prototype.switchVideo = function(index) {
  this.currentVideo = index;
 
  var old_status = this.status; 
  var url = this.playlist[this.currentVideo]['url'];
  if (this.device && this.device.isReady()) {
    this.status = this.STATUS.CONNECTSDK; 
  } else if (url.indexOf('youtube.com') > -1) {
    this.status = this.STATUS.YOUTUBE;
  } else {
    this.status = this.STATUS.HTML5;
  }

  if (this.status != old_status) {
    switch (this.status) {
      case this.STATUS.YOUTUBE:
        this.currentplayer = new orangee.ytplayer();
        break;
      case this.STATUS.HTML5:
        this.currentplayer = new orangee.html5player();
        break;
      case this.STATUS.CONNECTSDK:
        this.currentplayer = new orangee.connectplayer(this.device);
        break;
    }
  }

  this.currentplayer.load(url, this.lastPosition, this.divid, this.options);
};

orangee.videoplayer.prototype.init_connectsdk = function() {
  orangee.connectplayer.init();
};

orangee.videoplayer.prototype.showDevicePicker = function(callback) {
  var self = this;
  orangee.connectplayer.showDevicePicker().success(function(device) {
    self.device = device;
    device.connect();
    if (typeof callback === "function") {
      callback(device);
    }
  });
};

orangee.videoplayer.prototype.disconnect = function() {
  this.device.disconnect();
};
