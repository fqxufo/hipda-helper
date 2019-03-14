chrome.omnibox.onInputEntered.addListener(
  function(text) {
    // Encode user input for special characters , / ? : @ & = + $ #
    var newURL = 'https://www.hi-pda.com/forum/search.php?srchtype=fulltext&searchsubmit=true&st=on&srchuname=&srchfilter=all&srchfrom=0&before=&orderby=lastpost&ascdesc=desc&srchfid%5B0%5D=all&srchtxt=' + text;
    var encodedurl = GBK.URI.encodeURI(newURL)
    chrome.tabs.create({ url: encodedurl });
  });
