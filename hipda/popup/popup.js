// 默认选项
var defaultConfig = {
    enableBlacklist: true,
    pageWidth: "100%",
    goodboySee: true,
    blockBSTop: true,
    highlightOP: true,
    enableShortcut:false
}


var currentConfig = JSON.parse(JSON.stringify(defaultConfig));



//初始化所有ui
function showOption(currentConfig) {
    $('[id^=toggle_]').bootstrapSwitch('state', false);


    var manifestData = chrome.runtime.getManifest();

    $('#vernumber').text('v' + manifestData.version);
    $('.bootstrap-switch-wrapper').addClass('float-right');





    //下面开始根据配置文件改变UI显示

    if (currentConfig.enableBlacklist) {
        $('#toggle_blacklist').bootstrapSwitch('state', true);
    }
    if (currentConfig.goodboySee) {
        $('#toggle_goodboy').bootstrapSwitch('state', true);
    }
    if (currentConfig.blockBSTop) {
        $('#toggle_BSTop').bootstrapSwitch('state', true);
    }
    if (currentConfig.highlightOP) {
        $('#toggle_highlightop').bootstrapSwitch('state', true);
    }
    if (currentConfig.enableShortcut) {
        $('#toggle_shortcut').bootstrapSwitch('state', true);
    }



    $('#btnpageWidth').text(currentConfig.pageWidth);




}


//根据用户操作改变UI
function userChangeOption(currentConfig) {
    $('#toggle_blacklist').on('switchChange.bootstrapSwitch', function (event, state) {
        currentConfig.enableBlacklist = state;
        // console.log(currentConfig);
    });
    $('#toggle_goodboy').on('switchChange.bootstrapSwitch', function (event, state) {
        currentConfig.goodboySee = state;
        // console.log(currentConfig);
    });
    $('#toggle_BSTop').on('switchChange.bootstrapSwitch', function (event, state) {
        currentConfig.blockBSTop = state;
        // console.log(currentConfig);
    });
    $('#toggle_highlightop').on('switchChange.bootstrapSwitch', function (event, state) {
        currentConfig.highlightOP = state;
        // console.log(currentConfig);
    });

    $('#toggle_shortcut').on('switchChange.bootstrapSwitch', function (event, state) {
        currentConfig.enableShortcut = state;
        // console.log(currentConfig);
    });



    $('.droppagewidth>a').click(function () {
        $('#btnpageWidth').text($(this).text());
        currentConfig.pageWidth = $(this).text();
        // console.log(currentConfig);
    })
}

//确认配置,存储到chrome.storage
function confirmChange(currentConfig) {
    $('#confirm').click(function () {
        console.log('2' + currentConfig.pageWidth);
        currentConfig.pageWidth = $('#btnpageWidth').text()
        chrome.storage.sync.set({ 'extentionConfig': currentConfig });
        $('.alert-success').fadeIn(1000);

        $('.alert-success').delay(2000).fadeOut(1000);
    });
}

//恢复默认配置
function backToDefault(defaultConfig) {
    $('#backToDefault').click(function () {
        currentConfig = JSON.parse(JSON.stringify(defaultConfig));
        showOption(defaultConfig);
        chrome.storage.sync.set({ 'extentionConfig': defaultConfig });
        console.log('1' + currentConfig.pageWidth);

    });
}


$(function () {

    

    chrome.storage.sync.get('extentionConfig', function (obj) {

        if (typeof obj.extentionConfig == 'undefined') {
            chrome.storage.sync.set({ 'extentionConfig': defaultConfig });
        }

        if (typeof obj.extentionConfig !== 'undefined') {
            currentConfig = obj.extentionConfig;
        }
        showOption(currentConfig);
        userChangeOption(currentConfig);
        
        confirmChange(currentConfig);
        backToDefault(defaultConfig);
        
        console.log(currentConfig);

    });

    var bg = chrome.extension.getBackgroundPage();
    if (bg.hasnewpm) {
        $('#notifybox').show();
        $('#notifybox').click(bg.dismissNotify);
        bg.hasnewpm = false;
    }
    












}
);


