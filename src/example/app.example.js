//your script here
'use strict';
var app = new Marionette.Application();

var HeaderModel = Backbone.Model.extend();
var VideoModel = Backbone.Model.extend();
var ListItemModel = Backbone.Model.extend();
var ListCollection = Backbone.PageableCollection.extend({
  model: ListItemModel,
});

var HeaderView = Marionette.ItemView.extend({
  template: '#header_template',
  el: '#header_view',
});

var ListItemView = Orangee.ScrollItemView.extend({
  template: '#listitem_template',
  onClick: function() {
    orangee.log('clicked');
    console.log(this.model);
    var index = this.model.collection.indexOf(this.model);
    console.log(index);
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
  player: {
    playsinline: 1,
    onplaying: function() {
      orangee.log('playing');
    },
    onpause: function() {
      orangee.log('paused at ' + this.videoplayer.currentTime())
    },
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

  new HeaderView({model: new HeaderModel(name)}).render();
  app.videoView = new VideoView({model: new VideoModel(video)}).render();
  new ListView({collection: new ListCollection(playlist)}).render();
};

