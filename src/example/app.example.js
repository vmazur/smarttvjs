//your script here
'use strict';
var app = new Marionette.Application();

var HeaderModel = Orangee.Model.extend();
var ListItemModel = Orangee.Model.extend();
var ListCollection = Orangee.Collection.extend({
  model: ListItemModel,
});

var HeaderView = Orangee.ItemView.extend({
  template: '#header_template',
  el: '#header_view',
});

var ListItemView = Orangee.ScrollItemView.extend({
  template: '#listitem_template',
  onClick: function() {
    var index = this.model.collection.indexOf(this.model);
    app.videoView.switchVideo(index);
  },
});

var ListView = Orangee.ScrollView.extend({
  el: '#list_view',
  childView: ListItemView,
});

var VideoView =  Orangee.VideoView.extend({
  template: '#video_template',
  el: '#video_view',
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

app.init = function(options){
  orangee.debug_enabled = true;
  Backbone.history.start();

  var name = {name: orangee.PLATFORM};
  var playlist = [
    {url: "https://www.youtube.com/watch?v=2Zj_kxYBu1Y", name: "youtube video"},
    {url: "http://techslides.com/demos/sample-videos/small.mp4", name: "mp4 video"},
    {url: "http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8", name: "m3u8 video"}
  ];
  var video = {divid: 'video_id', playlist: playlist};
  var list = new ListCollection(playlist);

  new HeaderView({model: new HeaderModel(name)}).render();
  app.videoView = new VideoView({collection: list}).render();
  new ListView({collection: list}).render();

  list.selectModel(list.models[0]);
};

