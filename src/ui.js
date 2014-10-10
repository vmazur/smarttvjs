orangee.Scroller = IScroll;
orangee.Sidemenu = Snap;
orangee.Spinner = Spinner;

Orangee.XMLCollection = Backbone.Collection.extend({
  fetch: function (options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Collection.prototype.fetch.call(this, options);
  },
  parse: function(xml) {
    //var response = {data: json.opml.body.outline.map(function(x) {return {name: x._title, standardPic: x._img, url: x._url}})}
    return Orangee.xml2json(xml);
  }
});

Orangee.RSSCollection = Orangee.XMLCollection.extend();


