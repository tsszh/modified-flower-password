$.fn.hideAndNotify = function() {
    if (this.is(':visible')) {
        this.hide();
        adjustIframeSize();
    }
};

$.fn.showAndNotify = function() {
    if (!this.is(':visible')) {
        this.show();
        adjustIframeSize();
    }
};

function adjustIframeSize(locate) {
    var width = $('#main').outerWidth();
    var height = $('#main').outerHeight();
    messages.page.sendToTop('setIframeSize', {width: width, height: height, locate: locate});
}

passTranOptions.onReady.addListener(function() {
    if (passTranOptions.accessLocalStorageFailed) {
        $('.extension-id').html(chrome.i18n.getMessage("@@extension_id"));
        $('#write-local-storage-failed').show();
    }

    $('#close').click(function() {
        messages.page.sendToTop('closeIframe');
    });

    var mousedownOffset = null;
    function moveIframe(e) {
        messages.page.sendToTop('moveIframe', {dx: e.pageX - mousedownOffset.x, dy: e.pageY - mousedownOffset.y});
    }
    $('#title').mousedown(function(e) {
        if (e.button == 0) {
            mousedownOffset = {x: e.pageX, y: e.pageY};
            e.preventDefault();
        }
    });
    $(document).on('mouseup', function(e) {
        if (mousedownOffset) {
            moveIframe(e);
            mousedownOffset = null;
            e.preventDefault();
        }
    })
    .on('mousemove', function(e) {
        if (mousedownOffset) {
            moveIframe(e);
            e.preventDefault();
        }
    });

    $('#password').blur(function() {
        var password = $("#password").val(),
            key = passTranOptions.getUniqueKey(),
            mode = passTranOptions.getPasswordMode(),
            length = passTranOptions.getLength();

        var result = flowerPassword.encrypt(password, key, mode, length);
        console.log(result);
        if (result) {
            messages.page.broadcast('setCurrentFieldValue', {value: result});
            if (passTranOptions.isCopyToClipboard()) {
                messages.extension.send('copyToClipboard', {value: result});
            }
        }
    }).keyup(function(e) { // Enter or Esc to finish the input
        if (e.matchKey(13) || e.matchKey(27) ) {
            messages.page.sendToTop('closeIframe', {focusCurrentField: true});
        }
    });

    $('#length').on('input change',function(){
        passTranOptions.setLength(parseInt(this.value));
        $('#length-show').html(this.value);
    });

    $('.password-mode').on('input change',function(e){
        passTranOptions.setPasswordMode(e.target.value);
    });

    $(document).on('click', '.alert .close', function() {
        $(this).parent().hideAndNotify();
    });

    messages.page.sendToTop('iframeReady');
});

$.extend(messages.page.handlers, {
    /* Setup The Iframe */
    setupIframe: function(data) {
        passTranOptions.local.cache = data.passTranOptions;
        domain = data.domain;

        $('#password').val('').change();

        var len = passTranOptions.getLength();
        $('#length').val(len);
        $('#length-show').html(len);

        $('.password-mode').filter(':[value='+passTranOptions.getPasswordMode()+']').prop("checked",true);
    },
    focusPassword: function() {
        $('#password').focus();
    }
});

$(window).ready(function() {
    passTranOptions.init();
}).load(function() {
    adjustIframeSize(true);
});
