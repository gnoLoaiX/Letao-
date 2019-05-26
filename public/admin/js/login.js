$(function () {
    function login() {
        var dataObj = {
            username: $('#username').val(),
            password: $('#password').val()
        }

        // console.log($username)

        if(!dataObj.username) {
            alert('请输入正确的用户名'); return
        } else if(!dataObj.password) {
            alert('请输入正确的密码'); return
        }

        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: dataObj,
            dataType: "json",
            success: function (response) {
                if(response.success) {
                    location.href = 'index.html'
                } else {
                    alert(response.message)
                }
            }
        })
    }

    $('.btn-lg').on('click', function () {
        login()
    })

    $(document).keyup(function (e) { 
        if(e.keyCode == 13) {
            login()
        }
    })
})