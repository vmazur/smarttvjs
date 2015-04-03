smarttv.connectplayer = function(device) {
  this.device = device;
  this.launchSession = null;
};

smarttv.connectplayer.init = function() {
  ConnectSDK.discoveryManager.setCapabilityFilters([
    new ConnectSDK.CapabilityFilter(["MediaPlayer.Display.Video", "MediaControl.Pause"]),
    new ConnectSDK.CapabilityFilter(["Launcher.YouTube.Params"])
  ]);
  //ConnectSDK.discoveryManager.setPairingLevel(ConnectSDK.PairingLevel.ON);
  ConnectSDK.discoveryManager.startDiscovery();
};

smarttv.connectplayer.showDevicePicker = function() {
  return ConnectSDK.discoveryManager.pickDevice();
};

smarttv.connectplayer.prototype.isReady = function() {
  return this.device.isReady();
};

smarttv.connectplayer.prototype.play = function(device) {
  this.device.getMediaControl().play();
};

smarttv.connectplayer.prototype.stop = function(device) {
  //this.device.getMediaControl().stop();
  // on lg, have to close youtube app to launch a new one
  if (this.launchSession) {
    this.launchSession.close();
    this.launchSession = null;
  }
  //this.device.getKeyControl().home();
};

smarttv.connectplayer.prototype.pause = function(device) {
  this.device.getMediaControl().pause();
  //this.device.KeyControl().ok();
};

smarttv.connectplayer.prototype.currentTime = function() {
  return this.device.getMediaControl().getPosition();
};

smarttv.connectplayer.prototype.seek = function(second) {
  this.device.getMediaControl().seek(second * 1000);
};

smarttv.connectplayer.prototype.load = function(url, startSeconds, divid, options) {
  var self = this;
  if (this.device && this.device.isReady()) {
    var ytid = url.indexOf('youtube.com') > -1 ? url.split('watch?v=')[1] : null;
    var command;
    if (ytid) {
      command = this.device.getLauncher().launchYouTube(ytid + "&t=" + startSeconds).success(function(launchSession) {
        self.launchSession = launchSession;
      });
    } else {
      command = this.device.getMediaPlayer().playMedia(url, "video/mp4").success(function(launchSession) {
        self.launchSession = launchSession;
      });
    }
    command.success(function() {
      self.device.getMediaControl().subscribePlayState().success(function(state) {
        /*
        "unknown"
        "idle"
        "playing"
        "paused"
        "buffering"
        "finished"
        */
        if (state === 'playing' && options['onplaying']) {
          options['onplaying']();
        } else if (state === 'paused' && options['onpause']) {
          options['onpause']();
        } else if (state === 'finished' && options['onend']) {
          options['onend']();
        }
      });
    }).error(function(e) {
      console.log("Launched failed:" + e.message());
    });
  }
};

