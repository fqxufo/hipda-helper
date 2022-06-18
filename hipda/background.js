// 给omnibox添加快捷搜索
chrome.omnibox.onInputEntered.addListener(
  function (text) {
    var newURL = 'https://www.4d4y.com/forum/search.php?srchtype=fulltext&searchsubmit=true&st=on&srchuname=&srchfilter=all&srchfrom=0&before=&orderby=lastpost&ascdesc=desc&srchfid%5B0%5D=all&srchtxt=' + text;
    var encodedurl = GBK.URI.encodeURI(newURL)
    chrome.tabs.create({ url: encodedurl });
  });


//触发checknewpm的ajax
function checkpm() {
  var t = Date.now();
  // console.log(t);
  $.get('https://www.4d4y.com/forum/pm.php?checknewpm=' + t + '&inajax=1&ajaxtarget=myprompt_check');
}

setInterval(checkpm, 10 * 1000);
checkpm();


//清楚badge提示，并延迟定时任务
function dismissNotify() {
  chrome.browserAction.setBadgeText({ text: '' });
  clearInterval(getblackInterval);
  setTimeout(() => {
    getblackInterval = setInterval(getBlackList, 60 * 1000);

  }, 60 * 1000);
}



// 定时获取黑名单,存储在chrome.storage里

var hasnewpm = false;
var hasnewmsg = false;
function getBlackList() {

  //获取消息提醒
  $.get("https://www.4d4y.com/forum/pm.php?action=viewblack", function (data) {

    var arr = [];

    var el = $('<div></div>');
    el.html(data);

    var prompt_pm = $('#prompt_pm', el);
    var prompt_threads = $('#prompt_threads', el);
    if (prompt_pm.length > 0) {
      var newpm = $(prompt_pm).parent().css('display');
      var newmsg = $(prompt_threads).parent().css('display');

      if (!(newpm == 'none')) {
        hasnewpm = true;
        chrome.browserAction.setBadgeText({ text: '1' });
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
      }

      // if (!(newmsg == 'none')) {
      //   hasnewmsg = true;
      //   chrome.browserAction.setBadgeText({text: '1'});
      //   chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
      // }







      if (newpm == 'none') {
        chrome.browserAction.setBadgeText({ text: '' });
      }

      console.log('私信有吗' + !(newpm == 'none'));
      console.log('帖子消息有吗' + !(newmsg == 'none'));
    }

    //获取黑名单


    $('.blacklist  a[class=remove]', el).each(function () {
      var gbkusername = $(this).attr('href').replace('+',' ').split("user=")[1];
      console.log(gbkusername);

      try {
        decodedusername = GBK.URI.decodeURI(gbkusername);
      }
      catch (error) {
        console.log('不支持繁体字ID')
        infoUrl = 'https://www.4d4y.com/forum/space.php?username=' + gbkusername;
        $.get(infoUrl, function (infopage) {
          // console.log(infopage.match(/eccredit.php\?uid=\d+/));
          var uidurl = infopage.match(/eccredit.php\?uid=\d+/)[0];
          var newuid = uidurl.split('uid=')[1];
          var uidblackarr = [];
          chrome.storage.local.get('uidblacklist', function (result) {
            if (typeof result.uidblacklist == 'undefined') {
              // console.log(result.uidblacklist);

              console.log('uidblacklist add' + newuid);
              uidblackarr.push(newuid);

              chrome.storage.local.set({ 'uidblacklist': uidblackarr });
              return;


            }


            uidblackarr = result.uidblacklist;
            if (uidblackarr.indexOf(newuid) == -1) {
              console.log('uidblacklist add' + newuid);

              uidblackarr.push(newuid);
            }
            chrome.storage.local.set({ 'uidblacklist': uidblackarr });


          });
        });

        return;
      }

      arr.push(decodedusername);



    });
    var d = new Date();
    var n = d.toLocaleTimeString();
    chrome.storage.local.set({ 'blacklist': arr });
    console.log(n + arr);

    // chrome.storage.local.get('blacklist', function (result) {
    //   // console.log('Value currently is ' + result.blacklist);
    //   // console.log(result.blacklist.indexOf("夏雪宜"));
    // });

  });
}

var getblackInterval = setInterval(getBlackList, 60 * 1000);
getBlackList();



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //新加入黑名单会触发重新获取黑名单动作
  if (request.command == 'refresh_blacklist') {
    getBlackList();
  }
});


//定时清除uidblacklist
function autoremovechromestorage() {
  chrome.storage.local.remove('uidblacklist', function () {
    console.log('已清除uidblacklist')
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  })
}

setInterval(autoremovechromestorage, 120 * 1000);

autoremovechromestorage();

