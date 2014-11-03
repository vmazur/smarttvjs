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

Orangee.Collection = Backbone.PageableCollection.extend({
  currentSelection: 0,
  initialize: function(models, options) {
    // Applies the mixin:
    Backbone.Select.One.applyTo(this, models, options);
  },
  selectPrev: function() {
    this.currentSelection--;
    if (this.currentSelection >= this.length) {
      this.currentSelection = this.length - 1;
    }
    this.select(this.at(this.currentSelection));
  },
  selectNext: function() {
    this.currentSelection++;
    if (this.currentSelection >= this.length) {
      this.currentSelection = 0;
    }
    this.select(this.at(this.currentSelection));
  },
});

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

Orangee.XMLCollection = Orangee.Collection.extend({
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

Orangee.VideoView = Orangee.ItemView.extend({
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
  },
  onClick: function() {
    orangee.debug('Orangee.ScrollItemView#onClick');
  },
  onMouseOver: function() {
    orangee.debug('Orangee.ScrollItemView#onMouseOver');
    console.log(this);
    this.model.select();
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


