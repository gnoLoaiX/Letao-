/**
 * Created by 20189 on 2019/1/19.
 */
$(function () {
    /* 1.首屏渲染列表 */
    /* 获取/渲染 */
    var historyList = getHistoryData()
    $('.lt_history').html(template('historyTpl', { list: historyList }))
    $('.search_input').val('');

    /*2点击搜索*/
    $('.search_btn').on('tap', function () {
        /*获取关键字--保存在本地 并且携带在URL中传值*/
        var key = $.trim($('.search_input').val());
        /*如果用户没有输入*/
        if (!key) {
            /*提示*/
            mui.toast('请输入关键字');
            return false;
        }
        /*记录这一次的搜索*/
        var arr = getHistoryData();
        /*2.1 在正常的10条记录内 正常添加*/
        /*2.2 已经10条记录了    添加一条 并且 删除最早的一条 */
        /*2.3 如果有相同记录    添加一条 并且 删除相同的一条 */
        /*是否有相同数据*/
        var isHave = false;
        var haveIndex;
        for (var i = 0; i < arr.length; i++) {        // ==> ["xx", "xxx", "x"]
            if (key == arr[i]) {
                isHave = true;
                haveIndex = i;
                break;
            }
        }
        if (isHave) {
            /*3.如果有相同记录 那么同样要显示 */
            arr.push(key);
            /*删除*/
            arr.splice(haveIndex, 1);
        } else {
            if (arr.length < 10) {
                arr.push(key);
            } else {
                /*已经10条记录*/
                arr.push(key);
                arr.splice(0, 1);
            }
        }
        /*存起来*/
        localStorage.setItem('leTaoHistory', JSON.stringify(arr));
        /*跳转搜索列表*/
        location.href = 'searchList.html?key=' + key;
    });

    /*3.删除记录
     3.1--获取索引，根据获取的数据利用索引删除数据，由于数据是存储在localStorage 要想操作得反序列化 操作完数据后，要想保存数据得转序列化，然后实际上要在页面上显示，得重新渲染。*/
    $('.lt_history').on('tap', '.mui-icon', function () {
        var index = $(this).attr('data-index');
        var arr = getHistoryData();
        console.log(arr)
        arr.splice(index, 1);
        localStorage.setItem('leTaoHistory', JSON.stringify(arr));
        $('.lt_history').html(template('historyTpl', { list: arr }));
    });

    // 4.清空记录
    $(".lt_history").on("tap", ".fa", function () {
        localStorage.setItem("leTaoHistory", "")
        $('.lt_history').html(template('historyTpl', { list: "" }))
    })
})

/*获取存储数据的封装*/
/*1.约定一个键  leTaoHistory 值存的是json格式的字符串*/
/*2.通过这个键获取值 如果有就使用 如果没有默认空数组的字符串*/
/*3.转成成js数据*/
/*4.返回js可操作的数组*/
var getHistoryData = function () {
    var str = localStorage.getItem("leTaoHistory") || "[]"
    var arr = JSON.parse(str)
    return arr
}
