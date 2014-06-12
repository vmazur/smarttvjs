orangee.connectplayer = function(device) {
  this.device = device;
};

orangee.connectplayer.init = function() {
  /*
  var videoFilter = new ConnectSDK.CapabilityFilter([
     "MediaPlayer.Display.Video", 
     "MediaControl.Any", 
      "VolumeControl.UpDown" 
  ]);

  var imageFilter = new ConnectSDK.CapabilityFilter([
      "MediaPlayer.Display.Image"
  ]);

  ConnectSDK.discoveryManager.setCapabilityFilters([videoFilter, imageFilter]);
  */
  ConnectSDK.discoveryManager.startDiscovery();
};

orangee.connectplayer.showDevicePicker = function() {
  return ConnectSDK.discoveryManager.pickDevice();
};

orangee.connectplayer.prototype.disconnect = function(){
  return this.device.disconnect();
};

orangee.connectplayer.prototype.isReady = function() {
  return this.device.isReady();
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

orangee.connectplayer.prototype.load = function(url, lastPosition, divid, options) {
  if (this.device && this.device.isReady()) {
    var ytid = url.indexOf('youtube.com') > -1 ? url.split('watch?v=')[1] : null; 
    if (ytid) {
      this.device.getLauncher().launchYouTube(ytid);
    } else {
      this.device.getMediaPlayer().playMedia(url, "video/mp4");
    }
  }
};

