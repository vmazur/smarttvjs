//your script here
var app = new Backbone.Marionette.Application();

var HeaderView = Marionette.ItemView.extend({ 
  template: '#header_template',
  el: '#header_target',
});

var ListView = Orangee.ScrollView.extend({ 
  template: '#videos_template',
  el: '#videos_target',
});

var VideoView =  Orangee.VideoView.extend({
  el: "#player_target",
  template: false,
  player: {
    playsinline: 1,
    onplaying: function() {
      console.log('playing');
    },
    onpause: function() {
      console.log('paused at ' + this.videoplayer.currentTime())
    }
  },
});

app.init = function() {
  orangee.debug_enabled = true;

  var name = new Backbone.Model({name: orangee.PLATFORM});

  var playlist = new Backbone.Collection([
    {url: "https://www.youtube.com/watch?v=2Zj_kxYBu1Y", name: "youtube video"},
    {url: "http://techslides.com/demos/sample-videos/small.mp4", name: "mp4 video"},
    {url: "http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8", name: "m3u8 video"}
  ]);

  new HeaderView({model: name}).render();
  
  new VideoView({collection: playlist}).render();

  new ListView({collection: playlist}).render();

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
