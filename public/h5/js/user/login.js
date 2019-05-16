$(function () {

    $("#submit").on("tap", function () {
        // 序列化表单 form需要name值
        // serialize() 方法通过序列化表单值，创建 URL 编码文本字符串。 
        // data type string "key=value&k=v" ====>转换成对象  {key:value,k:v} 
        var getForm = $("form").serialize()
        var getForm2Obj = LT.serialize2object(getForm)

        if (!getForm2Obj.username) {
            mui.toast('请您输入用户名')
            return false
        }
        if (!getForm2Obj.password) {
            mui.toast('请您输入密码')
            return false
        }

        LT.loginAjax({
            type: "post",
            url: "/user/login",
            data: getForm2Obj,
            dataType: "json",
            success: function (data) {
                /*如果成功 根据地址跳转*/
                /*如果没有地址 默认跳转个人中心首页*/
                if (data.success == true) {
                    var returnUrl = location.search.replace('?returnUrl=','')
                    if (returnUrl) {
                        location.href = returnUrl
                    } else {
                        location.href = LT.userUrl
                    }
                } else {
                    mui.toast(data.message)
                }
            },
            error: function () {
                mui.toast("服务器繁忙")
            }
        });
    })

    // 点击更多弹出mui actionsheet（操作表）
    $('.btn').on('tap', function () {
        mui('#sheet1').popover('toggle')   
    })
})