'use strict';

SmartTV.Application = Marionette.Application.extend({
  typeName: "SmartTV.Application",
  initialize: function() {
    smarttv.debug_enabled = this.getOption('debug_enabled');
    smarttv.debug("SmartTV.Application#initialize");
    smarttv.init();
    if (this.getOption('youtube_api')) {
      smarttv._loadYoutubeApi();
    }
    if (this.getOption('dailymotion_api')) {
      smarttv._loadDailymotionApi();
    }
  },
  start: function(options) {
    Marionette.Application.prototype.start.apply(this, arguments);
    Backbone.history.start();
  },
});

SmartTV.Controller = Marionette.Controller.extend({
  typeName: "SmartTV.Controller",
});

SmartTV.Router = Backbone.Marionette.AppRouter.extend({
  typeName: "SmartTV.Router",
});

SmartTV.Model = Backbone.Model.extend({
  typeName: "SmartTV.Model",
  initialize: function() {
    // Applies the mixin:
    Backbone.Select.Me.applyTo(this);
  },
  toJSON: function() {
    //http://stackoverflow.com/questions/15298449/cannot-get-the-cid-of-the-model-while-rendering-a-backbone-collection-over-a-tem
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    return json;
  },
});

SmartTV.XMLModel = SmartTV.Model.extend({
  typeName: "SmartTV.XMLModel",
  fetch: function(options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Model.prototype.fetch.apply(this, arguments);
  },
  parse: function(xml) {
    return smarttv.xml2json(xml);
  },
});

//http://jaketrent.com/post/backbone-inheritance/
SmartTV.Collection = Backbone.PageableCollection.extend({
  typeName: "SmartTV.Collection",
  model: SmartTV.Model,
  initialize: function(models, options) {
    // Applies the mixin:
    Backbone.Select.One.applyTo(this, models, options);
    this.currentPosition = 0;
  },
  selectPrev: function(offset) {
    this.currentPosition -= (offset || 1);
    if (this.currentPosition < 0) {
      //this.currentPosition = 0;
      this.currentPosition += (offset || 1);
      return;
    }
    this.select(this.at(this.currentPosition));
  },
  selectNext: function(offset) {
    this.currentPosition += (offset || 1);
    if (this.currentPosition >= this.length) {
      //this.currentPosition = this.length - 1;
      this.currentPosition -= (offset || 1);
      return;
    }
    this.select(this.at(this.currentPosition));
  },
  selectModel: function(model) {
    this.currentPosition = this.indexOf(model);
    this.select(model);
  },
});

SmartTV.XMLCollection = SmartTV.Collection.extend({
  typeName: "SmartTV.XMLCollection",
  fetch: function(options) {
    options = options || {};
    //options.dataType = "html";
    options.dataType = "text";
    return Backbone.Collection.prototype.fetch.apply(this, arguments);
  },
});

SmartTV.OPMLCollection = SmartTV.XMLCollection.extend({
  typeName: "SmartTV.OPMLCollection",
  parse:function(xml) {
    //smarttv.debug(xml);
    //var response = {data: json.opml.body.outline.map(function(x) {return {name: x._title, standardPic: x._img, url: x._url}})}
    var json = smarttv.xml2json(xml);
    return json.opml.body.outline;
  },
});

SmartTV.RSSItemModel = SmartTV.Model.extend({
  typeName: "SmartTV.RSSItemModel",
  mutators: {
    thumbnail_url: function() {
      var image = this.get("thumbnail");
      if (image) {
        if (_.isArray(image)) {
          image = image[0];
        }
        return image._url;
      } else if (this.collection) {
        return this.collection.thumbnail_url;
      } else {
        return null;
      }
    },
  },
});

SmartTV.RSSCollection = SmartTV.XMLCollection.extend({
  typeName: "SmartTV.RSSCollection",
  model: SmartTV.RSSItemModel,
  parse: function(xml) {
    var json = smarttv.xml2json(xml);
    if (json.rss.channel.image) {
      var image = json.rss.channel.image;
      if (_.isArray(image)) {
        image = image[0];
      }
      this.thumbnail_url = image.url || image._href;
    }
    //return _.filter(json.rss.channel.item, function(x) {return x.enclosure;});
    return json.rss.channel.item;
  },
});

SmartTV.CSVCollection = SmartTV.XMLCollection.extend({
  typeName: "SmartTV.CSVCollection",
  parse:function(csv) {
    var lines=csv.split("\n");
    var result = [];
    for(var i=1;i<lines.length;i++) {
      if (lines[i].length > 0 && lines[i][0] != '#' && lines[i][0] != " ") {
	      var currentline = [];
        if (lines[i].indexOf(',') >= 0) {
          currentline = lines[i].split(",");
        } else {
          currentline = lines[i].split(/[ ]+/);
        }
        var obj = {};
        if (currentline[0].toLowerCase().indexOf('http') == 0) {
          obj['_title'] = null;
          obj['_url'] = currentline[0] ? currentline[0].trim() : null;
          obj['_img'] = currentline[1] ? currentline[1].trim() : null;
        } else {
          obj['_title'] = currentline[0] ? currentline[0].trim() : null;
          obj['_url'] = currentline[1] ? currentline[1].trim() : null;
          obj['_img'] = currentline[2] ? currentline[2].trim() : null;
        }

        if (!obj['_url'] || obj['_url'].trim().length == 0) {
          continue;
        }

        if (!obj['_img']) {
          var ytid = smarttv._findYoutubeId(obj['_url']);
          if (ytid) {
            obj['_img'] = "http://i.ytimg.com/vi/" + ytid + "/mqdefault.jpg";
          }
        }

        result.push(obj);
      }
    }
    return result;
  },
});


