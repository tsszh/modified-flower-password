/* 

    Save Option Data In LocalStorage 

*/

/* global options, console */
'use strict';
(function(options) {
    var cache = {
        copyToClipboard: false,
        defaultEnabled: true,
        userIdentifier: 'Please change this message.',
        defaultPasswordMode: 'complex',
        defaultLength: 16
    };

    options.global = {
        cache: cache,

        loadAll: function() {
            try {
                for (var name in cache) {
                    var value = localStorage.getItem(name);
                    if (value === null) {
                        options.global.set(name, cache[name]);
                    } else {
                        cache[name] = JSON.parse(value);
                    }
                }
            } catch (e) {
                console.log(e);
                options.accessLocalStorageFailed = true;
            }
        },
        set: function(name, value) {
            cache[name] = value;
            try {
                localStorage.setItem(name, JSON.stringify(value));
            } catch (e) {
                console.log(e);
                options.accessLocalStorageFailed = true;
            }
        }
    };

    options.onInit.addListener(function() {
        options.global.loadAll();
    });
})(options);
