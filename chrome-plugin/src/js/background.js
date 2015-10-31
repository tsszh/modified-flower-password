function forEachTab(callback) {
    chrome.windows.getAll({ populate: true }, function(windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            if (tabs) {
                for (var j = 0; j < tabs.length; j++) {
                    var tab = tabs[j];
                    callback(tab);
                }
            }
        }
    });
}

function showAllPageActions() {
    forEachTab(function(tab) {
        updatePageAction(tab);
    });
}

function updatePageAction(tab) {
    chrome.pageAction.hide(tab.id);
    messages.extension.sendTo(tab.id, 'getLocalEnabled');
}

function notifyOptionsChanged() {
    forEachTab(function(tab) {
        chrome.pageAction.hide(tab.id);
        messages.extension.sendTo(tab.id, 'setGlobalOptions', {value: passTranOptions.global.cache});
    });
}

function setPageEnabled(tab, value) {
    var icon;
    var title;
    if (value) {
        icon = 'img/enabled.png';
        title = 'Click To Disable Password Transformer For This Page';
    } else {
        icon = 'img/disabled.png';
        title = 'Click To Enable Password Transformer For This Page';
    }
    chrome.pageAction.setIcon({tabId: tab.id, path: icon});
    chrome.pageAction.setTitle({tabId: tab.id, title: title});
    chrome.pageAction.show(tab.id);
}

function attachListeners() {
    $.extend(messages.extension.handlers, {
        getGlobalOptions: function(data, reply) {
            reply('setGlobalOptions', {value: passTranOptions.global.cache});
        },
        setGlobalOption: function(data) {
            passTranOptions.global.set(data.name, data.value);
            if (data.name == 'defaultEnabled') {
                notifyOptionsChanged();
            }
        },
        setLocalEnabled: function(data, reply, sender) {
            setPageEnabled(sender.tab, data.value);
        },
        copyToClipboard: function(data) {
            $('#copy-to-clipboard').val(data.value).get(0).select();
            document.execCommand('copy');
        }
    });
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.transit) {
            chrome.tabs.sendMessage(sender.tab.id, request, function(response) {
                if (sendResponse) {
                    sendResponse(response);
                    sendResponse = null;
                }
            });
            return true;
        }
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (tab.status == 'loading') {
            updatePageAction(tab);
        }
    });
    chrome.pageAction.onClicked.addListener(function(tab) {
        messages.extension.sendTo(tab.id, 'toggleLocalEnabled');
    });
}

function init() {
    passTranOptions.init();
    attachListeners();
    showAllPageActions();
}

init();
