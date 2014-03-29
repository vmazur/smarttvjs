var OrangeeJS = {
    PLATFORM:  "lg"
};

OrangeeJS.init = function(callback) {
  if (typeof callback === "function") {
    callback();
  }
};
