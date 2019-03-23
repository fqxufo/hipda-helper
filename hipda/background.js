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
      // console.log(gbkusername);

      try {
        decodedusername = GBK.URI.decodeURI(gbkusername);
      }
      catch (error) {
        console.log('不支持繁体字ID')
        infoUrl = 'https://www.hi-pda.com/forum/space.php?username=' + gbkusername;
        $.get(infoUrl, function (infopage) {
          console.log(infopage.match(/eccredit.php\?uid=\d+/));
          var uidurl = infopage.match(/eccredit.php\?uid=\d+/)[0];
          var newuid = uidurl.split('uid=')[1];
          var uidblackarr = [];
          chrome.storage.local.get('uidblacklist', function (result) {
            if (typeof result.uidblacklist == 'undefined') {
              console.log(result.uidblacklist);
              
              
              uidblackarr.push(newuid);
              chrome.storage.local.set({ 'uidblacklist': uidblackarr });
              return;


            }


              uidblackarr = result.uidblacklist;
              if (uidblackarr.indexOf(newuid) == -1){

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

setInterval(getBlackList, 60 * 1000);
getBlackList();



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //新加入黑名单会触发重新获取黑名单动作
  if (request.command == 'refresh_blacklist') {
    getBlackList();
  }
});




