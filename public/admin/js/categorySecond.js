$(function () {
    /*模板无法访问外部变量的解决方案*/
    /*var getJquery = function () {
        return jQuery;
    }*/
    /*辅助方法：在模板内部可以使用的函数*/
    template.helper('getJquery', function () {
        return jQuery
    })

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

    // 3.1、显示模态框
    $('#addBtn').on('click', function () {
        $('#addModal').modal('show')
    })
    initDropDown()
    initUpLoad()
    
    // 3.2、进行表单校验--代码copy修改
    $("#save #form").bootstrapValidator({
        /*校验插件默认会忽略  隐藏的表单元素 */
        excluded: [],   
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        live: 'enabled',
        fields:{
            categoryId:{
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
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
                trigger:"change", 
                validators: {
                    notEmpty: {
                        message: '请上传二级分类Logo'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        /*提交数据了*/
        var $form = $(e.target)
        // 验证数据传值
        var dataObj = {
            categoryId: window.cateId,
            brandName: $.trim($("[name='brandName']").val()),
            brandLogo: $.trim($('[name="brandLogo"]').val()),
            hot: 0       
        }
        // console.log(dataObj)

        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: dataObj,
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
                    $('[name="categoryName"]').html('请选择')
                    $.trim($("[name='brandName']").val())
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
        url: "/category/queryTopCategoryPaging",
        data: {
            page: 1,
            pageSize: 100
        },
        dataType: "json",
        success: function (res) {
            $('.dropdown-menu').html(template('dropDown', res)).find('li').on('click', function () {
                // 显示选中的分类名称-同时要把id值给input 这样才能达到目的
                $('.categoryName').html($(this).find('a').html())
                $('[name=categoryId]').val($(this).find('a').attr('data-id'))
                // 上传的不是分类 而是分类所属的id
                window.cateId = $(this).find('a').attr('data-id')
                // 和上传业务一样 改变状态
                $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID')
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
            $('[name="brandLogo"]').val(data.result.picAddr).change()   //图片上传成功后 后台返回来的图片路径  前后台要约定好
            // 选择的时候应该改变校验状态 否则即使点击了还是（×）
            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')
        }
    })
}

