(function(passTranOptions, messages) {
    $.extend(passTranOptions.local, {
        loadAll: function() {
            passTranOptions.onReady.fireEventOnce();
        },
        set: function(name, value) {
            passTranOptions.local.cache[name] = value;
            messages.page.broadcast('setLocalOption', {name: name, value: value});
        }
    });

    $.extend(passTranOptions, {
        onReady: new OnEvent(),

        isCopyToClipboard: function() {
            return passTranOptions.global.cache.copyToClipboard;
        },

        getUserIdentifier: function(){
            return passTranOptions.global.cache.userIdentifier;
        },
        setUserIdentifier: function(value){
            return passTranOptions.global.set('userIdentifier',value);
        },

        getUniqueKey: function(){
            return domain+"-MyKey-"+passTranOptions.global.cache.userIdentifier;
        },

        getDefaultLength: function(){
            return passTranOptions.global.cache.defaultLength;
        },
        getLength: function(){
            var len = passTranOptions.local.cache.length;
            if ( isUndefined(len) ) {
                len = passTranOptions.getDefaultLength();
                passTranOptions.local.set('length',len );
            }
            return len;
        },
        setLength: function(value){
            passTranOptions.local.set('length',value);
        },

        getDefaultPasswordMode: function() {
            return passTranOptions.global.cache.defaultPasswordMode;
        },
        getPasswordMode: function(){
            var mode = passTranOptions.local.cache.passwordMode;
            if ( isUndefined( mode ) || (mode !== 'simple' && mode !== 'complex') ) {
                passTranOptions.local.set('passwordMode',passTranOptions.getDefaultPasswordMode() );
            }
            return passTranOptions.local.cache.passwordMode;
        },
        setPasswordMode: function(value) {
            passTranOptions.local.set('passwordMode',value);
        }
    });
})(passTranOptions, messages);
