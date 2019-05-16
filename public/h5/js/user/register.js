$(function () {
    // 点击注册
    $('.btn_register').on('tap', function () {
        // 为方便Ajax传值 和 校验数据
        var dataObj = {
            username:$.trim($('[name=username]').val()),
            mobile:$.trim($('[name=mobile]').val()),
            password:$.trim($('[name=pass]').val()),
            rePass:$.trim($('[name=rePass]').val()),
            vCode:$.trim($('[name=code]').val())
        }

        // 校验必填项
        if(!dataObj.username){
            mui.toast('请输入用户名');
            return false;
        }else if(!dataObj.mobile){
            mui.toast('请输入手机号');
            return false;
        }else if(!/^1\d{10}$/.test(dataObj.mobile)){
            mui.toast('请输入合法手机号');
            return false;
        }else if(!dataObj.password){
            mui.toast('请输入密码');
            return false;
        }else if(!dataObj.rePass){
            mui.toast('请再次输入密码');
            return false;
        }else if(dataObj.password != dataObj.rePass){
            mui.toast('密码需要一致');
            return false;
        }else if(!dataObj.vCode){
            mui.toast('请输入验证码');
            return false;
        }else if(!/^\d{6}$/.test(dataObj.vCode)){
            mui.toast('请输入合法验证码');
            return false;
        }

        // 注册业务
        LT.loginAjax({
            type: "post",
            url: "/user/register",
            data: dataObj,
            dataType: "json",
            success: function (response) {
                if(response.success){
                    mui.toast('注册成功！')
                    location.href = LT.userUrl
                }else{
                    mui.toast(response.message)
                    $('.btn_register').html('注册')
                }
            }
        })

    })

    // 点击获取验证码
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