$(function () {
    // currPage 页码
    var currPage = 1
    // 1、渲染用户数据
    var render = function () {
        var dataObj = {
            page: currPage,
            pageSize: 5
        }
        getProductData(dataObj, function (data) {
            // 1.1、列表渲染
            $('tbody').html(template('template', data))
            // 1.2、分页展示渲染
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
    initUpload()
    // 3、上架和下架功能
    // updateProductData()

    // 4、添加功能 参考二级分类
    $('#addBtn').on('click', function () {
        $('#editModal').modal('show');
    })
    // 4.1 自定义表单验证规则
    // $.fn.bootstrapValidator.validators.xxx 由 下面的bootstrapValidator主体定义
    $.fn.bootstrapValidator.validators.checkNum = {
        validate: function (validator, $field, options) {
            // 表单输入的值
            // var value = $field.val();
            var value = $.trim($field.val())
            if (!value) {
                return {
                    valid: false,
                    message: '请输入商品库存'
                }
            }
            if (!/^[1-9]\d*$/.test(value)) {
                return {
                    valid: false,
                    message: '请输入合法商品库存'
                }
            }
            return true
            /*规则：如果 返回true 代ll表校验成功*/
            /*规则：如果 返回false 代表校验失败*/
            /*规则：如果 返回false 自定义提示  ｛valid:false,message:'提示'｝*/
        }
    }
    $.fn.bootstrapValidator.validators.checkPic = {
        validate: function (validator, $field, options) {
            if (picList.length != 3) {
                return {
                    valid: false,
                    message: '请上传三张图片'
                }
            }
            return true
        }
    }
    // 4.2 表单验证
    $('#form').bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*设置校验属性*/
        fields: {
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    /*自定义校验规则*/
                    checkNum: {}
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品价格'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    }
                }
            },
            pic: {
                validators: {
                    checkPic: {}
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault()

        var $form = $(e.target) 
        // console.log(e.target)   // => form{action="#"…}
        var dataObj = {
            proName: $.trim($("[name='proName']").val()),
            oldPrice: $.trim($("[name='oldPrice']").val()),
            price: $.trim($("[name='price']").val()),
            proDesc: $.trim($("[name='proDesc']").val()),
            size: $.trim($("[name='size']").val()),
            statu: 1,
            num: $.trim($("[name='num']").val()),
            brandId: 1
        }
        $.ajax({
            type: "post",
            url: "/product/addProduct",
            data: dataObj,
            dataType: "json",
            success: function (res) {
                console.log(res)
                if (res.success) {
                    // 关闭模态框-重新渲染
                    $('#editModal').modal('hide')
                    currPage = 1
                    render()
                    /*重置表单数据和校验样式*/
                    $form.data('bootstrapValidator').resetForm()
                    $form.find('img').remove()
                    $form[0].reset()
                }
            }
        })
    })
})

// 产品列表查询（需要登录）
var getProductData = function (params, callback) {
    $.ajax({
        type: "get",
        url: "/product/queryProductDetailList",
        data: params,
        dataType: "json",
        success: function (response) {
            // console.log(response)
            callback && callback(response)
        }
    })
}

// 图片上传
var picList = []
var initUpload = function () {
    $('[name="pic1"]').fileupload({
        dataType: 'json',
        done: function (e, data) {
            // console.log(this)
            // console.log($(this)[0])
            if (picList.length < 3) {
                $(this).parent().parent().next().append('<img width="100" height="100" src="' + data.result.picAddr + '"/>')
                picList.push(data.result)  // => {picName:'',picAddr:''}
                /*上传了三张图片 显示合法的提示*/
                if (picList.length == 3) {
                    $('#form').data('bootstrapValidator').updateStatus('pic', 'VALID')
                }
            }
        }
    })
}