orangee.scroller = IScroll;
orangee.sidemenu = Snap;
orangee.spinner = Spinner;

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
    console.log("Orangee.VideoView#init");
    this.videoplayer = new orangee.videoplayer();
  },
  onRender: function() {
    var self = this;
    console.log("Orangee.VideoView#onRender");
    console.log(this.options['player']||{}),
    var options = _.extend((this.options['player']||{}), {
                            onplaying: function() {
                              console.log("oge:playing");
                              self.trigger("oge:playing");
                            },
                            onpause: function() {
                              console.log("oge:pause");
                              self.trigger("oge:pause");
                            }
                          });
    console.log(options);
    this.videoplayer.load(this.collection.toJSON(), this.el.id, options);
  },
});

Orangee.ScrollView = Backbone.Marionette.ItemView.extend({
  initialize: function(options) {
    this.options = options || {};
    console.log("Orangee.ScrollView#init");
  },
  onRender: function() {
    console.log("Orangee.ScrollView#onRender");
    this.scroll = new orangee.scroller(this.el, this.options);
  },
});


