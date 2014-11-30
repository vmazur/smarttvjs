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

//http://jaketrent.com/post/backbone-inheritance/
Orangee.Collection = Backbone.PageableCollection.extend({
  initialize: function(models, options) {
    // Applies the mixin:
    Backbone.Select.One.applyTo(this, models, options);
    this.currentPosition = 0;
  },
  selectPrev: function(offset) {
    this.currentPosition -= (offset || 1);
    if (this.currentPosition < 0) {
      this.currentPosition = 0;
    }
    this.select(this.at(this.currentPosition));
  },
  selectNext: function(offset) {
    this.currentPosition += (offset || 1);
    if (this.currentPosition >= this.length) {
      this.currentPosition = this.length - 1;
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
  initialize: function(options) {
    orangee.debug("Orangee.ItemView#initialize");
    options = options || {};
    this.collectionView = options.collectionView;
  },
});

Orangee.CollectionView = Marionette.CollectionView.extend({
  behaviors: {
    HotKeysBehavior: {}
  },
  childViewOptions: function() {
    return {collectionView: this};
  },
});

Orangee.VideoView = Orangee.ItemView.extend({
  onShow: function() {
    orangee.debug("Orangee.VideoView#onShow");
    //orangee.debug(this.getOption('player'));
    this.videoplayer = new orangee.videoplayer({
      youtube: (orangee.PLATFORM === 'samsung') ? 0 : 1,
      translate_url: (typeof(OrangeeTVPlugin) != 'undefined') ? OrangeeTVPlugin : null,
    });
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
  tagName: "li",
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
    var firstlink = this.$('a')[0];
    orangee.debug(firstlink);
    this.onClick();
    Backbone.history.navigate(firstlink.href.split('#')[1], {trigger: true});
  },
  onMouseOver: function() {
    orangee.debug('Orangee.ScrollItemView#onMouseOver');
    this.model.collection.selectModel(this.model);
  },
  onSelect: function(model) {
    orangee.debug('Orangee.ScrollItemView#onSelect');
    console.log(this);
    this.collectionView.scroll.scrollToElement(this.el);
    this.$el.addClass('active');
  },
  onDeselect: function(model) {
    orangee.debug('Orangee.ScrollItemView#onDeselect');
    this.$el.removeClass('active');
  },
});

Orangee.ScrollView = Orangee.CollectionView.extend({
  tagName: "ul",
  onShow: function() {
    orangee.debug("Orangee.ScrollView#onShow");
    orangee.debug(this.getOption('scroll'));
    orangee.debug(this.el.parentNode.parentNode);
    this.scroll = new orangee.scroller(this.el.parentNode.parentNode, this.getOption('scroll'));
    this.collection.selectModel(this.collection.at(this.collection.currentPosition));
  },
  onDestroy: function() {
    if (this.scroll) {
      this.scroll.destroy();
      this.scroll = null;
    }
  },
  keyEvents: {
    'enter': 'onKeyEnter',
    'up': 'onKeyUp',
    'down' : 'onKeyDown',
  },
  onKeyEnter: function() {
    orangee.debug('Orangee.ScrollView#onKeyEnter');
    this.collection.selected.trigger('oge:keyentered');
    /*setTimeout(function () {
      this.scroll.refresh();
    }, 0);*/
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
    orangee.debug('Orangee.GridView#onKeyEnter');
    this.collection.selected.trigger('oge:keyentered');
    /*setTimeout(function () {
      this.scroll.refresh();
    }, 0);*/
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

