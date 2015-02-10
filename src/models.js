'use strict';

Orangee.Application = Marionette.Application.extend({
  initialize: function(options) {
    //console.log("Orangee.Application#initialize");
    orangee.init();
    if (options && options['youtube']) {
      orangee._loadYoutubeApi();
    }
    if (options && options['dailymotion']) {
      orangee._loadDailymotionApi();
    }
  },
});

Orangee.Controller = Marionette.Controller.extend({});
Orangee.Router = Backbone.Marionette.AppRouter.extend({});

Orangee.Model = Backbone.Model.extend({
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

Orangee.XMLModel = Orangee.Model.extend({
  fetch: function(options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Model.prototype.fetch.apply(this, arguments);
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

Orangee.XMLCollection = Orangee.Collection.extend({
  fetch: function(options) {
    options = options || {};
    //options.dataType = "html";
    options.dataType = "text";
    return Backbone.Collection.prototype.fetch.apply(this, arguments);
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

Orangee.CSVCollection = Orangee.XMLCollection.extend({
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
          var ytid = orangee._findYoutubeId(obj['_url']);
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


