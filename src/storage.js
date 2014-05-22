orangee.storage = {
    localStoreSupport: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    },
    set: function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else {
            var expires = "";
        }
        if( this.localStoreSupport() ) {
            localStorage.setItem(name, value);
        }
        else {
            document.cookie = name+"="+value+expires+"; path=/";
        }
    },
    get: function(name) {
        if( this.localStoreSupport() ) {
            ret = localStorage.getItem(name);
            //console.log(typeof ret);
            switch (ret) {
              case 'true': 
                  return true;
              case 'false':
                  return false;
              default:
                  return ret;
            }
        }
        else {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) {
                    ret = c.substring(nameEQ.length,c.length);
                    switch (ret) {
                      case 'true': 
                          return true;
                      case 'false':
                          return false;
                      default:
                          return ret;
                    }
                }
            }
            return null;
        }
    },
    del: function(name) {
        if( this.localStoreSupport() ) {
            localStorage.removeItem(name);
        }
        else {
            this.set(name,"",-1);
        }
    }
};
