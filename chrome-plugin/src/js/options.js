$(function() {
    passTranOptions.init();

    passTranOptions.global.set = mergeFuns(passTranOptions.global.set, function(name, value) {
        chrome.extension.sendMessage({action: 'setGlobalOption', name: name, value: value}, function(){});
    });

    $('#default-enabled').prop("checked", passTranOptions.global.cache.defaultEnabled).change(function() {
        passTranOptions.global.set('defaultEnabled', this.checked);
    });
    $('#copy-to-clipboard').prop("checked", passTranOptions.global.cache.copyToClipboard).change(function() {
        passTranOptions.global.set('copyToClipboard', this.checked);
    });
    $('#user-identifier').val(passTranOptions.global.cache.userIdentifier).on('blur keyup', function(){
        passTranOptions.global.set('userIdentifier',this.value);
    });
    $('#length').val(passTranOptions.global.cache.defaultLength).on('change input',function(){
        passTranOptions.global.set('defaultLength',parseInt(this.value));
    });
    $('.password-mode').change(function() {
        passTranOptions.global.set('defaultPasswordMode',this.value);
    }).filter(':[value='+passTranOptions.global.cache.defaultPasswordMode+']').prop("checked",true);
});
