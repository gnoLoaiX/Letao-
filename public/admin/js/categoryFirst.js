$(function () {
    // currPage 页码
    var currPage = 1
    // 1、渲染用户数据
    var render = function () {
        var dataObj = {
            page: currPage,
            pageSize: 5
        }
        getCategoryFirstData(dataObj, function (data) {
            $('tbody').html(template('template', data))
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

    // 3、点击添加 一级分类功能
    // 3.1、显示模态框
    $('#addBtn').on('click', function () {
        $('#addModal').modal('show')
    })
    // 3.2、进行表单校验--代码copy修改
    //初始化验证规则
    $("form").bootstrapValidator({
        // 设置验证通过和不通过的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /* 生效规则
         * enabled:字段值发生变化就触发验证
         * disabled/submitted:点击提交时触发验证
         */
        live: 'enabled',
        // 表单域配置--是用来设置from中具体的表单元素验证的
        fields: {
            // categoryName为input标签name值
            categoryName: {
                validators: {
                    //非空提示
                    notEmpty: {
                        message: '一级分类名称不能为空'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        // 阻止默认事件提交（重复提交的bug）为BootstrapValidator设置on方法，其key为success.form.bv，value为e.preventDefault();
        e.preventDefault()

        /*如果点击需要校验  点击的按钮必须是提交按钮  并且和当前表单关联*/
        /*校验成功后的点击事件  完成数据的提交*/
        // console.log(e.target)
        var $form = $(e.target).serialize()
        addCategoryFirstData($form, function (data) {
            /*关闭模态框*/
            $('#addModal').modal('hide')
            /*渲染第一页*/
            currPage = 1
            render()
            /*重置表单*/
            $(e.target).data('bootstrapValidator').resetForm()
            $(e.target).find('input').val('')
        })

    })
})

// 查询1级分类列表（需要登录）
var getCategoryFirstData = function (params, callback) {
    $.ajax({
        type: "get",
        url: "/category/queryTopCategoryPaging",
        data: params,
        dataType: "json",
        success: function (response) {
            callback && callback(response)
        }
    })
}

// 添加1级分类 （需要登录）
var addCategoryFirstData = function (params, callback) {
    $.ajax({
        type: "post",
        url: "/category/addTopCategory",
        data: params,
        dataType: "json",  // 少些dataType，或者写错了
        success: function (response) {
            if (response.success) {
                callback && callback(response)
            }
        }
    });
}