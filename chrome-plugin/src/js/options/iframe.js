(function(options, messages) {
    $.extend(options.local, {
        loadAll: function() {
            options.onReady.fireEventOnce();
        },
        set: function(name, value) {
            options.local.cache[name] = value;
            messages.page.broadcast('setLocalOption', {name: name, value: value});
        }
    });

    $.extend(options, {
        onReady: new OnEvent(),

        isCopyToClipboard: function() {
            return options.global.cache.copyToClipboard;
        },

        getUserIdentifier: function(){
            return options.global.cache.userIdentifier;
        },
        setUserIdentifier: function(value){
            return options.global.set('userIdentifier',value);
        },

        getUniqueKey: function(){
            return domain+"-MyKey-"+options.global.cache.userIdentifier;
        },

        getDefaultLength: function(){
            return options.global.cache.defaultLength;
        },
        getLength: function(){
            var len = options.local.cache.length;
            if ( isUndefined(len) ) {
                len = options.getDefaultLength();
                options.local.set('length',len );
            }
            return len;
        },
        setLength: function(value){
            options.local.set('length',value);
        },

        getDefaultPasswordMode: function() {
            return options.global.cache.defaultPasswordMode;
        },
        getPasswordMode: function(){
            var mode = options.local.cache.passwordMode;
            if ( isUndefined( mode ) || (mode !== 'simple' && mode !== 'complex') ) {
                options.local.set('passwordMode',options.getDefaultPasswordMode() );
            }
            return options.local.cache.passwordMode;
        },
        setPasswordMode: function(value) {
            options.local.set('passwordMode',value);
        }
    });
})(options, messages);
