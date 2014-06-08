orangee.connectplayer = function() {
  this.device = null;
};

orangee.connectplayer.prototype.init = function() {
  ConnectSDK.discoveryManager.startDiscovery();
};

orangee.connectplayer.prototype.showDevicePicker = function (callback) {
  ConnectSDK.discoveryManager.pickDevice().success(function() {
    this.device = device;
    this.device.connect();
  });
};

orangee.connectplayer.prototype.isReady = function() {
  return this.device && this.device.isReady();
};

orangee.connectplayer.prototype.play = function(device) {
  this.device.getMediaControl().play();
};

orangee.connectplayer.prototype.stop = function(device) {
  this.device.getMediaControl().stop();
};

orangee.connectplayer.prototype.pause = function(device) {
  this.device.getMediaControl().pause();
  //this.device.KeyControl().ok();
};

orangee.connectplayer.prototype.currentTime = function() {
  return this.device.getMediaControl.getPosition();
};

orangee.connectplayer.prototype.load = function(url) {
  if (this.device && this.device.isReady()) {
    var ytid = url.indexOf('youtube.com') > -1 ? url.split('watch?v=')[1] : null; 
    if (ytid) {
      this.device.getLauncher().launchYouTube(ytid);
    } else {
      this.device.getMediaPlayer().playMedia(url, "video/mp4");
    }
  }
};

