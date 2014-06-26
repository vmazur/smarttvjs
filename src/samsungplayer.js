orangee.samsungplayer = function _OrangeeJSSamsungPlayer() {
  this.video = null;
};

orangee.samsungplayer.prototype.play = function() {
  this.video.Resume();
};

orangee.samsungplayer.prototype.pause = function() {
  this.video.Pause();
};

orangee.samsungplayer.prototype.stop = function() {
  this.video.Stop();
};

orangee.samsungplayer.prototype.currentTime = function() {
  return this.video.currentTime;
};

orangee.samsungplayer.prototype.seek = function(second) {
  this.video.currentTime = second;
};

orangee.samsungplayer.prototype.load = function(url, startSeconds, divid, options) {
  if (this.video == null) {

    var objects = document.getElementsByTagName('object');
    for (var i =0; i < objects.length; i++) {
      //alert(objects[i].getAttribute("classid"));
      if (objects[i].getAttribute("classid") === 'clsid:SAMSUNG-INFOLINK-PLAYER') {
        this.video = objects[i];
      }
    }

    //var tvmw = document.getElementById('samsungTVMW');
    //tvmw.SetMediaSource();
    
    var rect = document.getElementById(divid).getBoundingClientRect();
    this.video.setAttribute('style', "position:absolute;z-index:99;left:" + rect.left + "px;top:" + rect.top+ "px;width:" + rect.width+ "px;height:" + rect.height + "px");
    //alert(this.video.getAttribute('style'));
    this.video.setAttribute('border', 0);
    this.video.SetDisplayArea(rect.left, rect.top, rect.width, rect.height);
    /*
      this.plugin.OnCurrentPlayTime = 'Player.setCurTime';
          this.plugin.OnStreamInfoReady = 'Player.setTotalTime';
              this.plugin.OnBufferingStart = 'Player.onBufferingStart';
                  this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
                      this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';

    if (options['onplaying']) {
      this.video.addEventListener("playing", options['onplaying']);
    }
    if (options['onpause']) {
      this.video.addEventListener("pause", options['onpause']);
    }
    if (options['onend']) {
      this.video.addEventListener("ended", options['onend']);
    }*/
  }


  this.video.SetInitialBuffer(640*1024);
  this.video.SetPendingBuffer(640*1024); 

  this.video.Play(url);
};


