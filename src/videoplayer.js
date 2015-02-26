orangee.videoplayer = function(options) {
  this.playlist = [];
  this.currentIndex = 0;
  this.currentplayer = null;
  this.connectplayer = null;//this player is special, other players can not coexist
  this.div = null;
  this.device = null;
  options = options || {};
  this.support_youtube = (typeof(options['youtube']) != 'undefined') ? options['youtube'] : true;
  this.support_dailymotion = (typeof(options['dailymotion']) != 'undefined') ? options['dailymotion'] : true;
  this.support_samsung = (typeof(options['samsung']) != 'undefined') ? options['samsung'] : false;
  this.translate_url = options['translate_url'];
  this.playing = false;
};

orangee.videoplayer.prototype.play = function() {
  if (this.connectplayer) {
    var url = this.playlist[this.currentIndex]['url'];
    this.connectplayer.load(url, 0, this.divid, this.options);
  } else if (this.device) {
    this.connectplayer = new orangee.connectplayer(this.device);
    var url = this.playlist[this.currentIndex]['url'];
    this.connectplayer.load(url, 0, this.divid, this.options);
  } else {
    this.currentplayer.play();
  }
  this.playing = true;
  orangee.disableScreenSaver();
};

orangee.videoplayer.prototype.togglePlay = function() {
  if (this.playing) {
    this.pause();
  } else {
    this.play();
  }
};

orangee.videoplayer.prototype.pause = function() {
  if (this.connectplayer) {
    this.connectplayer.pause();
  } else {
    this.currentplayer.pause();
  }
  this.playing = false;
  orangee.enableScreenSaver();
};

orangee.videoplayer.prototype.stop = function() {
  if (this.connectplayer) {
    this.connectplayer.stop();
  } else {
    this.currentplayer.stop();
  }
  this.playing = false;
  orangee.enableScreenSaver();
};

orangee.videoplayer.prototype.currentTime = function() {
  if (this.connectplayer) {
    return this.connectplayer.currentTime();
  } else {
    return this.currentplayer.currentTime();
  }
};

orangee.videoplayer.prototype.seek = function(second) {
  if (this.connectplayer) {
    return this.connectplayer.seek(second);
  } else {
    return this.currentplayer.seek(second);
  }
};

orangee.videoplayer.prototype.currentVideo = function() {
  return this.playlist[this.currentIndex];
};

orangee.videoplayer.prototype.next = function() {
  currentIndex++;
  if (currentIndex >= this.playlist.length) {
    currentIndex = this.playlist.length - 1;
  }
  this.switchVideo(currentIndex);
};

orangee.videoplayer.prototype.prev = function() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = 0;
  }
  this.switchVideo(currentIndex);
};

orangee.videoplayer.prototype.load = function(playlist, divid, options, index, startSeconds) {
  this.playlist = playlist;
  this.divid = divid;
  this.options = options || {};
  this.currentIndex = (typeof index !== 'undefined') ? index : 0;
  startSeconds = (typeof startSeconds !== 'undefined') ? startSeconds : 0;

  var url = this.playlist[this.currentIndex]['url'];
  this._buildPlayer(url, function() {
    if (this.currentplayer.support_translate && this.translate_url) {
      var self= this;
      this.translate_url(url, function(err, new_url) {
        self.currentplayer.load(new_url, startSeconds, self.divid, self.options);
      });
    } else {
      this.currentplayer.load(url, startSeconds, this.divid, this.options);
    }
  }.bind(this));
};

orangee.videoplayer.prototype.switchVideo = function(index) {
  this.currentIndex = index;
  var startSeconds = 0;

  var url = this.playlist[this.currentIndex]['url'];
  this._buildPlayer(url, function() {
    if (this.device) {
      if (!this.connectplayer) {
        this.connectplayer = new orangee.connectplayer(this.device);
      }
      this.connectplayer.load(url, startSeconds, this.divid, this.options);
      //beamed video always play automatically
    } else {
      if (this.currentplayer.support_translate && this.translate_url) {
        var self= this;
        this.translate_url(url, function(err, new_url) {
          self.currentplayer.load(new_url, startSeconds, self.divid, self.options);
        });
      } else {
        this.currentplayer.load(url, startSeconds, this.divid, this.options);
      }
    }
  }.bind(this));
};

orangee.videoplayer.prototype._buildPlayer = function(url, callback) {
  if (orangee.PLATFORM === 'samsung' && this.support_samsung) {
    if (null == this.currentplayer || this.currentplayer.constructor.name != orangee.samsungplayer.name) {
      this.currentplayer = new orangee.samsungplayer();
      callback();
    }
  } else if (this.support_youtube && (url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1)) {
    if (null == this.currentplayer || this.currentplayer.constructor.name != orangee.ytplayer.name) {
      if (orangee._youtubeReady) {
        this.currentplayer = new orangee.ytplayer();
        callback();
      } else {
        $(document).on('oge-youtubeready', function() {
          orangee.debug('oge-youtubeready');
          this.currentplayer = new orangee.ytplayer();
          callback();
        }.bind(this));
      }
    }
  } else if (this.support_dailymotion && url.indexOf('dailymotion.com') > -1) {
    if (null == this.currentplayer || this.currentplayer.constructor.name != orangee.dmplayer.name) {
      if (orangee._dailymotionReady) {
        this.currentplayer = new orangee.dmplayer();
        callback();
      } else {
        $(document).on('oge-dailymotionready', function() {
          orangee.debug('oge-dailymotionready');
          this.currentplayer = new orangee.dmplayer();
          callback();
        }.bind(this));
      }
    }
  } else {
    if (null == this.currentplayer || this.currentplayer.constructor.name != orangee.html5player.name){
      this.currentplayer = new orangee.html5player();
    }
    callback();
  }
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
  if (this.connectplayer) {
    this.connectplayer = null;
  }
  if (this.device) {
    this.device.disconnect();
    this.device = null;
  }
  if (this.currentplayer) {
    this.currentplayer.disconnect();
    this.currentplayer = null;
  }
};
