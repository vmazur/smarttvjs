//your script here

var app = {
  videoplayer: new orangee.videoplayer()
};

app.init = function() {
  orangee.render_template("#example_target", "#example_template", {name: orangee.PLATFORM});

  var playlist = [
    {url: "https://www.youtube.com/watch?v=2Zj_kxYBu1Y", name: "youtube video"},
    {url: "http://techslides.com/demos/sample-videos/small.mp4", name: "mp4 video"},
    {url: "http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8", name: "m3u8 video"}
  ];
  app.videoplayer.load(playlist, 'player_target', {
    playsinline: 1,
    onplaying: function() {
      console.log('playing');
    },
    onpause: function() {
      console.log('paused at ' + app.videoplayer.currentTime())
    }
  });

  orangee.render_template("#videos_target", "#videos_template", {data: playlist});

  window.onkeydown = app.onkeydown;
};

app.switchVideo = function(index) {
  app.videoplayer.switchVideo(index);
};

app.onkeydown = function(index) {
  switch (event.keyCode) {
    case orangee.KEYS.KEY_RED:
      app.switchVideo(0);
      break;
    case orangee.KEYS.KEY_GREEN:
      app.switchVideo(1);
      break;
    case orangee.KEYS.KEY_YELLOW:
      app.switchVideo(2);
      break;
    case orangee.KEYS.KEY_ENTER:
      app.videoplayer.play();
      break
  }
};
