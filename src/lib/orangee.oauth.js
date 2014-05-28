var OrangeeJS = OrangeeJS || {};

OrangeeJS.OAuth = {
  accessToken: {
    facebook: 'orangeejs_facebook_accessToken',
    twitter: 'orangeejs_twitter_accessToken'
  },
  current_user_key: 'orangeejs_current_user',
  init: function(key) {
    // body...
  },
  user: {
    login: function(argument, callback) {
      // body...
      if (typeof callback === "function") {
        callback();
      }
    },
    logout: function(argument, callback) {
      // body...
      if (typeof callback === "function") {
        callback();
      }
    }
  }, // end user
  facebook: {
    fields: 'email',
    login: function(option, success_callback, fail_callback) {
      var authorize_url = "https://m.facebook.com/dialog/oauth?";
      authorize_url += "client_id=" + this.appId;
      authorize_url += "&redirect_uri=" + this.redirectUrl;
      authorize_url += "&display=touch";
      authorize_url += "&response_type=token";
      authorize_url += "&type=user_agent";

      if (this.fields !== '') {
        authorize_url += "&scope=" + this.fields;
      }

      option = option ? option : 'localtion=no';
      var appInBrowser = window.open(authorize_url, '_blank', option);

      appInBrowser.addEventListener('loadstart', function() {
        // Get access token
        if (location.url.indexOf("access_token") !== -1) {
          var access_token = location.url.match(/access_token=(.*)$/)[1].split('&expires_in')[0];
          if (typeof success_callback === 'function') {
            success_callback(access_token);
          };
          appInBrowser.close();
        }
        // User denied
        if (location.url.indexOf("error_reason=user_denied") !== -1) {
          if (typeof fail_callback === 'function') {
            fail_callback();
          };
          appInBrowser.close();
        }
      });
    }
  }, // end facebook
  twitter: {

  } // end twitter
}
