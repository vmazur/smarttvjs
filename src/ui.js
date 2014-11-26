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

Orangee.Model = Backbone.Model.extend({
  initialize: function() {
    // Applies the mixin:
    Backbone.Select.Me.applyTo(this);
  },
});

Orangee.XMLModel = Orangee.Model.extend({
  fetch: function(options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  parse: function(xml) {
    return orangee.xml2json(xml);
  },
});

Orangee.Collection = Backbone.PageableCollection.extend({
  currentPosition: 0,
  initialize: function(models, options) {
    // Applies the mixin:
    Backbone.Select.One.applyTo(this, models, options);
  },
  selectPrev: function(offset) {
    this.currentPosition -= (offset || 1);
    if (this.currentPosition < 0) {
      this.currentPosition = this.length - 1;
    }
    this.select(this.at(this.currentPosition));
  },
  selectNext: function(offset) {
    this.currentPosition += (offset || 1);
    if (this.currentPosition >= this.length) {
      this.currentPosition = 0;
    }
    this.select(this.at(this.currentPosition));
  },
  selectModel: function(model) {
    this.currentPosition = this.indexOf(model);
    this.select(model);
  },
});

Orangee.XMLCollection = Orangee.Collection.extend({
  fetch: function(options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Collection.prototype.fetch.call(this, options);
  },
  parse: function(xml) {
    var json = orangee.xml2json(xml);
    return json.rss.channel.item;
  },
});

Orangee.OPMLCollection = Orangee.XMLCollection.extend({
  parse:function(xml) {
    //orangee.debug(xml);
    //var response = {data: json.opml.body.outline.map(function(x) {return {name: x._title, standardPic: x._img, url: x._url}})}
    var json = orangee.xml2json(xml);
    return json.opml.body.outline;
  },
});

Orangee.RSSCollection = Orangee.XMLCollection.extend();

Orangee.ItemView = Marionette.ItemView.extend({
  behaviors: {
    HotKeysBehavior: {}
  },
});

Orangee.CollectionView = Marionette.CollectionView.extend({
  behaviors: {
    HotKeysBehavior: {}
  },
});

Orangee.VideoView = Orangee.ItemView.extend({
  onRender: function() {
    orangee.debug("Orangee.VideoView#onRender");
    //orangee.debug(this.getOption('player'));
    this.videoplayer = new orangee.videoplayer();
    var onplaying = this.getOption('onPlaying');
    var onpause = this.getOption('onPause');
    var onend = this.getOption('onEnd');
    var startSeconds = this.getOption('startSeconds');
    this.videoplayer.load(this.collection.toJSON(),
                          this.getOption('divid'),
                          _.extend({
                            onplaying: onplaying ? onplaying.bind(this) : onplaying,
                            onpause: onpause ? onpause.bind(this): onpause,
                            onend:  onend ? onend.bind(this) : onend,
                          }, this.getOption('playerVars')),
                          this.collection.currentPosition,
                          startSeconds);
  },
  keyEvents: {
    'right': 'onKeyRight',
    'left' : 'onKeyLeft',
    'play' : 'onKeyPlay',
  },
  onKeyPlay: function() {
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

Orangee.ScrollItemView = Orangee.ItemView.extend({
  events: {
    'click': 'onClick',
    'mouseover': 'onMouseOver',
  },
  modelEvents: {
    'selected': 'onSelect',
    'deselected': 'onDeselect',
    'clicked': 'onClick',
    'oge:keyentered': 'onKeyEnter',
  },
  onClick: function() {
    orangee.debug('Orangee.ScrollItemView#onClick');
  },
  onKeyEnter: function() {
    orangee.debug('Orangee.ScrollItemView#onKeyEnter');
    this.$('a')[0].click();
  },
  onMouseOver: function() {
    orangee.debug('Orangee.ScrollItemView#onMouseOver');
    this.model.collection.selectModel(this.model);
  },
  onSelect: function(model) {
    orangee.debug('Orangee.ScrollItemView#onSelect');
    this.$('li').addClass('active');
  },
  onDeselect: function(model) {
    orangee.debug('Orangee.ScrollItemView#onDeselect');
    this.$('li').removeClass('active');
  },
});

Orangee.ScrollView = Orangee.CollectionView.extend({
  onRender: function() {
    orangee.debug("Orangee.ScrollView#onRender");
    this.collection.selectModel(this.collection.at(this.collection.currentPosition));
    this.scroll = new orangee.scroller(this.el, this.getOption('scroll'));
  },
  keyEvents: {
    'enter': 'onKeyEnter',
    'up': 'onKeyUp',
    'down' : 'onKeyDown',
  },
  onKeyEnter: function() {
    orangee.debug('Orangee.ScrollView#onKeyEnter');
    this.collection.selected.trigger('clicked');
  },
  onKeyUp: function() {
    orangee.debug('Orangee.ScrollView#onKeyUp');
    this.collection.selectPrev();
  },
  onKeyDown: function() {
    orangee.debug('Orangee.ScrollView#onKeyDown');
    this.collection.selectNext();
  },
  //childEvents: {
  //},
});

Orangee.GridView = Orangee.ScrollView.extend({
  numberOfColumns: 4,
  keyEvents: {
    'enter': 'onKeyEnter',
    'up': 'onKeyUp',
    'down' : 'onKeyDown',
    'left' : 'onKeyLeft',
    'right': 'onKeyRight',
  },
  onKeyEnter: function() {
    orangee.debug('Orangee.ScrollView#onKeyEnter');
    this.collection.selected.trigger('oge:keyentered');
  },
  onKeyLeft: function() {
    orangee.debug('Orangee.GridView#onKeyLeft');
    this.collection.selectPrev();
  },
  onKeyRight: function() {
    orangee.debug('Orangee.GridView#onKeyRight');
    this.collection.selectNext();
  },
  onKeyUp: function() {
    orangee.debug('Orangee.GridView#onKeyUp');
    this.collection.selectPrev(this.numberOfColumns);
  },
  onKeyDown: function() {
    orangee.debug('Orangee.GridView#onKeyDown');
    this.collection.selectNext(this.numberOfColumns);
  },
});

