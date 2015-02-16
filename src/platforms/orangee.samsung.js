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
  orangee.KEYS[orangee._samsungKeys.KEY_PAUSE] = "pause";
  orangee.KEYS[orangee._samsungKeys.KEY_STOP] = "stop";
  orangee.KEYS[orangee._samsungKeys.KEY_RW] = "rewind";
  orangee.KEYS[orangee._samsungKeys.KEY_FF] = "fastforward";
  orangee.KEYS[orangee._samsungKeys.KEY_RETURN] = "back";
  orangee.KEYS[orangee._samsungKeys.KEY_EXIT] = "exit";

  orangee._samsungWidgetAPI = new Common.API.Widget();
  orangee._samsungWidgetAPI.sendReadyEvent();
};

orangee.exit = function() {
  orangee._samsungWidgetAPI.sendReturnEvent();
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

orangee.hasNetwork = function() {
  var networkPlugin = document.getElementById('pluginObjectNetwork');
  var connType = networkPlugin.GetActiveType();
  var phyConn = networkPlugin.CheckPhysicalConnection(connType);
  var httpStatus = networkPlugin.CheckHTTP(connType);
  if (phyConn != 1 || httpStatus != 1) {
    return false;
  } else {
     return true;
  }
};

orangee.disableScreenSaver = function() {
  //http://www.samsungdforum.com/Guide/index.html?FolderName=tec00115&FileName=index.html
  sf.service.setScreenSaver(false);
};

orangee.enableScreenSaver = function() {
  sf.service.setScreenSaver(true);
};

//https://github.com/leahciMic/polyfill-function-prototype-bind/blob/master/bind.js
// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
