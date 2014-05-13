var OrangeeJS = {
  PLATFORM: "samsung"
};

OrangeeJS.init = function(callback) {
  this._loadScript(['$MANAGER_WIDGET/Common/API/TVKeyValue.js', '$MANAGER_WIDGET/Common/API/Widget.js'], function() {
    var widgetAPI = new Common.API.Widget();
    widgetAPI.sendReadyEvent();

    //https://www.samsungdforum.com/Guide/ref00006/common_module_tvkeyvalue_object.html
    OrangeeJS.KEYS =  new Common.API.TVKeyValue();

    if (typeof callback === "function") {
    	callback();
    }
  });
};

OrangeeJS.close = function() {
  var widgetAPI = new Common.API.Widget();
  widgetAPI.sendExitEvent();
}

OrangeeJS._loadScript = function(srcs, callback) {
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
