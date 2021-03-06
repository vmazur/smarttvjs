smarttv.PLATFORM = "samsung";

//http://www.samsungdforum.com/Guide/ref00006/index.html
smarttv.init = function(callback) {
  //http://www.samsungdforum.com/Guide/ref00006/TVKeyValue_Object.html
  smarttv._samsungKeys =  new Common.API.TVKeyValue();
  smarttv.KEYS = {};
  smarttv.KEYS[smarttv._samsungKeys.KEY_ENTER] = "enter";
  smarttv.KEYS[smarttv._samsungKeys.KEY_LEFT] = "left";
  smarttv.KEYS[smarttv._samsungKeys.KEY_RIGHT] = "right";
  smarttv.KEYS[smarttv._samsungKeys.KEY_UP] = "up";
  smarttv.KEYS[smarttv._samsungKeys.KEY_DOWN] = "down";
  smarttv.KEYS[smarttv._samsungKeys.KEY_PLAY] = "play";
  smarttv.KEYS[smarttv._samsungKeys.KEY_PAUSE] = "pause";
  smarttv.KEYS[smarttv._samsungKeys.KEY_STOP] = "stop";
  smarttv.KEYS[smarttv._samsungKeys.KEY_RW] = "rewind";
  smarttv.KEYS[smarttv._samsungKeys.KEY_FF] = "fastforward";
  smarttv.KEYS[smarttv._samsungKeys.KEY_RETURN] = "back";
  smarttv.KEYS[smarttv._samsungKeys.KEY_EXIT] = "exit";

  smarttv._samsungWidgetAPI = new Common.API.Widget();
  smarttv._samsungWidgetAPI.sendReadyEvent();
};

smarttv.exit = function() {
  smarttv._samsungWidgetAPI.sendReturnEvent();
};

window.onShow = function (e) {
  //http://www.samsungdforum.com/SamsungDForum/ForumView/df3455b529adf7c4?forumID=7126e09362131c36
  //http://www.dummies.com/how-to/content/registeringunregistering-remote-control-keys-for-s.html
  var nnaviPlugin = document.getElementById('pluginObjectNNavi');
  nnaviPlugin.SetBannerState(1);

  // Unregister keys for volume OSD.
  var pluginAPI = new Common.API.Plugin();
  pluginAPI.unregistKey(smarttv._samsungKeys.KEY_VOL_UP);
  pluginAPI.unregistKey(smarttv._samsungKeys.KEY_VOL_DOWN);
  pluginAPI.unregistKey(smarttv._samsungKeys.KEY_MUTE);
};

smarttv.hasNetwork = function() {
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

smarttv.disableScreenSaver = function() {
  //http://www.samsungdforum.com/Guide/index.html?FolderName=tec00115&FileName=index.html
  sf.service.setScreenSaver(false);
};

smarttv.enableScreenSaver = function() {
  sf.service.setScreenSaver(true);
};

//http://www.samsungdforum.com/Guide/ref00001/index.html
/*
smarttv.writeFile = function(filename, data) {
  smarttv.debug("smarttv.writeFile: " + curWidget.id+'/'+filename);
  try {
    var fileSystemObj = new FileSystem();
    var bValid = fileSystemObj.isValidCommonPath(curWidget.id);
    if (!bValid) {
      fileSystemObj.createCommonDir(curWidget.id);
    }
    var fileObj = fileSystemObj.openCommonFile(curWidget.id+'/'+filename,'w');
    fileObj.writeLine(data);
    fileSystemObj.closeCommonFile(fileObj);
  } catch (e) {
    smarttv.log('smarttv.writeFile ERROR: ' + filename + " " + e);
  }
};

smarttv.readFile = function(filename) {
  try {
    var fileSystemObj = new FileSystem();
    var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/' + filename, 'r');
    if (!fileObj) {
      return null;
    }
    var strLine = '';
    var arrResult = new Array();

    while (strLine = fileObj.readLine()) {
        arrResult.push(strLine);
    }

    fileSystemObj.closeCommonFile(fileObj);

    return arrResult.join("\n");
  } catch(e) {
    smarttv.log('smarttv.readFile ERROR: ' + filename + " " + e);
    return null;
  }
};

smarttv.deleteFile = function(filename) {
  var fileSystemObj = new FileSystem();
  var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/' + filename);
};*/

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
