var YoutubePlayer = {

  playlist: [],
  currentVideo: 0,
  lastPosition: 0,
  ytplayer: null,
  video_id: null,

  init: function(playlist, vid) {
    this.playlist = playlist;
    this.video_id = vid;
  },

  createCookie: function(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=" + window.location.pathname;
  },

  readCookie: function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },

  eraseCookie: function(name) {
    createCookie(name,"",1);
  },


  Start: function() {
    this.ytplayer.playVideo();
  },

  Stop: function() {
    this.ytplayer.pauseVideo();
  },

  updateStatus: function() {
    //createCookie("youtube_progress_" + <%= @video.id %>, currentVideo + ":" + ytplayer.getCurrentTime(), 30);
  },

  switchVideo: function(index) {
    if (this.ytplayer) {
      currentVideo = index;
      this.ytplayer.loadVideoById(this.playlist[index][1]);
      document.title = this.playlist[index][0];
    }
  },

  StopVideo: function() {
    this.ytplayer.stopVideo();
  },

  // This function is called when the player changes state
  onPlayerStateChange: function(event) {
    /*if(event.data == 0) {
      //document.getElementById('logs').innerHTML += currentVideo
      this.Next();
    } else if (event.data == 1 && this.lastPosition !=0) {
      this.ytplayer.seekTo(this.lastPosition, true);
      this.lastPosition = 0;
    }*/
    // Can not use this in callback
    if (event.data == 1) {//YT.PlayerState.PLAYING
      app.history.add(YoutubePlayer.video_id);
    }
  },

  onPlayerReady: function(event) {
    //ytplayer.setPlaybackQuality("hd720");
    //ytplayer.setVolume(100);
    //ytplayer.playVideo(); calling this will cause problem on iphone
  },

  onPlayerError: function(event) {
    if (event.data == 2 ||
        event.data == 100 ||
        event.data == 101 ||
        event.data == 150) {
      //$.ajax("http://netstartvapi.herokuapp.com/exceptions/<%= @video.id %>?position="+currentVideo+"&vid="+playlist[currentVideo][1]);
    }
  },

  loadProgress: function(url) {
    var vid = url.split('watch?v=')[1];
    var v = readCookie("youtube_progress_" + "TODO!!!!!");//FIXME
    if (v != null && v != "") {
      a = v.split(":");
      currentVideo = parseInt(a[0]);
      if (this.currentVideo >= this.playlist.length) {
        this.currentVideo = 0; //playlist changed, cookie is invalid
      } else if (a.length > 1) {
        this.lastPosition = parseInt(a[1]);
      }
    }

  },

  // This function is automatically called by the player once it loads
  //function onYouTubePlayerAPIReady(playerId) {
  loadVideo: function(divid) {
    if (this.ytplayer) {
      this.ytplayer.loadVideoById(this.playlist[this.currentVideo][1]);
    } else {
      this.ytplayer = new YT.Player(divid, {
        width: '100%', //viewportwidth will not not consider the size of scroll bar
        height: Math.floor(screen.width * 9 / 16),
        videoId: this.playlist[this.currentVideo][1],
        playerVars: {
          'html5': 1,
          'start': this.lastPosition,
          'autoplay': 1,
          'controls': 1,
          'fs': 1,
          'autohide': 0,
          'enablejsapi': 1,
          'iv_load_policy': 3,
          'rel': 0,
          'showinfo': 0,
          'hd': 1
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange,
          'onError': this.onPlayerError
        }
      });
    }
  }
}

