//your script here

var app = {
  videoplayer: new orangee.videoplayer()
};

app.init = function() {
  orangee.render_template("#example_target", "#example_template", {name: orangee.PLATFORM});

  var playlist = [
    {url: "https://www.youtube.com/watch?v=2Zj_kxYBu1Y", name: "youtube video"},
    {url: "http://techslides.com/demos/sample-videos/small.mp4", name: "mp4 video"}
  ];
  app.videoplayer.load(playlist, 0, 'player_target', {width: 560, height: 315})

  orangee.render_template("#videos_target", "#videos_template", {data: playlist});
};

app.switchVideo = function(index) {
  app.videoplayer.switchVideo(index);
};
