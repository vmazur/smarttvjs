var OrangeeJS = {
  PLATFORM: "samsung"
};

OrangeeJS.init = function() {
  this._loadScript(['$MANAGER_WIDGET/Common/API/TVKeyValue.js', '$MANAGER_WIDGET/Common/API/Widget.js'], function() {
    var widgetAPI = new Common.API.Widget();
    widgetAPI.sendReadyEvent();

    //https://www.samsungdforum.com/Guide/ref00006/common_module_tvkeyvalue_object.html
    this.KEYS =  new Common.API.TVKeyValue();
  });
};

OrangeeJS._loadScript = function(srcs, callback) {
  var head = document.getElementById('head')[0];
  var i = 0;
  scrs.forEach(function(src) {
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.src = src;
    e.onload = function() {
      i++;
      if (i == srcs.length) {
        callback();
      }
    };
    head.appendChild(oScript);
  });
};
