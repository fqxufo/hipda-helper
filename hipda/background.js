// 给omnibox添加快捷搜索
chrome.omnibox.onInputEntered.addListener(
  function (text) {
    var newURL = 'https://www.hi-pda.com/forum/search.php?srchtype=fulltext&searchsubmit=true&st=on&srchuname=&srchfilter=all&srchfrom=0&before=&orderby=lastpost&ascdesc=desc&srchfid%5B0%5D=all&srchtxt=' + text;
    var encodedurl = GBK.URI.encodeURI(newURL)
    chrome.tabs.create({ url: encodedurl });
  });

//定时获取黑名单,存储在chrome.storage里

function getBlackList() {
  $.get("https://www.hi-pda.com/forum/pm.php?action=viewblack", function (data) {

    var arr = [];

    var el = $('<div></div>');
    el.html(data);
    $('.blacklist  a[class=remove]', el).each(function () {
      var gbkusername = $(this).attr('href').split("user=")[1];
      decodedusername = GBK.URI.decodeURI(gbkusername);
      arr.push(decodedusername);



    });
    var d = new Date();
    var n = d.toLocaleTimeString();
    chrome.storage.local.set({'blacklist':arr});
    console.log(n + arr);

    chrome.storage.local.get('blacklist', function(result) {
      console.log('Value currently is ' + result.blacklist);
      console.log(result.blacklist.indexOf("夏雪宜"));
    });

  });
}

setInterval(getBlackList, 10 * 1000);




