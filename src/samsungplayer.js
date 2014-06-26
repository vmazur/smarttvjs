orangee.samsungplayer = function _OrangeeJSSamsungPlayer() {
  this.video = null;
  this.url = null;
  this.startSeconds = 0;
  this.onpause = null;
};

orangee.samsungplayer.prototype.play = function() {
  if (this.url != null) {
    this.video.ResumePlay(this.url, this.startSeconds);
    this.url = null;
    this.startSeconds = 0;
  } else {
    this.video.Resume();
  }
};

orangee.samsungplayer.prototype.pause = function() {
  this.video.Pause();
  if (this.onpause) {
    this.onpause();
  }
};

orangee.samsungplayer.prototype.stop = function() {
  this.video.Stop();
};

orangee.samsungplayer.prototype.currentTime = function() {
  return this.video.currentTime;
};

orangee.samsungplayer.prototype.seek = function(second) {
  this.video.JumpForward(second);
  //JumpBackward
};

///Users/yong/Downloads/DeviceAPI\ Guide\[V2.10\].pdf
//http://www.samsungdforum.com/Guide/API00005/Player_172.html
orangee.samsungplayer.prototype.load = function(url, startSeconds, divid, options) {
  if (this.video == null) {

    var objects = document.getElementsByTagName('object');
    for (var i =0; i < objects.length; i++) {
      if (objects[i].getAttribute("classid") === 'clsid:SAMSUNG-INFOLINK-PLAYER') {
        this.video = objects[i];
      }
    }

    //var tvmw = document.getElementById('samsungTVMW');
    //tvmw.SetMediaSource();
    
    var rect = document.getElementById(divid).getBoundingClientRect();
    this.video.setAttribute('style', "position:absolute;z-index:99;left:" + 0 + "px;top:" + 0 + "px;width:" + rect.width + "px;height:" + rect.height + "px");
    this.video.SetDisplayArea(0, 0, rect.width, rect.height);
    
    if (options['onplaying']) {
      this.video.OnBufferingComplete = options['onplaying'];
    }
    if (options['onpause']) {
      this.onpause = options['onpause'];
    }
    if (options['onend']) {
      this.video.OnRenderingComplete = options['onend'];
    }
  }

  //it is very strange that video may be hidden if the following is removed, may be we just need some delay
  this.video.SetInitialBuffer(640*1024);
  this.video.SetPendingBuffer(640*1024);

  if ((options['autoplay'] || 0) == 1) {
    this.video.ResumePlay(url, startSeconds);
  } else {
    //this.video.InitPlayer(url);
    this.url = url;
    this.startSeconds = startSeconds;
  }
};

