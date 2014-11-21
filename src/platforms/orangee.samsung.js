orangee.PLATFORM = "samsung";

//http://www.samsungdforum.com/Guide/ref00006/index.html
orangee.init = function(callback) {
  this._loadScript(['$MANAGER_WIDGET/Common/API/TVKeyValue.js', '$MANAGER_WIDGET/Common/API/Widget.js'], function() {
    var widgetAPI = new Common.API.Widget();
    widgetAPI.sendReadyEvent();

    //http://www.samsungdforum.com/Guide/ref00006/TVKeyValue_Object.html
    var keys =  new Common.API.TVKeyValue();
    orangee.KEYS = {};
    orangee.KEYS[keys.KEY_ENTER] = "enter";
    orangee.KEYS[keys.KEY_LEFT] = "left";
    orangee.KEYS[keys.KEY_RIGHT] = "right";
    orangee.KEYS[keys.KEY_UP] = "up";
    orangee.KEYS[keys.KEY_DOWN] = "down";
    orangee.KEYS[keys.KEY_PLAY] = "play";
    orangee.KEYS[keys.KEY_RETURN] = "back";

    if (typeof callback === "function") {
    	callback();
    }
  });
};

orangee.close = function() {
  var widgetAPI = new Common.API.Widget();
  widgetAPI.sendExitEvent();
}

orangee._loadScript = function(srcs, callback) {
  var head = document.getElementsByTagName('head')[0];;
  var i = 0;
  srcs.forEach(function(src) {
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.onload = function() {
      i++;
      if (i == srcs.length) {
        callback();
      }
    };
    e.src = src;
    head.appendChild(e);
  });
};
