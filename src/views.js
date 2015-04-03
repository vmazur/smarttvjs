'use strict';

smarttv.scroller = IScroll;
//smarttv.sidemenu = Snap;
smarttv.spinner = Spinner;

Marionette.Behaviors.behaviorsLookup = function() {
  return window;
}

var SmartTVHotKeysBehavior = Marionette.Behavior.extend({
  typeName: "SmartTVHotKeysBehavior",
  onRender: function() {
    if (this.view.keyEvents) {
      HotKeys.bind(this.view.keyEvents, this.view, this.view.cid);
    }
  },
  onDestroy: function() {
    if (this.view.keyEvents) {
      smarttv.debug("SmartTVHotKeysBehavior#onDestroy");
      HotKeys.unbind(this.view.keyEvents, this.view, this.view.cid);
    }
  },
});

var SmartTVScrollerBehavior = Marionette.Behavior.extend({
  typeName: "SmartTVScrollerBehavior",
  onShow: function() {
    smarttv.debug("SmartTVScrollerBehavior#onShow");
    smarttv.debug(this.view.getOption('options'));
    //smarttv.debug(this.el.parentNode.parentNode);
    //smarttv.debug(this.el);
    this.view.scroller = new smarttv.scroller(this.el, this.view.getOption('options'));
    //http://stackoverflow.com/questions/11924711/how-to-make-iscroll-and-lazy-load-jquery-plugins-work-together
    //http://www.cnblogs.com/MartinLi841538513/articles/3663638.html
    //http://blog.rodneyrehm.de/archives/32-Updating-to-iScroll-5.html
    this.view.scroller.on("scrollEnd", function() {
      this.$el.trigger('scroll');
    }.bind(this));
    if (this.view.collection) {
      this.view.collection.selectModel(this.view.collection.at(this.view.collection.currentPosition));
    }
    //smarttv.debug(this.view);
  },
  onDestroy: function() {
    smarttv.debug("SmartTVScrollerBehavior#onDestroy");
    if (this.view.scroller) {
      this.view.scroller.destroy();
      this.view.scroller = null;
    }
  },
});

var SmartTVLazyloadBehavior = Marionette.Behavior.extend({
  typeName: "SmartTVLazyloadBehavior",
  onShow: function() {
    this.view.$("img.lazy").lazyload({
      effect : "fadeIn",
      threshold : 400,
    });
  },
});

var SmartTVNoExtraDivBehavior = Marionette.Behavior.extend({
  typeName: "SmartTVNoExtraDivBehavior",
  //http://stackoverflow.com/questions/14656068/turning-off-div-wrap-for-backbone-marionette-itemview
  onRender: function () {
    //smarttv.debug("SmartTVNoExtraDivBehavior#onRender");
    // Get rid of that pesky wrapping-div.
    // Assumes 1 child element present in template.
    var children = this.$el.children();
    if (children.length == 0) {
      //template is string (no html tag). Can not remove div in this case.
      return;
    }

    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely 
    // nesting elements during re-render.
    this.$el.unwrap();
    this.view.setElement(this.$el);
  },
});

SmartTV.ItemView = Marionette.ItemView.extend({
  typeName: "SmartTV.ItemView",
  behaviors: {
    SmartTVHotKeysBehavior: {},
    SmartTVNoExtraDivBehavior: {},
  },
  initialize: function(options) {
    //smarttv.debug("SmartTV.ItemView#initialize");
    options = options || {};
    this.collectionView = options.collectionView;
  },
});

SmartTV.CompositeView = Marionette.CompositeView.extend({
  typeName: "SmartTV.CompositeView",
  behaviors: {
    SmartTVHotKeysBehavior: {},
    SmartTVNoExtraDivBehavior: {},
  },
  childViewOptions: function() {
    return {collectionView: this};
  },
});

SmartTV.SpinnerView = Marionette.ItemView.extend({
  typeName: "SmartTV.SpinnerView",
  template: false,
  options: {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#FFF', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  },
  onShow: function() {
    this.spinner = new smarttv.spinner(this.getOption('options')).spin(this.el);
  },
  onDestroy: function() {
    smarttv.debug("SmartTV.SpinnerView#onDestroy");
    this.spinner.stop();
  },
});

SmartTV.VideoView = SmartTV.ItemView.extend({
  typeName: "SmartTV.VideoView",
  onShow: function() {
    smarttv.debug("SmartTV.VideoView#onShow");
    //smarttv.debug(this.getOption('options'));
    this.videoplayer = new smarttv.videoplayer({
      youtube: this.getOption('youtube'),
      dailymotion: this.getOption('dailymotion'),
      translate_url: (typeof(SmartTVJSPlugin) != 'undefined') ? SmartTVJSPlugin : null,
    });
    var onplaying = this.getOption('onPlaying');
    var onpause = this.getOption('onPause');
    var onend = this.getOption('onEnd');
    var onerror = this.getOption('onError');
    var startSeconds = this.getOption('startSeconds');
    this.videoplayer.load(this.collection.toJSON(),
                          this.getOption('divid'),
                          _.extend({
                            onplaying: onplaying ? onplaying.bind(this) : null,
                            onpause: onpause ? onpause.bind(this): null,
                            onend: onend ? onend.bind(this) : null,
                            onerror: onerror ? onerror.bind(this) : null,
                          }, this.getOption('options')),
                          this.collection.currentPosition,
                          startSeconds);
  },
  onDestroy: function() {
    smarttv.debug("SmartTV.VideoView#onDestroy");
    this.videoplayer.disconnect();
  },
  keyEvents: {
    'right': 'onKeyRight',
    'fastforward': 'onKeyRight',
    'left' : 'onKeyLeft',
    'rewind': 'onKeyLeft',
    'play' : 'onKeyPlay',
    'pause' : 'onKeyPause',
    'stop' : 'onKeyPause',
    'enter': 'onEnter',
  },
  onKeyPlay: function() {
    smarttv.debug('SmartTV.VideoView#onKeyPlay');
    this.videoplayer.togglePlay();
  },
  onKeyPause: function() {
    smarttv.debug('SmartTV.VideoView#onKeyPause');
    this.videoplayer.pause();
  },
  onKeyRight: function() {
    smarttv.debug('SmartTV.VideoView#onKeyRight');
    this.videoplayer.seek(60);
  },
  onKeyLeft: function() {
    smarttv.debug('SmartTV.VideoView#onKeyLeft');
    this.videoplayer.seek(-60);
  },
  onEnter: function() {
  },
});

SmartTV.ScrollItemView = SmartTV.ItemView.extend({
  typeName: "SmartTV.ScrollItemView",
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
    smarttv.debug('SmartTV.ScrollItemView#onClick');
  },
  onKeyEnter: function() {
    smarttv.debug('SmartTV.ScrollItemView#onKeyEnter');
    this.onClick();
    var links = this.$('a');
    if (links.length > 0) {
      var firstlink = this.$('a')[0];
      smarttv.debug(firstlink);
      Backbone.history.navigate(firstlink.href.split('#')[1], {trigger: true});
    }
  },
  onMouseOver: function() {
    //smarttv.debug('SmartTV.ScrollItemView#onMouseOver');
    this.model.collection.selectModel(this.model);
  },
  onSelect: function(model) {
    //smarttv.debug('SmartTV.ScrollItemView#onSelect');
    //this.$(':first-child').addClass('active');
    this.$el.addClass('active');
  },
  onDeselect: function(model) {
    //smarttv.debug('SmartTV.ScrollItemView#onDeselect');
    //this.$(':first-child').removeClass('active');
    this.$el.removeClass('active');
  },
});

SmartTV.ScrollView = SmartTV.CompositeView.extend({
  typeName: "SmartTV.ScrollView",
  behaviors: {
    SmartTVHotKeysBehavior: {},
    SmartTVNoExtraDivBehavior: {},
    SmartTVScrollerBehavior: {},
    SmartTVLazyloadBehavior: {},
  },
  childViewContainer: "ul",
  options: {
    mouseWheel: true,
    scrollbars: true,
  },
  numberOfColumns: 1,
  keyEvents: {
    'enter': 'onKeyEnter',
    'up': 'onKeyUp',
    'down' : 'onKeyDown',
    'left' : 'onKeyLeft',
    'right': 'onKeyRight',
  },
  onKeyEnter: function() {
    smarttv.debug('SmartTV.GridView#onKeyEnter');
    this.collection.selected.trigger('oge:keyentered');
  },
  onKeyLeft: function() {
    if (this.numberOfColumns > 1) {
      smarttv.debug('SmartTV.ScrollView#onKeyLeft');
      this.collection.selectPrev();
    }
  },
  onKeyRight: function() {
    if (this.numberOfColumns > 1) {
      smarttv.debug('SmartTV.ScrollView#onKeyRight');
      this.collection.selectNext();
    }
  },
  onKeyUp: function() {
    smarttv.debug('SmartTV.ScrollView#onKeyUp');
    //smarttv.debug(this.children);
    this.collection.selectPrev(this.numberOfColumns);
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
  },
  onKeyDown: function() {
    smarttv.debug('SmartTV.ScrollView#onKeyDown');
    //smarttv.debug(this.children);
    this.collection.selectNext(this.numberOfColumns);
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
  },
  scrollBy: function(x, y) {
    //https://github.com/cubiq/iscroll/issues/670
    var newx = this.scroller.x + x;//TODO check x boundary
    var newy = this.scroller.y + y;
    if (newy > 0) {
      newy = 0;
    } else if (newy < this.scroller.maxScrollY) {
      newy = this.scroller.maxScrollY;
    }
    smarttv.debug('SmartTV.ScrollView#scrollBy:' + newx + "/" + newy);
    this.scroller.scrollTo(x, y);
  },
});

SmartTV.HorizontalScrollView = SmartTV.ScrollView.extend({
  typeName: "SmartTV.HorizontalScrollView",
  options: {
    mouseWheel: true,
    scrollX: true,
    scrollY: false,
  },
});

