orangee.PLATFORM = 'lg';

//http://developer.lgappstv.com/TV_HELP/topic/lge.tvsdk.developing.book/html/API/API/How%20to%20Use%20HTML5%20Video%20Player%20Framework.htm?path=1_3_15_0#_Toc358881075
//src="../lge/framework/VideoPlayer/util/keycode.js"
orangee.KEYS = {
  13: 'enter',
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  415: 'play',
  19: 'pause',
  412: 'rewind',
  417: 'fastforward',
  461: 'back',
};

/*
    KEY_TOOLS:1,
    KEY_MUTE:1,
    KEY_RETURN:27,
    KEY_UP:38,
    KEY_DOWN:40,
    KEY_LEFT:37,
    KEY_RIGHT:39,
    KEY_WHEELDOWN:1,
    KEY_WHEELUP:1,
    KEY_ENTER:13,
    KEY_INFO:1,
    KEY_EXIT:27,
    KEY_RED:403,
    KEY_GREEN:404,
    KEY_YELLOW:405,
    KEY_BLUE:406,
    KEY_INFOLINK:1,
    KEY_RW:1,
    KEY_PAUSE:1,
    KEY_FF:1,
    KEY_PLAY:1,
    KEY_STOP:1,
    KEY_1:49,
    KEY_2:50,
    KEY_3:51,
    KEY_4:52,
    KEY_5:53,
    KEY_6:54,
    KEY_7:55,
    KEY_8:56,
    KEY_9:57,
    KEY_0:48,
    KEY_EMPTY:32,
    KEY_PRECH:1,
    KEY_SOURCE:1,
    KEY_CHLIST:1,
    KEY_MENU:112,//f1
    KEY_WLINK:1,
    KEY_CC:1,
    KEY_CONTENT:1,
    KEY_FAVCH:1,
    KEY_REC:1,
    KEY_EMODE:1,
    KEY_DMA:1,
    KEY_PANEL_CH_UP:1,
    KEY_PANEL_CH_DOWN:1,
    KEY_PANEL_VOL_UP:1,
    KEY_PANEL_VOL_DOWN:1,
    KEY_PANEL_ENTER:1,
    KEY_PANEL_SOURCE:1,
    KEY_PANEL_MENU:1,
    KEY_PANEL_POWER:1
*/

orangee.init = function(callback) {
};

orangee.exit = function() {
  //window.NetCastExit();
  if (window.NetCastBack) {
    window.NetCastBack();
  }
};

orangee.hasNetwork = function() {
  var device = document.getElementById("device");
  return device.net_isConnected;
};


orangee.disableScreenSaver = function() {
};

orangee.enableScreenSaver = function() {
};
