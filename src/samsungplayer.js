smarttv.samsungplayer = function _SmartTVJSSamsungPlayer() {
  this.video = null;
  this.url = null;
  this.startSeconds = 0;
  this.onpause = null;
  this.currentTime = 0;
  this.support_translate = true;
};

smarttv.samsungplayer.prototype.play = function() {
  if (this.url != null) {
    this.video.ResumePlay(this.url, this.startSeconds);
    this.url = null;
    this.startSeconds = 0;
  } else {
    this.video.Resume();
  }
};

smarttv.samsungplayer.prototype.pause = function() {
  this.video.Pause();
  if (this.onpause) {
    this.onpause();
  }
};

smarttv.samsungplayer.prototype.stop = function() {
  this.video.Stop();
};

smarttv.samsungplayer.prototype.currentTime = function() {
  return this.currentTime;
};

smarttv.samsungplayer.prototype.seek = function(second) {
  this.video.JumpForward(this.currentTime + second);
  //JumpBackward
};

///Users/yong/Downloads/DeviceAPI\ Guide\[V2.10\].pdf
//http://www.samsungdforum.com/Guide/API00005/Player_172.html
smarttv.samsungplayer.prototype.load = function(url, startSeconds, divid, options) {
  //http://djsiw1wjy8vi7.cloudfront.net/[SDK2.5]Documents_Tutorials/Tutorial/HAS%20Tutorial/HAS%20App%20Creation%20Tutorial/HAS%20App%20Creation%20Tutorial[V1.05].pdf
  if (url.match(/\.m3u8$/) && !url.match(/COMPONENT=HLS$/)) {
    url = url + "?|COMPONENT=HLS";
  }

  if (this.video == null) {
    var objects = document.getElementsByTagName('object');
    for (var i =0; i < objects.length; i++) {
      if (objects[i].getAttribute("classid") === 'clsid:SAMSUNG-INFOLINK-PLAYER') {
        this.video = objects[i];
      }
    }

    //var tvmw = document.getElementById('samsungTVMW');
    //tvmw.SetMediaSource();

    //http://stackoverflow.com/questions/22164496/how-to-overlay-another-div-on-the-video
    var rect = document.getElementById(divid).getBoundingClientRect();
    /*if (rect.width > 960) {
      rect.width = 960;
    }
    if (rect.height > 540) {
      rect.height = 540;
    }*/
    rect.width = 960;
    rect.height = 540;
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

    var self = this;
    this.video.OnCurrentPlayTime = function(currentTime) {
      self.currentTime = currentTime/1000;
    };
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

smarttv.samsungplayer.prototype.disconnect = function() {
};
