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

  }, // end facebook
  twitter: {

  } // end twitter
}
