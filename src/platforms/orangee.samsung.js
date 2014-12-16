orangee.PLATFORM = "samsung";

//http://www.samsungdforum.com/Guide/ref00006/index.html
orangee.init = function(callback) {
  orangee._loadScripts(['$MANAGER_WIDGET/Common/API/TVKeyValue.js', '$MANAGER_WIDGET/Common/API/Widget.js', '$MANAGER_WIDGET/Common/API/Plugin.js'], function() {
    //orangee._loadObject('pluginObjectNNavi', 'clsid:SAMSUNG-INFOLINK-NNAVI', function() {
      var pluginAPI = new Common.API.Plugin();
      var widgetAPI = new Common.API.Widget();

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

      //http://www.samsungdforum.com/SamsungDForum/ForumView/df3455b529adf7c4?forumID=7126e09362131c36
      //http://www.dummies.com/how-to/content/registeringunregistering-remote-control-keys-for-s.html
      var nnaviPlugin = document.getElementById('pluginObjectNNavi');
      nnaviPlugin.SetBannerState(1);
      // Unregister keys for volume OSD.
      pluginAPI.unregistKey(keys.KEY_VOL_UP);
      pluginAPI.unregistKey(keys.KEY_VOL_DOWN);
      pluginAPI.unregistKey(keys.KEY_MUTE);

      widgetAPI.sendReadyEvent();

      if (typeof callback === "function") {
        callback();
      }
    //});
  });
};

orangee.close = function() {
  var widgetAPI = new Common.API.Widget();
  widgetAPI.sendExitEvent();
}

orangee._loadScripts = function(srcs, callback) {
  var head = document.getElementsByTagName('head')[0];
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

orangee._loadObject = function(id, clsid, callback) {
  var objs = document.getElementsByTagName('object');

  /*if (objs) {
    for (var i in objs) {
      if (objs[i] && objs[i].id === id) {
        return objs[i];
      }
    }
  }*/

  orangee.log(clsid);
  var obj = document.createElement('object');
  obj.id = id;
  obj.setAttribute('classid', clsid);
  document.body.appendChild(obj);
  callback();

  return obj;
};
