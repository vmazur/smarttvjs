'use strict';

orangee.scroller = IScroll;
orangee.sidemenu = Snap;
orangee.spinner = Spinner;

Marionette.Behaviors.behaviorsLookup = function() {
  return window;
}

HotKeysBehavior = Marionette.Behavior.extend({
    onRender: function() {
        HotKeys.bind(this.view.keyEvents, this.view, this.view.cid);
    },
    onClose: function() {
        HotKeys.unbind(this.view.keyEvents, this.view, this.view.cid);
    },
});

Orangee.XMLCollection = Backbone.Collection.extend({
  fetch: function (options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Collection.prototype.fetch.call(this, options);
  },
  parse: function(xml) {
    //var response = {data: json.opml.body.outline.map(function(x) {return {name: x._title, standardPic: x._img, url: x._url}})}
    return Orangee.xml2json(xml);
  },
});

Orangee.RSSCollection = Orangee.XMLCollection.extend();

Orangee.VideoView = Marionette.ItemView.extend({
  onRender: function() {
    orangee.debug("Orangee.VideoView#onRender");
    //orangee.debug(this.getOption('player'));
    this.videoplayer = new orangee.videoplayer();
    var onplaying = this.getOption('onPlaying');
    var onpause = this.getOption('onPause');
    var onend = this.getOption('onEnd');
    this.videoplayer.load(this.collection.toJSON(),
                          this.getOption('divid'),
                          _.extend({
                            onplaying: onplaying ? onplaying.bind(this) : onplaying,
                            onpause: onpause ? onpause.bind(this): onpause,
                            onend:  onend ? onend.bind(this) : onend,
                          }, this.getOption('playerVars')));
  },
  behaviors: {
    HotKeysBehavior: {}
  },
  keyEvents: {
    'enter': 'onKeyEnter',
    'right': 'onKeyRight',
    'left' : 'onKeyLeft',
  },
  onKeyEnter: function() {
    orangee.debug('Orangee.VideoView#onKeyEnter');
    this.videoplayer.togglePlay();
  },
  onKeyRight: function() {
    orangee.debug('Orangee.VideoView#onKeyRight');
    this.videoplayer.seek(60);
  },
  onKeyLeft: function() {
    orangee.debug('Orangee.VideoView#onKeyLeft');
    this.videoplayer.seek(-60);
  },
});

Orangee.ScrollItemView = Marionette.ItemView.extend({
  events: {
    'click': 'onClick',
    'mouseover': 'onMouseOver',
  },
  onClick: function() {
    orangee.debug('Orangee.ScrollItemView#onClick');
  },
  onMouseOver: function() {
    this.trigger('oge:hideothers');
    this.$('li').toggleClass('active');
    orangee.debug('Orangee.ScrollItemView#onMouseOver');
  },
});

Orangee.ScrollView = Marionette.CollectionView.extend({
  onRender: function() {
    orangee.debug("Orangee.ScrollView#onRender");
    this.scroll = new orangee.scroller(this.el, this.getOption('scroll'));
  },
  behaviors: {
    HotKeysBehavior: {}
  },
  keyEvents: {
    'enter': 'onKeyEnter',
    'up': 'onKeyUp',
    'down' : 'onKeyDown',
  },
  onKeyEnter: function() {
    orangee.debug('Orangee.ScrollView#onKeyEnter');
  },
  onKeyUp: function() {
    orangee.debug('Orangee.ScrollView#onKeyUp');
    //this.videoplayer.prev();
  },
  onKeyDown: function() {
    orangee.debug('Orangee.ScrollView#onKeyDown');
    //this.videoplayer.next();
  },
  childEvents: {
    'oge:hideothers': 'onHideOthers',
  },
  onHideOthers: function() {
    orangee.debug('Orangee.ScrollView oge:hideothers');
    this.$('li.active').removeClass('active');
  },
});


