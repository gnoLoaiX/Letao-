$(function () {
    /*模板无法访问外部变量的解决方案*/
    /*var getJquery = function () {
        return jQuery;
    }*/
    /*辅助方法：在模板内部可以使用的函数*/
    template.helper('getJquery', function () {
        return jQuery
    })

    // currPage 页码
    var currPage = 1
    // 1、渲染用户数据
    var render = function () {
        var dataObj = {
            page: currPage,
            pageSize: 5
        }
        getCategorySecondData(dataObj, function (data) {
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

    // 3、点击添加 二级分类功能
    // 3.1、显示模态框
    $('#addBtn').on('click', function () {
        $('#addModal').modal('show')
    })
    initDropDown()
    initUpLoad()

    // 3.2、进行表单校验--代码copy修改
    $("form").bootstrapValidator({
        /*校验插件默认会忽略  隐藏的表单元素
        不忽略任何情况的表单元素*/
        excluded: [],
        // 设置验证通过和不通过的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
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
                },
                brandName: {
                    validators: {
                        notEmpty: {
                            message: '请输入二级分类名称'
                        }
                    }
                },
                brandLogo: {
                    validators: {
                        notEmpty: {
                            message: '请上传二级分类Logo'
                        }
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        /*提交数据了*/
        var $form = $(e.target)
        // var dataObj = {
        //     categoryId: window.categoryId,
        //     brandName: $.trim($("[name='brandName']").val()),
        //     brandLogo: $.trim($('[name="brandLogo"]').val()),
        //     hot: 0
        // }
        // console.log(dataObj.categoryId +'======'+ dataObj.brandName)

        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: {
                categoryId: window.categoryId,
                brandName: $.trim($("[name='brandName']").val()),
                brandLogo: $.trim($('[name="brandLogo"]').val()),
                hot: 0
            },
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    /*关闭模态框 渲染第一页*/
                    $('#save').modal('hide')
                    currentPage = 1
                    render()
                    /*重置表单*/
                    $form.data('bootstrapValidator').resetForm()
                    $form.find('input').val('')
                    $('.dropdown-text').html('请选择')
                    $form.find('img').attr('src','images/none.png')
                }
            }
        })
    })
})

// 获取二级分类分页数据
var getCategorySecondData = function (params, callback) {
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategoryPaging',
        data: params,
        dataType: 'json',
        success: function (res) {
            callback && callback(res);
        }
    })
}

// 下拉选择
var initDropDown = function () {
    var $dropDown = $('#dropdownMenu1')
    $.ajax({
        type: "get",
        url: "/category/querySecondCategoryPaging",
        data: {
            page: 1,
            pageSize: 100
        },
        dataType: "json",
        success: function (res) {
            $('.dropdown-menu').html(template('dropDown', res)).find('li').on('click', function () {
                // 显示选中的分类名称
                $('.categoryName').html($(this).find('a').html())
                window.categoryId = $(this).find('a').attr('data-id')
            })
        }
    })
}
// 图片上传
var initUpLoad = function () {
    $('[name="pic1"]').fileupload({
        /*上传地址*/
        url: '/category/addSecondCategoryPic',
        /*返回格式*/
        dataType: 'json',
        /*上传成功*/
        done: function (e, data) {
            $('#uploadImage').attr('src', data.result.picAddr) //动态修改预览图的src
            $('[name="brandLogo"]').val(data.result.picAddr)   //图片上传成功后 后台返回来的图片路径  前后台要约定好
            // $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')
        }
    })
}

