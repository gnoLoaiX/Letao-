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

    // 3、上架和下架功能
    // updateProductData()

    // 4、添加功能 参考二级分类
    $('#addBtn').on('click', function () {
        $('#editModal').modal('show');
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

// 产品修改 （需要登录）
// var getProductData = function (params, callback) {
//     $.ajax({
//         type: "post",
//         url: "/product/updateProduct",
//         data: params,
//         dataType: "json",
//         success: function (response) {
//             console.log(response)
//             // callback && callback(response)
//         }
//     })
// }
// getProductData()