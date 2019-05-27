// 暴露window对象
window.LT = {}

// 封装获取 URL 地址代码
LT.getParamsByUrl = function () {
    var params = {}
    var search = location.search
    if (search) {
        // 如果有多个键值对 那么是以 "&" 为连接的
        search = search.replace("?", "").split("&")
        search.forEach((item, i) => {
            var arr = item.split("=")
            params[arr[0]] = arr[1]
        })
    }
    // console.log(params)  // => {}
    return params
}

// 封装需要登录的ajax请求--做登录拦截
LT.loginUrl = '/h5/user/login.html'
LT.cartUrl = '/h5/user/cart.html'
LT.userUrl = '/h5/user/userIndex.html'
LT.loginAjax = function (params) {
    $.ajax({
        url: params.url || "#",
        type: params.type || "get",
        data: params.data || "",
        dataType: params.dataType || "json",
        success: function (data) {
            if (data.error == 400) {
                // => {error: 400, message: "未登录！"}
                /* 跳到登录页 把当前地址传递给登录页面 当登录成功按照这个地址跳回来 另外不跳转到购物车页 */
                location.href = LT.loginUrl + "?returnUrl=" + location.href
                return false
            } else {
                params.success && params.success(data)
            }
        },
        error: function () {
            mui.toast("服务器繁忙")
        }
    })
}

// 序列化表单值转对象
LT.serialize2object = function (serializeStr) {
    var obj = {}
    if (serializeStr) {
        var arr = serializeStr.split("&")   // => ["username=", "password="]
        arr.forEach(function (item, i) {
            var itemArr = item.split("=")
            obj[itemArr[0]] = itemArr[1]
        })
    }
    return obj
}

// 获取接口数据中id的数据 和传值的id 一致
LT.getItemById = function (arr, id) {
    var obj = null
    arr.forEach(function (item, i) {
        if (item.id == id) {
            obj = item
        }
    })
    return obj
}