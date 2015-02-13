'use strict';

orangee.scroller = IScroll;
//orangee.sidemenu = Snap;
orangee.spinner = Spinner;

Marionette.Behaviors.behaviorsLookup = function() {
  return window;
}

var OrangeeHotKeysBehavior = Marionette.Behavior.extend({
  typeName: "OrangeeHotKeysBehavior",
  onRender: function() {
    if (this.view.keyEvents) {
      HotKeys.bind(this.view.keyEvents, this.view, this.view.cid);
    }
  },
  onDestroy: function() {
    if (this.view.keyEvents) {
      orangee.debug("OrangeeHotKeysBehavior#onDestroy");
      HotKeys.unbind(this.view.keyEvents, this.view, this.view.cid);
    }
  },
});

var OrangeeScrollerBehavior = Marionette.Behavior.extend({
  typeName: "OrangeeScrollerBehavior",
  onShow: function() {
    orangee.debug("OrangeeScrollerBehavior#onShow");
    orangee.debug(this.view.getOption('scroll'));
    //orangee.debug(this.el.parentNode.parentNode);
    //orangee.debug(this.el);
    this.view.scroller = new orangee.scroller(this.el, this.view.getOption('scroll'));
    //http://stackoverflow.com/questions/11924711/how-to-make-iscroll-and-lazy-load-jquery-plugins-work-together
    //http://www.cnblogs.com/MartinLi841538513/articles/3663638.html
    //http://blog.rodneyrehm.de/archives/32-Updating-to-iScroll-5.html
    this.view.scroller.on("scrollEnd", function() {
      this.$el.trigger('scroll');
    }.bind(this));
    this.view.collection.selectModel(this.view.collection.at(this.view.collection.currentPosition));
    //orangee.debug(this.view);
  },
  onDestroy: function() {
    orangee.debug("OrangeeScrollerBehavior#onDestroy");
    if (this.view.scroller) {
      this.view.scroller.destroy();
      this.view.scroller = null;
    }
  },
});

var OrangeeLazyloadBehavior = Marionette.Behavior.extend({
  typeName: "OrangeeLazyloadBehavior",
  onShow: function() {
    this.view.$("img.lazy").lazyload({
      effect : "fadeIn",
      threshold : 400,
    });
  },
});

var OrangeeNoExtraDivBehavior = Marionette.Behavior.extend({
  typeName: "OrangeeNoExtraDivBehavior",
  //http://stackoverflow.com/questions/14656068/turning-off-div-wrap-for-backbone-marionette-itemview
  onRender: function () {
    //orangee.debug("OrangeeNoExtraDivBehavior#onRender");
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

Orangee.ItemView = Marionette.ItemView.extend({
  typeName: "Orangee.ItemView",
  behaviors: {
    OrangeeHotKeysBehavior: {},
    OrangeeNoExtraDivBehavior: {},
  },
  initialize: function(options) {
    //orangee.debug("Orangee.ItemView#initialize");
    options = options || {};
    this.collectionView = options.collectionView;
  },
});

Orangee.CompositeView = Marionette.CompositeView.extend({
  typeName: "Orangee.CompositeView",
  behaviors: {
    OrangeeHotKeysBehavior: {},
    OrangeeNoExtraDivBehavior: {},
  },
  childViewOptions: function() {
    return {collectionView: this};
  },
});

Orangee.SpinnerView = Marionette.ItemView.extend({
  typeName: "Orangee.SpinnerView",
  template: false,
  opts: {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
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
    this.spinner = new orangee.spinner(this.getOption('opts')).spin(this.el);
  },
  onDestroy: function() {
    this.spinner.stop();
  },
});

Orangee.VideoView = Orangee.ItemView.extend({
  typeName: "Orangee.VideoView",
  onShow: function() {
    orangee.debug("Orangee.VideoView#onShow");
    //orangee.debug(this.getOption('player'));
    this.videoplayer = new orangee.videoplayer({
      youtube: this.getOption('youtube'),
      dailymotion: this.getOption('dailymotion'),
      translate_url: (typeof(OrangeeJSPlugin) != 'undefined') ? OrangeeJSPlugin : null,
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
    'fastforward': 'onKeyRight',
    'left' : 'onKeyLeft',
    'rewind': 'onKeyRight',
    'play' : 'onKeyPlay',
    'pause' : 'onKeyPause',
    'stop' : 'onKeyPause',
  },
  onKeyPlay: function() {
    orangee.debug('Orangee.VideoView#onKeyPlay');
    this.videoplayer.togglePlay();
  },
  onKeyPause: function() {
    orangee.debug('Orangee.VideoView#onKeyPause');
    this.videoplayer.pause();
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
  typeName: "Orangee.ScrollItemView",
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
    this.onClick();
    var links = this.$('a');
    if (links.length > 0) {
      var firstlink = this.$('a')[0];
      orangee.debug(firstlink);
      Backbone.history.navigate(firstlink.href.split('#')[1], {trigger: true});
    }
  },
  onMouseOver: function() {
    //orangee.debug('Orangee.ScrollItemView#onMouseOver');
    this.model.collection.selectModel(this.model);
  },
  onSelect: function(model) {
    //orangee.debug('Orangee.ScrollItemView#onSelect');
    //this.$(':first-child').addClass('active');
    this.$el.addClass('active');
  },
  onDeselect: function(model) {
    //orangee.debug('Orangee.ScrollItemView#onDeselect');
    //this.$(':first-child').removeClass('active');
    this.$el.removeClass('active');
  },
});

Orangee.ScrollView = Orangee.CompositeView.extend({
  typeName: "Orangee.ScrollView",
  behaviors: {
    OrangeeHotKeysBehavior: {},
    OrangeeNoExtraDivBehavior: {},
    OrangeeScrollerBehavior: {},
    OrangeeLazyloadBehavior: {},
  },
  childViewContainer: "ul",
  scroll: {
    //click: true,
    mouseWheel: true,
    scrollbars: true,
    //keyBindings: true,
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
    orangee.debug('Orangee.GridView#onKeyEnter');
    this.collection.selected.trigger('oge:keyentered');
  },
  onKeyLeft: function() {
    if (this.numberOfColumns > 1) {
      orangee.debug('Orangee.ScrollView#onKeyLeft');
      this.collection.selectPrev();
    }
  },
  onKeyRight: function() {
    if (this.numberOfColumns > 1) {
      orangee.debug('Orangee.ScrollView#onKeyRight');
      this.collection.selectNext();
    }
  },
  onKeyUp: function() {
    orangee.debug('Orangee.ScrollView#onKeyUp');
    orangee.debug(this.children);
    this.collection.selectPrev(this.numberOfColumns);
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
  },
  onKeyDown: function() {
    orangee.debug('Orangee.ScrollView#onKeyDown');
    orangee.debug(this.children);
    this.collection.selectNext(this.numberOfColumns);
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
  },
});

Orangee.HorizontalScrollView = Orangee.ScrollView.extend({
  typeName: "Orangee.HorizontalScrollView",
  scroll: {
    mouseWheel: true,
    scrollX: true,
    scrollY: false,
  },
});

