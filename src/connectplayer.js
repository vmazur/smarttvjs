orangee.connectplayer = function(device) {
  this.device = device;
  this.launchSession = null;
};

orangee.connectplayer.init = function() {
  ConnectSDK.discoveryManager.setCapabilityFilters([
    new ConnectSDK.CapabilityFilter(["MediaPlayer.Display.Video", "MediaControl.Pause"]),
    new ConnectSDK.CapabilityFilter(["Launcher.YouTube.Params"])
  ]);
  ConnectSDK.discoveryManager.setPairingLevel(ConnectSDK.PairingLevel.ON);
  ConnectSDK.discoveryManager.startDiscovery();
};

orangee.connectplayer.showDevicePicker = function() {
  return ConnectSDK.discoveryManager.pickDevice();
};

orangee.connectplayer.prototype.isReady = function() {
  return this.device.isReady();
};

orangee.connectplayer.prototype.play = function(device) {
  this.device.getMediaControl().play();
};

orangee.connectplayer.prototype.stop = function(device) {
  //this.device.getMediaControl().stop();
  if (this.launchSession) {
    this.launchSession.close();
    this.launchSession = null;
  }
};

orangee.connectplayer.prototype.pause = function(device) {
  this.device.getMediaControl().pause();
  //this.device.KeyControl().ok();
};

orangee.connectplayer.prototype.currentTime = function() {
  return this.device.getMediaControl().getPosition();
};

orangee.connectplayer.prototype.seek = function(second) {
  this.device.getMediaControl().seek(second * 1000);
};

orangee.connectplayer.prototype.load = function(url, lastPosition, divid, options) {
  var self = this;
  if (this.device && this.device.isReady()) {
    var ytid = url.indexOf('youtube.com') > -1 ? url.split('watch?v=')[1] : null;
    var command;
    if (ytid) {
      command = this.device.getLauncher().launchYouTube(ytid).success(function(launchSession) {
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
      console.log("Launched failed:" + e);
    });
  }
};

