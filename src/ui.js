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
    }
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

Orangee.VideoView = Backbone.Marionette.ItemView.extend({
  initialize: function(options) {
    this.options = options || {};
    orangee.debug("Orangee.VideoView#init");
    this.videoplayer = new orangee.videoplayer();
  },
  onRender: function() {
    var self = this;
    orangee.debug("Orangee.VideoView#onRender");
    this.videoplayer.load(this.collection.toJSON(), this.el.id, this.options['player']);
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
    orangee.debug('enter was pressed!');
    this.videoplayer.togglePlay();
  },
  onKeyRight: function() {
    orangee.debug('right was pressed!');
    this.videoplayer.seek(60);
  },
  onKeyLeft: function() {
    orangee.debug('right was pressed!');
    this.videoplayer.seek(-60);
  }
});

Orangee.ScrollView = Backbone.Marionette.ItemView.extend({
  initialize: function(options) {
    this.options = options || {};
    orangee.debug("Orangee.ScrollView#init");
  },
  onRender: function() {
    orangee.debug("Orangee.ScrollView#onRender");
    this.scroll = new orangee.scroller(this.el, this.options);
  },
});


