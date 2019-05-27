$(function () {
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    })

    getAddressData(function (data) {
        // 对data 进行数据共享 对当前页面有效
        window.data = data
        $('.mui-scroll').html(template('addressTpl', {model: data}))
        // console.log(!window.data)
        // if(!window.data && window.data.length == 2) {
        //     console.log('hehe')
        // }
    })

    // 注册委托事件
    $(document).on('tap', '.mui-btn-red', function () {
        // 根据id删除数据 id怎么获取？可以自定义属性到标签中 通过attr: 设置或返回被选元素的属性值。
        var id = $(this).attr('data-id')
        deleteAddressData(id, function (data) {
            mui.toast('删除成功！')
            // 删除成功后再次渲染列表
            getAddressData(function (data) {
                $('.mui-scroll').html(template('addressTpl', {model: data}))
            })
        })
    })
    
   
})

// 获取用户存储的收货地址（需要登录）
var getAddressData = function (callback) {
    LT.loginAjax({
        type: "get",
        url: "/address/queryAddress",
        data: ' ',
        dataType: "json",
        success: function (response) {
            callback && callback(response)
        }
    })
}

// 删除收货地址（需要登录）
var deleteAddressData = function (id, callback) { 
    LT.loginAjax({
        type: "post",
        url: "/address/deleteAddress",
        data: {id: id},
        dataType: "json", 
        success: function (response) {
            callback && callback(response)
        }
    })
}