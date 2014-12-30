orangee.PLATFORM = "samsung";

//http://www.samsungdforum.com/Guide/ref00006/index.html
orangee.init = function(callback) {
  //http://www.samsungdforum.com/Guide/ref00006/TVKeyValue_Object.html
  orangee._samsungKeys =  new Common.API.TVKeyValue();
  orangee.KEYS = {};
  orangee.KEYS[orangee._samsungKeys.KEY_ENTER] = "enter";
  orangee.KEYS[orangee._samsungKeys.KEY_LEFT] = "left";
  orangee.KEYS[orangee._samsungKeys.KEY_RIGHT] = "right";
  orangee.KEYS[orangee._samsungKeys.KEY_UP] = "up";
  orangee.KEYS[orangee._samsungKeys.KEY_DOWN] = "down";
  orangee.KEYS[orangee._samsungKeys.KEY_PLAY] = "play";
  orangee.KEYS[orangee._samsungKeys.KEY_RETURN] = "back";
  orangee.KEYS[orangee._samsungKeys.KEY_EXIT] = "exit";

  orangee._samsungWidgetAPI = new Common.API.Widget();
  orangee._samsungWidgetAPI.sendReadyEvent();
};

window.onShow = function (e) {
  //http://www.samsungdforum.com/SamsungDForum/ForumView/df3455b529adf7c4?forumID=7126e09362131c36
  //http://www.dummies.com/how-to/content/registeringunregistering-remote-control-keys-for-s.html
  var nnaviPlugin = document.getElementById('pluginObjectNNavi');
  nnaviPlugin.SetBannerState(1);

  // Unregister keys for volume OSD.
  var pluginAPI = new Common.API.Plugin();
  pluginAPI.unregistKey(orangee._samsungKeys.KEY_VOL_UP);
  pluginAPI.unregistKey(orangee._samsungKeys.KEY_VOL_DOWN);
  pluginAPI.unregistKey(orangee._samsungKeys.KEY_MUTE);
};
