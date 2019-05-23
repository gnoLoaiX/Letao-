$(function () {
    // 1、请求进度条显示-jQueryajaxStart方法
    NProgress.configure({
        showSpinner: false
    })
    $(window).ajaxStart(function () {
        NProgress.start()
    }).ajaxStart(function () {
        NProgress.done()
    })
    // 2、菜单显示隐藏
    $('[data-menu]').on('click', function () {
        $('.ad_aside').toggle()
        // 但是按照上面的写的话 菜单点击会出现空白区域，没有达到流式的效果
        $('.ad_section').toggleClass('menu')
    })
    // 3、二级菜单的显示和隐藏
    $('.menu [href="javascript:;"]').on('click', function () {
        $(this).siblings('.child').toggle()
    })

    // 4、退出功能
    $('[data-logout]').on('click', function () {
        // 4.1、准备模态框--bootstrap的javascrpt组件 追加到页面中去、配置显示
        var logoutModal = 
            '<div class="modal fade" id="logoutModal">'+
                '<div class="modal-dialog modal-sm">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header">'+
                            '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>'+
                            '<h4 class="modal-title">温馨提示</h4>'+
                        '</div>'+
                        '<div class="modal-body">'+
                            '<p class="text-danger"><span class="glyphicon glyphicon-info-sign"></span> 您确定要退出后台管理系统吗？</p>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                            '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
                            '<button type="button" class="btn btn-primary">确定</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
        $('body').append(logoutModal)
        // $('#logoutModal') 追加之后显示的id
        $('#logoutModal').modal('show')

        // 4.2、提交Ajax请求
        $('#logoutModal').on('click','.btn-primary',function () {
            $.ajax({
                type: "get",
                url: "/employee/employeeLogout",
                data: "",
                dataType: "json",
                success: function (response) {
                    if(response.success) {
                        location.href = 'login.html'
                    }
                }
            })
        })
    })
})