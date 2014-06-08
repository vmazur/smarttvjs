orangee.videoplayer = function() {
  this.device = null;
  this.playlist = [];
  this.currentVideo = 0;
  this.lastPosition = 0;
  this.ytplayer = new orangee.ytplayer();
  this.connectplayer = new orangee.connectplayer();
  this.html5player = new orangee.html5player();
  this.STATUS = {YOUTUBE : 0, HTML5 : 1, CONNECTSDK : 2};
  this.status = null;
  this.div = null;
};

orangee.videoplayer.prototype.init_connectsdk = function() {
  this.connectplayer.init();
};

orangee.videoplayer.prototype.play = function() {
  switch (this.status) {
    case this.STATUS.YOUTUBE:
      this.ytplayer.play();
      break;
    case this.STATUS.HTML5:
      this.html5player.play();
      break;
    case this.STATUS.CONNECTSDK:
      this.connectplayer.play();
      break;
  }
};

orangee.videoplayer.prototype.stop = function() {
  switch (this.status) {
    case this.STATUS.YOUTUBE:
      this.ytplayer.stop();
      break;
    case this.STATUS.HTML5:
      this.html5player.stop();
      break;
    case this.STATUS.CONNECTSDK:
      this.connectplayer.stop();
      break;
  }
};

orangee.videoplayer.prototype.pause = function() {
  switch (this.status) {
    case this.STATUS.YOUTUBE:
      this.ytplayer.pause();
      break;
    case this.STATUS.HTML5:
      this.html5player.pause();
      break;
    case this.STATUS.CONNECTSDK:
      this.connectplayer.pause();
      break;
  }
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
  
  var url = this.playlist[this.currentVideo]['url'];
  if (this.connectplayer.isReady()) {
    this.status = this.STATUS.CONNECTSDK; 
  } else if (url.indexOf('youtube.com') > -1) {
    this.status = this.STATUS.YOUTUBE;
  } else {
    this.status = this.STATUS.HTML5;
  }

  switch (this.status) {
    case this.STATUS.YOUTUBE:
      this.ytplayer.load(url, this.lastPosition, this.divid, this.options);
      break;
    case this.STATUS.HTML5:
      this.html5player.load(url, this.lastPosition, this.divid, this.options);
      break;
    case this.STATUS.CONNECTSDK:
      this.connectplayer.load(url);
      break;
  }
};
