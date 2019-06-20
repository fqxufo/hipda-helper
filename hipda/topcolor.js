if (localStorage.getItem('topcolor') == 'on') {
    console.log('帖子热度功能已打开');
    $(
        function () {
    
        $('.threadlist tr').each(function () {
            var num = parseInt($('.nums strong', this).text());
            if (num > 20) {
                $(this).css('background', '#dfd7f7')
            }
            if (num > 50) {
                $(this).css('background', '#bbb3d1')
            }
            if (num > 100) {
                $(this).css('background', '#9d91bc')
            }
            $(this).find("a").attr('target', '_blank');
        });
    });
}
