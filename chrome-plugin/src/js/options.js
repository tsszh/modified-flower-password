$(function() {
    options.init();

    options.global.set = mergeFuns(options.global.set, function(name, value) {
        chrome.extension.sendMessage({action: 'setGlobalOption', name: name, value: value}, function(){});
    });

    $('#default-enabled').prop("checked", options.global.cache.defaultEnabled).change(function() {
        options.global.set('defaultEnabled', this.checked);
    });
    $('#copy-to-clipboard').prop("checked", options.global.cache.copyToClipboard).change(function() {
        options.global.set('copyToClipboard', this.checked);
    });
    $('#user-identifier').val(options.global.cache.userIdentifier).on('blur keyup', function(){
        options.global.set('userIdentifier',this.value);
    });
    $('#length').val(options.global.cache.defaultLength).on('change input',function(){
        options.global.set('defaultLength',parseInt(this.value));
    });
    $('.password-mode').change(function() {
        options.global.set('defaultPasswordMode',this.value);
    }).filter(':[value='+options.global.cache.defaultPasswordMode+']').prop("checked",true);
});
