$(function () {
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

    // 3.2、进行表单校验--代码copy修改
    $("form").bootstrapValidator({
        /*校验插件默认会忽略  隐藏的表单元素
        不忽略任何情况的表单元素*/
        excluded:[],
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
                brandName:{
                    validators: {
                        notEmpty: {
                            message: '请输入二级分类名称'
                        }
                    }
                },
                brandLogo:{
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
        var $form = $(e.target);
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                if(data.success){
                    /*关闭模态框*/
                    $('#addModal').modal('hide');
                    /*渲染第一页*/
                    currPage = 1;
                    render();
                    /*重置表单数据和校验样式*/
                    $form[0].reset();
                    $form.data('bootstrapValidator').resetForm();
                    $('.dropdown-text').html('请选择');
                    $form.find('img').attr('src','images/none.png');
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
        success: function (data) {
            callback && callback(data);
        }
    });
}


