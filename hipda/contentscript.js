$(function(){
    $('#wrap > form > label').text('fuck yeah');

    $('#wrap > form > p.searchkey > select').append($('<option>', {
        value: 'fulltext',
        text: '全文'
    }));

    url = GBK.URI.encodeURI('https://www.hi-pda.com/forum/pm.php?action=delblack&formhash=08f55da1&user=德味儿');
    console.log(url);
    // $.get(url);
    url2 = 'https://www.hi-pda.com/forum/pm.php?action=addblack&formhash=08f55da1&user=uglee';
    console.log(url2);
    // $.get(url2);
})