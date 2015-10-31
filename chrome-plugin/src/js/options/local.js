(function(passTranOptions) {
    var cache = {
        enabled: undefined,
        passwordMode : undefined,
        length : undefined
    };

    function saveStorage(name, value) {
        var key = 'password-transformer-' + name;
        try {
            if (!isUndefined(value)) {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.removeItem(key);
            }
        } catch (e) {
            console.log(e);
        }
    }

    function loadStorage(name) {
        var key = 'password-transformer-' + name;
        var value = localStorage.getItem(key);
        if (value !== null) value = JSON.parse(value);
        return value;
    }

    passTranOptions.local = {
        cache: cache,

        loadAll: function() {
            for (var name in cache) {
                var value = loadStorage(name);
                if (value === null) {
                    if (!isUndefined(cache[name])) {
                        saveStorage(name, cache[name]);
                    }
                } else {
                    cache[name] = value;
                }
            }
        },
        set: function(name, value) {
            cache[name] = value;
            saveStorage(name, value);
        }
    };

    passTranOptions.onInit.addListener(function() {
        passTranOptions.local.loadAll();
    });
})(passTranOptions);
