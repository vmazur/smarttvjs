//your script here
'use strict';
var app = new Orangee.Application({youtube: true, dailymotion: true});

var HeaderModel = Orangee.Model.extend();
var ListItemModel = Orangee.Model.extend();
var ListCollection = Orangee.Collection.extend({
  model: ListItemModel,
});

var HeaderView = Orangee.ItemView.extend({
  template: '#header_template',
});

var ListItemView = Orangee.ScrollItemView.extend({
  template: '#listitem_template',
  onClick: function() {
    var index = this.model.collection.indexOf(this.model);
    app.video.currentView.switchVideo(index);
  },
});

var ListView = Orangee.ScrollView.extend({
  template: '#list_template',
  childView: ListItemView,
});

var VideoView =  Orangee.VideoView.extend({
  template: '#video_template',
  divid: 'myvideo',
  playerVars: {
    playsinline: 1
  },
  onPlaying: function() {
    orangee.log('playing');
  },
  onPause: function() {
    orangee.log(this);
    orangee.log('paused at ' + this.videoplayer.currentTime());
  },
  switchVideo: function(index) {
    this.videoplayer.switchVideo(index);
  },
});

app.addRegions({
  header: "#header_view",
  list: "#list_view",
  video: "#video_view",
});

var MyController = Orangee.Controller.extend({
  index: function() {
    var name = {
      name: orangee.PLATFORM, 
      status: orangee.hasNetwork(),
    };
    var playlist = [
      {url: "http://techslides.com/demos/sample-videos/small.mp4", name: "mp4 video"},
      {url: "https://www.youtube.com/watch?v=2Zj_kxYBu1Y", name: "youtube video"},
      {url: "http://www.dailymotion.com/video/x1dnbxj", name: "dailymotion video"},
      {url: "http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8", name: "m3u8 video"},
    ];

    var list = new ListCollection(playlist);
    var header = new HeaderModel(name);

    app.header.show(new HeaderView({model: header}));
    app.list.show(new ListView({collection: list}));
    app.video.show(new VideoView({collection: list}));
  },
});

var MyRouter = Orangee.Router.extend({
  appRoutes: {
    "": "index",
  },
});

app.on("before:start", function(options) {
  orangee.debug_enabled = true;
});

app.on("start", function(options){
  new MyRouter({controller: new MyController()});
  Backbone.history.start();
});

