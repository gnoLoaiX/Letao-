$(function () {
    // 点击确认修改
    $('.btn_updatePass').on('tap', function () {
         // 为方便Ajax传值 和 校验数据
        var dataObj = {
            oldPassword: $.trim($('[name=oldPassword]').val()),
            newPassword: $.trim($('[name=newPassword]').val()),
            reNewPassword: $.trim($('[name=reNewPassword]').val()),
            vCode: $.trim($('[name=code]').val())
        }

        // 校验必填项
        if (!dataObj.oldPassword) {
            mui.toast('请输入原密码')
            return false
        } else if (!dataObj.newPassword) {
            mui.toast('请输入新密码')
            return false
        } else if (!dataObj.reNewPassword) {
            mui.toast('请再次输入新密码')
            return false
        } else if (!dataObj.newPassword != !dataObj.reNewPassword) {
            mui.toast('密码输入不一致')
            return false
        } else if (!dataObj.vCode) {
            mui.toast('请输入验证码')
            return false
        } else if (!/^\d{6}$/.test(dataObj.vCode)) {
            mui.toast('请输入合法验证码')
            return false
        }

        // 业务逻辑
        LT.loginAjax({
            type: 'post',
            url: '/user/updatePassword',
            data: dataObj,
            dataType: 'json',
            success: function (data) {
                // console.log(data)
                if (data.success) {
                    mui.toast('修改成功')
                    location.href = LT.userUrl
                } else if (data.error) {
                    mui.toast('修改失败,后台接口出错')
                    setInterval(function(){
                        $('.btn_updatePass').html('将回跳页面...')
                        location.href = LT.userUrl
                    }, 2000)
                }
            }
        })
    })

    // 点击获取验证吗码
    $('.btn_getCode').on('tap', function () {
        // 超时获取提示-如果还未到达时间
        var codeBtn = $('.btn_getCode')
        if (codeBtn.hasClass('btn_disabled')) return false

        $.ajax({
            type: "get",
            url: "/user/vCode",
            data: " ",
            dataType: "json",
            success: function (data) {
                console.log(data.vCode)
                mui.toast(data.vCode)
               
                codeBtn.addClass('btn_disabled')
                var time = 60
                codeBtn.html(time + '秒后再获取')
                var timer = setInterval(function () {
                    time--
                    codeBtn.html(time + '秒后再获取')
                    if (time <= 0) {
                        clearInterval(timer)
                        codeBtn.removeClass('btn_disabled').html('获取认证码')
                    }
                }, 1000)
            }
        });
    })
})