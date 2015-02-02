//https://raw.githubusercontent.com/Puppets/marionette-cookbook/master/recipes/hotkeys/util.js
;(function(root, $) {
   var valid_modifiers = ['alt', 'ctrl', 'meta', 'shift'];

    var eventsNamespace = {};

    var keyMatches = function(e, key) {
        return String.fromCharCode(e.which).toLowerCase() == key
            || orangee.KEYS[e.which] == key;
    };

    var modifierMatches = function(e, modifiers) {
        var hasModifier = function(m) {
            return e[m + 'Key'];
        };

        return _.chain(modifiers)
                .intersection(valid_modifiers)
                .all(hasModifier)
                .value();
    };

    var matches = function(e, key, modifiers) {
        return keyMatches(e, key)
            && modifierMatches(e, modifiers);
    };

    var buildHandler = function(key, modifiers, callback) {
        return function(e) {
            if (/textarea|select/i.test(e.target.nodeName) || e.target.type === "text") {
                return;
            }

            if (matches(e, key, modifiers)) {
                e.stopPropagation();
                e.preventDefault();
                callback(arguments);
            }
        };
    };

    var bind = function(events, context, namespace) {
        _.each(events, function(method, trigger) {
            if (_.isFunction(context[method])) {
                var parts = trigger.split(/\s*\+\s*/),
                    key = _.last(parts),
                    modifiers = _.initial(parts),
                    callback = _.bind(context[method], context);

                    if (eventsNamespace[namespace]) {
                      eventsNamespace[namespace].push(buildHandler(key, modifiers, callback));
                    } else {
                      eventsNamespace[namespace] = [buildHandler(key, modifiers, callback)];
                    }
            }
        });
        return context;
    };

    var unbind = function (events, context, namespace) {
        delete eventsNamespace[namespace];
    };

    var onKeydown = function() {
        _.each(eventsNamespace, function(namespace) {
          _.each(namespace, function(callback) {
            if (orangee.PLATFORM === 'samsung') {
              if (orangee.KEYS[event.keyCode] === 'back') {
                orangee._samsungWidgetAPI.blockNavigation(event);//does not work with keyup
              } /*else if (orangee.KEYS[event.keyCode] === 'exit') {
                orangee._samsungWidgetAPI.blockNavigation(event);
                orangee._samsungWidgetAPI.sendReturnEvent();
              }*/
            }
            callback(event);
          });
        });
    };

    $(document).on('keydown', onKeydown);
    //<a href="javascript:void(0);" id="orangeeKeyboardAnchor" onkeydown="HotKeys.onKeydown();"></a>
    //document.getElementById("orangeeKeyboardAnchor").focus();

    root.HotKeys = {
        'bind': bind,
        'unbind': unbind,
        //'onKeydown': onKeydown,
    };
}(window, $))
