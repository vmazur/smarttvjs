orangee.PLATFORM = "samsung";

//http://www.samsungdforum.com/Guide/ref00006/index.html
orangee.init = function(callback) {
  var pluginAPI = new Common.API.Plugin();
  orangee._samsungWidgetAPI = new Common.API.Widget();

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

  orangee._samsungWidgetAPI.sendReadyEvent();
};

