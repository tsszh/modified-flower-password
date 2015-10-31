/* 

    Save Option Data In LocalStorage 

*/

/* global passTranOptions, console */
'use strict';
(function(passTranOptions) {
    var cache = {
        copyToClipboard: false,
        defaultEnabled: true,
        userIdentifier: 'Please change this message.',
        defaultPasswordMode: 'complex',
        defaultLength: 16
    };

    passTranOptions.global = {
        cache: cache,

        loadAll: function() {
            try {
                for (var name in cache) {
                    var value = localStorage.getItem(name);
                    if (value === null) {
                        passTranOptions.global.set(name, cache[name]);
                    } else {
                        cache[name] = JSON.parse(value);
                    }
                }
            } catch (e) {
                console.log(e);
                passTranOptions.accessLocalStorageFailed = true;
            }
        },
        set: function(name, value) {
            cache[name] = value;
            try {
                localStorage.setItem(name, JSON.stringify(value));
            } catch (e) {
                console.log(e);
                passTranOptions.accessLocalStorageFailed = true;
            }
        }
    };

    passTranOptions.onInit.addListener(function() {
        passTranOptions.global.loadAll();
    });
})(passTranOptions);
