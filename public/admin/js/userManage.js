$(function () {
    // currPage 页码
    var currPage = 1
    // 1、渲染用户数据
    var render = function () {
        var dataObj = {
            page: currPage,
            pageSize: 5
        }
        getUserData(dataObj, function (data) {
            $('tbody').html(template('list', data))
            // 1.1、分页展示渲染
            renderPagiator(data.page, Math.ceil(data.total / data.size), render)
        })
    }; render()

    // 2、抽离业务封装分页展示渲染
    var renderPagiator = function (pageCurr, pageTotal, callback) {
        $('.pagination').bootstrapPaginator({
            /*当前页*/
            currentPage: pageCurr,
            /*一共多少页*/
            totalPages: pageTotal,
            /*配置的字体大小是小号*/
            size: "small",
            /*当前使用的是3版本的bootstrap*/
            bootstrapMajorVersion: 3,
            /* 点击页面事件 点击事件，用于通过Ajax来刷新整个list列表 */
            onPageClicked: function (event, originalEvent, type, page) {
                currPage = page
                callback && callback()
            }
        })
    }

    // 3、禁用、启用用户-委托事件(提高性能)
    $('tbody').on('click', '.btn', function () {
        var dataObj = {
            id: $(this).attr('data-id'),
            isDelete: $(this).hasClass('btn-danger') ? 0 : 1,
            name: $(this).attr('data-name')
        }
        // 显示模态框-因为在页面上做好了 就不用跟common.js一样写在js文件里面 直接调用就可以了
        $('#optionModal').find('strong').html(($(this).hasClass('btn-danger') ? '禁用：' : '启用：') + dataObj.name)
        $('#optionModal').modal('show')
        $('#optionModal').on('click', '.btn-primary', function () {
            updateUser(dataObj, function (data) {
                render()
                $('#optionModal').modal('hide')
            })
        })
    })
})

// 获取用户数据
var getUserData = function (params, callback) {
    $.ajax({
        type: "get",
        url: "/user/queryUser",
        data: params,
        dataType: "json",
        success: function (response) {
            callback && callback(response)
        }
    })
}

// 修改用户数据
var updateUser = function (params, callback) {
    $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: params,
        dataType: "json",
        success: function (response) {
            if(response.success) {
                callback && callback(response)
            }
        }
    })
}