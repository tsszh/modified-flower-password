(function(passTranOptions, messages) {
    if (isTopWindow()) {
        $.extend(passTranOptions.global, {
            setCache: function(value) {
                if (!isUndefined(value)) {
                    passTranOptions.global.cache = value;
                    passTranOptions.onReady.fireEventOnce();
                }
            },
            loadAll: function() {
                messages.extension.send('getGlobalOptions');
            },
            set: function(name, value) {
                passTranOptions.global.cache[name] = value;
                messages.extension.send('setGlobalOption', {name: name, value: value});
            }
        });

        $.extend(passTranOptions, {
            onReady: new OnEvent(),
            onIframeReady: new OnEvent(),

            isTransparent: function() {
                return passTranOptions.global.cache.transparent;
            },

            onSetEnabled: new OnEvent(),
            isDefaultEnabled: function() {
                return passTranOptions.global.cache.defaultEnabled;
            },
            isEnabled: function() {
                if (isUndefined(passTranOptions.local.cache.enabled)) {
                    return passTranOptions.isDefaultEnabled();
                } else {
                    return passTranOptions.local.cache.enabled;
                }
            },
            setEnabled: function(value) {
                passTranOptions.local.set('enabled', value);
                passTranOptions.onSetEnabled.fireEvent();
            },
            toggleEnabled: function() {
                passTranOptions.setEnabled(!passTranOptions.isEnabled());
            }
        });
        passTranOptions.onIframeReady.addListener(function() {
            messages.page.broadcast('setLocalEnabled', {value: passTranOptions.isEnabled()});
        });

        $.extend(messages.extension.handlers, {
            toggleLocalEnabled: function() {
                passTranOptions.toggleEnabled();
                messages.all.broadcast('setLocalEnabled', {value: passTranOptions.isEnabled()});
            },
            getLocalEnabled: function(data, reply) {
                reply('setLocalEnabled', {value: passTranOptions.isEnabled()});
            },
            setGlobalOptions: function(data) {
                passTranOptions.global.setCache(data.value);
                messages.extension.send('setLocalEnabled', {value: passTranOptions.isEnabled()});
            }
        });

        $.extend(messages.page.handlers, {
            getLocalEnabled: function(data, reply) {
                if (passTranOptions.onIframeReady.fired) {
                    reply('setLocalEnabled', {value: passTranOptions.isEnabled()});
                }
            }
        });
    } // endif (isTopWindow())

    if (isIframe()) {
        $.extend(passTranOptions.global, {
            loadAll: function() {},
            set: function() {}
        });

        $.extend(passTranOptions, {
            onSetEnabled: new OnEvent(),
            isEnabled: function() {
                return passTranOptions.local.cache.enabled;
            },
            setEnabled: function(value) {
                passTranOptions.local.cache.enabled = value;
                passTranOptions.onSetEnabled.fireEvent();
            }
        });

        $.extend(messages.page.handlers, {
            setLocalEnabled: function(data) {
                passTranOptions.setEnabled(data.value);
            }
        });

        passTranOptions.onInit.addListener(function() {
            messages.page.sendToTop('getLocalEnabled');
        });
    } // endif (isIframe())

    // commons for top window and iframes
    $.extend(messages.page.handlers, {
        setLocalOption: function(data) {
            if (current.field) {
                passTranOptions.local.set(data.name, data.value);
            }
        }
    });
})(passTranOptions, messages);
