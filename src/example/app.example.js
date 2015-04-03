//your script here
'use strict';

var HeaderModel = SmartTV.Model.extend();
var ListItemModel = SmartTV.Model.extend();
var ListCollection = SmartTV.Collection.extend({
  model: ListItemModel,
});

var HeaderView = SmartTV.ItemView.extend({
  template: '#header_template',
});

var ListItemView = SmartTV.ScrollItemView.extend({
  template: '#listitem_template',
  onClick: function() {
    var index = this.model.collection.indexOf(this.model);
    app.video.currentView.switchVideo(index);
  },
});

var ListView = SmartTV.ScrollView.extend({
  template: '#list_template',
  childView: ListItemView,
});

var VideoView =  SmartTV.VideoView.extend({
  template: '#video_template',
  options: {
    divid: 'myvideo',
    playsinline: true,
  },
  onPlaying: function() {
    smarttv.log('playing');
  },
  onPause: function() {
    smarttv.log(this);
    smarttv.log('paused at ' + this.videoplayer.currentTime());
  },
  switchVideo: function(index) {
    this.videoplayer.switchVideo(index);
  },
});

var MyRouter = SmartTV.Router.extend({
  appRoutes: {
    "": "index",
  },
});

var MyController = SmartTV.Controller.extend({
  index: function() {
    var name = {
      name: smarttv.PLATFORM, 
      status: smarttv.hasNetwork(),
    };
    var playlist = [
      {url: "http://techslides.com/demos/sample-videos/small.mp4", name: "mp4 video"},
      {url: "http://clips.vorwaerts-gmbh.de/VfE_html5.mp4", name: "mp4 video 2"},
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

var app = new SmartTV.Application({
  options: {
    debug_enabled: true,
    youtube_api: true,
    dailymotion_api: true,
  },
  regions: {
    header: "#header_view",
    list: "#list_view",
    video: "#video_view",
  },
  router: new MyRouter({controller: new MyController()}),
});
