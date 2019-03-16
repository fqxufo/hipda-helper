//恢复全文搜索
function reviveFullSearch(url) {
    //在搜索页面添加全文搜索的选项
    if (url.indexOf('search') > 0) {
        $('#wrap > form > p.searchkey > select').append($('<option>', {
            value: 'fulltext',
            text: '全文'
        }));
    }

    //全文搜索结果页自动选中全文搜索选项
    if (url.indexOf('srchtype=fulltext') > 0) {
        $('#wrap > form > p.searchkey > select').val('fulltext');
    }

}


//黑名单屏蔽功能
function block(url, blacklist) {
    //帖子列表页面屏蔽
    if (url.indexOf('fid=') > 0) {
        var authorList = $('.author>cite>a')
        $(authorList).each(function () {
            var userName = $(this).text();
            if (blacklist.indexOf(userName) > 0) {
                $(this).parents('tbody').hide();
            }
        });
    }

    //帖子内容页面屏蔽
    if (url.indexOf('viewthread')>0){
        var postList = $('.mainbox>div')
        $(postList).each(function(){
            var userName = $('.postinfo>a',this).text()
            if (blacklist.indexOf(userName)>0){
                $(this).hide();
            }
        })
    }
}



//脚本主入口,页面加载时执行
$(function () {
    var urlOfPage = window.location.href;
    reviveFullSearch(urlOfPage);

    //通过chrome.storage获取黑名单,进行屏蔽功能
    chrome.storage.local.get('blacklist', function (result) {
        console.log('Value currently is ' + result.blacklist);
        block(urlOfPage, result.blacklist);
    });
})


