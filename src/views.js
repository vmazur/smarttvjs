'use strict';

orangee.scroller = IScroll;
orangee.sidemenu = Snap;
orangee.spinner = Spinner;

Marionette.Behaviors.behaviorsLookup = function() {
  return window;
}

OrangeeHotKeysBehavior = Marionette.Behavior.extend({
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

OrangeeScrollerBehavior = Marionette.Behavior.extend({
  onShow: function() {
    orangee.debug("OrangeeScrollerBehavior#onShow");
    orangee.debug(this.view.getOption('scroll'));
    //orangee.debug(this.el.parentNode.parentNode);
    orangee.debug(this.el);
    //http://stackoverflow.com/questions/11924711/how-to-make-iscroll-and-lazy-load-jquery-plugins-work-together
    this.view.scroller = new orangee.scroller(this.el,
                                              _.extend({
                                                onScrollEnd: function () {
                                                  this.el.trigger('scroll');
                                                },
                                              }, this.view.getOption('scroll')));
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

OrangeeNoExtraDivBehavior = Marionette.Behavior.extend({
  //http://stackoverflow.com/questions/14656068/turning-off-div-wrap-for-backbone-marionette-itemview
  onRender: function () {
    orangee.debug("OrangeeNoExtraDivBehavior#onRender");
    // Get rid of that pesky wrapping-div.
    // Assumes 1 child element present in template.
    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely 
    // nesting elements during re-render.
    this.$el.unwrap();
    this.view.setElement(this.$el);
  },
});

Orangee.ItemView = Marionette.ItemView.extend({
  behaviors: {
    OrangeeHotKeysBehavior: {},
    OrangeeNoExtraDivBehavior: {},
  },
  initialize: function(options) {
    orangee.debug("Orangee.ItemView#initialize");
    options = options || {};
    this.collectionView = options.collectionView;
  },
});

Orangee.CompositeView = Marionette.CompositeView.extend({
  behaviors: {
    OrangeeHotKeysBehavior: {},
    OrangeeNoExtraDivBehavior: {},
  },
  childViewOptions: function() {
    return {collectionView: this};
  },
});

Orangee.SpinnerView = Marionette.ItemView.extend({
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
    //orangee.debug('Orangee.ScrollItemView#onMouseOver');
    this.model.collection.selectModel(this.model);
  },
  onSelect: function(model) {
    //orangee.debug('Orangee.ScrollItemView#onSelect');
    this.$(':first-child').addClass('active');
  },
  onDeselect: function(model) {
    //orangee.debug('Orangee.ScrollItemView#onDeselect');
    this.$(':first-child').removeClass('active');
  },
});

Orangee.ScrollView = Orangee.CompositeView.extend({
  behaviors: {
    OrangeeHotKeysBehavior: {},
    OrangeeNoExtraDivBehavior: {},
    OrangeeScrollerBehavior: {},
  },
  childViewContainer: "ul",
  scroll: {
    //click: true,
    mouseWheel: true,
    //keyBindings: true,
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
      this.scroller.refresh();
    }, 0);*/
  },
  onKeyUp: function() {
    orangee.debug('Orangee.ScrollView#onKeyUp');
    this.collection.selectPrev();
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
  },
  onKeyDown: function() {
    orangee.debug('Orangee.ScrollView#onKeyDown');
    this.collection.selectNext();
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
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
      this.scroller.refresh();
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
    orangee.debug(this.children);
    this.collection.selectPrev(this.numberOfColumns);
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
  },
  onKeyDown: function() {
    orangee.debug('Orangee.GridView#onKeyDown');
    orangee.debug(this.children);
    this.collection.selectNext(this.numberOfColumns);
    var selectedChildView = this.children.findByIndex(this.collection.currentPosition);
    this.scroller.scrollToElement(selectedChildView.el);
  },
});

