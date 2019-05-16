$(function () {
    getUserIndexData(function (data) {
        $('.mui-media-body').html(data.username + '<p class="mui-ellipsis">绑定手机：' + data.mobile + '</p>')
    })

    $(".p20").on('tap', function () {
        getLoginOutData(function (data) {
            if(data.success) {
                console.log(location.href)
                location.href = LT.loginUrl
            }
        })
    })
})

// 获取登录信息--需要登录查看
var getUserIndexData = function (callback) {
    LT.loginAjax({
        type: "GET",
        url: "/user/queryUserMessage",
        data: "",
        dataType: "json",
        success: function (data) {
            callback && callback(data)
        }
    });
}

// 是否退出成功--需要登录查看
var getLoginOutData = function (callback) {
    LT.loginAjax({
        type: "get",
        url: "/user/logout",
        data: "",
        dataType: "json",
        success: function (data) {
            callback && callback(data)
        }
    })
}