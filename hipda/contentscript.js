//默认配置
var defaultConfig = {
    enableBlacklist: true,
    pageWidth: "100%",
    goodboySee: true,
    blockBSTop: true,
    highlightOP: true,
    enableShortcut: false
}


//改变页面宽度,放在jquery load方法之外,可以解决页面闪烁的问题
if (localStorage.getItem('pagewidth')) {
    console.log('change width')
    var style = document.createElement('style');
    style.type = "text/css";
    // style.textContent = "body{width:" + localStorage.getItem('pagewidth') + ";margin:0 auto !important;}";
    style.textContent = ".wrap,#nav{width:" + localStorage.getItem('pagewidth') + " !important;}";
    (document.body || document.head || document.documentElement).appendChild(style);
}


//增加我的主题,我的回复,我的收藏三个快捷入口(代码参考hipda tools脚本)
function addShortcut() {
    if (localStorage.getItem('enableshortcut')) {

        if (document.getElementById('menu')) {


            document.getElementById('umenu').appendChild(document.createTextNode(" | "));
            menuitem = document.createElement('a');
            menuitem.innerHTML = "我的主题";
            menuitem.target = "_blank";
            menuitem.href = 'https://' + document.domain + '/forum/my.php?item=threads';
            document.getElementById('umenu').appendChild(menuitem);

            

            document.getElementById('umenu').appendChild(document.createTextNode(" "));
            menuitem = document.createElement('a');
            menuitem.innerHTML = "我的收藏";
            menuitem.target = "_blank";
            menuitem.href = 'https://' + document.domain + '/forum/my.php?item=favorites&type=thread';
            document.getElementById('umenu').appendChild(menuitem);


            document.getElementById('umenu').appendChild(document.createTextNode(" | "));

            document.getElementById('umenu').appendChild(document.createTextNode(" "));
            menuitem = document.createElement('a');
            menuitem.innerHTML = "查看新帖";
            menuitem.target = "_blank";
            var full_url = window.location.href;
            var fid = '2';
            if (full_url.indexOf('fid=')>0){
                fid = full_url.split('fid=')[1].split('&')[0];
            }
            menuitem.href = 'https://' + document.domain + '/forum//forumdisplay.php?fid=' + fid + '&orderby=dateline';
            document.getElementById('umenu').appendChild(menuitem);
        }

    }
}


function pagePreview() {
    if (localStorage.getItem('pagePreview') == 'on') {
        console.log('试验性预览功能已打开');
        var previewIframe = $('<iframe id="page_preview" scrolling="no"></iframe>');
        var viewHeight = $(window).height();
        var previewHeight = viewHeight * 0.6 + 'px' 
        previewIframe.css({ 'width': '500px', 'height': previewHeight,'min-height':'350px', 'display': 'none', 'position': 'absolute', 'z-index': '100', 'backgroundColor': '#fff', 'margin': '0 20px' , 'overflow':'hidden'});
        $('#subforum').before(previewIframe);

        $('body').mousemove(function (event) {
            var left = event.pageX + 150;
            var top = event.pageY - 200;
            $('#page_preview').css({ 'top': top, 'left': left, 'display': 'none' });

        });

        var links = $('[id^="thread_"]>a');
        var pre = 'https://www.hi-pda.com/forum/';
        var timer;
        var delay = 800;
        // '&action=printable'
        links.each(function () {
            var link = pre + $(this).attr('href') + '&action=printable';
            $(this).hover(function (event) {
                $(this).css('cursor', 'pointer');
                $('#page_preview').attr('src', link);
                //用location.replace替换url，不会将iframe访问加入历史记录，体验更好
                document.getElementById('page_preview').contentWindow.location.replace(link);

                timer = setTimeout(function () {
                    $(page_preview).show();
                }, delay);
            }, function () {
                $('#page_preview').css('display', 'none');
            });


        });
    }
}


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


//好孩子看得见
function goodboyCanSee(url) {
    if (url.indexOf('viewthread') > 0) {
        $('font[color="white"]').attr('color', 'red');
    }
}


function hightlightOP(url) {
    if (url.indexOf('tid') > 0) {
        var threadTid = url.split('tid=')[1].split('&')[0];
        console.log(threadTid);

        var pageNumber = 1;
        rawPageNumber = url.split('page=')[1];
        if (rawPageNumber) {
            pageNumber = parseInt(rawPageNumber);
        }
        console.log(typeof pageNumber + pageNumber);

        var userNameAnchor = $('div.postinfo > a')

        if (pageNumber === 1) {
            sessionStorage.setItem('tid' + threadTid, $(userNameAnchor[0]).text());
        }

        var opOfPage = sessionStorage.getItem('tid' + threadTid);
        console.log('楼主是' + opOfPage);

        var opStr = '<div style="padding:0px 5px; border-radius:2px; margin-left:6px; display: inline-block;background-color:#3890ff;color:#fff">楼主</div>'


        userNameAnchor.each(function () {
            if ($(this).text() == opOfPage) {
                $(this).after(opStr);
            }

        })





    }
}


//屏蔽BS版置顶帖
function removeBSstickthreads(url) {
    if (url.indexOf('fid=6') > 0) {
        $('tbody[id^="stickthread"]').hide()
    }
}


//黑名单屏蔽功能
function block(url, blacklist, uidblacklist) {
    //帖子列表页面屏蔽
    if (url.indexOf('fid=') > 0) {
        var authorList = $('.author>cite>a')
        $(authorList).each(function () {
            var userName = $(this).text();
            var useruid = $(this).attr('href').split('uid=')[1];
            if (blacklist.indexOf(userName) > -1) {
                $(this).parents('tbody').hide();
                console.log(userName + ' has been blocked');
            }

            if (typeof uidblacklist !== 'undefined') {
                if (uidblacklist.indexOf(useruid) > -1) {
                    $(this).parents('tbody').hide();
                    console.log(userName + ' has been blocked');
                }
            }


        });
    }

    //帖子内容页面屏蔽
    if (url.indexOf('tid') > 0) {
        var postList = $('.mainbox>div')
        $(postList).each(function () {
            var userName = $('.postinfo>a', this).text()
            // console.log(userName);
            if (userName == '') {
                return;
            }
            var useruid = $('.postinfo>a', this).attr('href').split('uid=')[1];
            if (blacklist.indexOf(userName) > -1) {
                $(this).hide();
                console.log(userName + ' has been blocked');
            }
            if (typeof uidblacklist !== 'undefined') {
                if (uidblacklist.indexOf(useruid) > -1) {
                    $(this).hide();
                    console.log(userName + ' has been blocked');
                }
            }



        });
    }
}

//在帖子内容页面id信息栏添加加入黑名单按钮
function addToBlackList(url) {
    if (url.indexOf('tid') > 0) {
        $('li.buddy').each(function () {

            var postauthor = $(this).parents('.postauthor');
            var userName = $('.postinfo>a', postauthor).text();
            // console.log(userName);
            var listr = "<li style='background-image: url(/forum/images/icons/icon11.gif);'><a href='javascript:void(0)' class='block_it' title='加入黑名单'"
                + "usernamestr=\"" + userName + "\">加黑名单</a></li>"
            $(this).after(listr);
        })

        var formhashstr = $('#umenu > a:nth-child(8)').attr('href').split('formhash=')[1]
        $('.block_it').click(function () {
            var name = $(this).attr('usernamestr');
            var confirm_msg = confirm("您确认将 " + name + " 加入黑名单么？\n刷新页面生效");
            var addblockurl_raw = 'https://www.hi-pda.com/forum/pm.php?action=addblack&formhash=' + formhashstr + '&user=' + name;
            console.log(addblockurl_raw)
            var addblockurl_encoded = GBK.URI.encodeURI(addblockurl_raw);
            if (confirm_msg == true) {
                $.get(addblockurl_encoded, function () {
                    //给background.js发消息,执行重新获取黑名单动作
                    chrome.runtime.sendMessage({ command: 'refresh_blacklist' });
                });

            }
        })
    }
}

//不再使用,因为会导致页面闪烁问题
// function changePageWidth(newWidth){
//     $('body').css('margin','0 auto').css('width',newWidth);
// }




//脚本主入口,页面加载时执行
//脚本主入口,页面加载时执行
//脚本主入口,页面加载时执行
$(function () {
    var urlOfPage = window.location.href;
    //增加顶部菜单快捷入口
    addShortcut();
    pagePreview();


    chrome.storage.sync.get('extentionConfig', function (obj) {
        reviveFullSearch(urlOfPage);
        if (typeof obj.extentionConfig == 'undefined') {
            chrome.storage.sync.set({ 'extentionConfig': defaultConfig });
            removeBSstickthreads(urlOfPage);
            //通过chrome.storage获取黑名单,进行屏蔽功能
            chrome.storage.local.get('blacklist', function (result) {
                // console.log('黑名单数据: ' + result.blacklist);
                block(urlOfPage, result.blacklist, result.uidblacklist);
            });

            //用户手动添加黑名单
            addToBlackList(urlOfPage);

            //好孩子看得见(显示白色隐藏内容)
            goodboyCanSee(urlOfPage);

            //高亮楼主ID
            hightlightOP(urlOfPage);

        }



        if (typeof obj.extentionConfig !== 'undefined') {
            currentConfig = obj.extentionConfig;
            if (currentConfig.enableBlacklist) {
                //通过chrome.storage获取黑名单,进行屏蔽功能
                chrome.storage.local.get(['blacklist', 'uidblacklist'], function (result) {
                    // console.log('黑名单数据: ' + result.blacklist);
                    block(urlOfPage, result.blacklist, result.uidblacklist);
                });
                //用户手动添加黑名单
                addToBlackList(urlOfPage);

            }

            if (currentConfig.goodboySee) {
                //好孩子看得见(显示白色隐藏内容)
                goodboyCanSee(urlOfPage);


            }

            if (currentConfig.blockBSTop) {
                removeBSstickthreads(urlOfPage);
            }

            if (currentConfig.highlightOP) {
                //高亮楼主ID
                hightlightOP(urlOfPage);
            }

            if (currentConfig.pageWidth != '100%') {
                localStorage.setItem('pagewidth', currentConfig.pageWidth);
            }

            if (currentConfig.pageWidth == '100%') {
                localStorage.removeItem('pagewidth');
            }

            if (currentConfig.enableShortcut) {
                localStorage.setItem('enableshortcut', 'enable');
            }

            if (!currentConfig.enableShortcut) {
                localStorage.removeItem('enableshortcut');
            }






        }



    });



});


