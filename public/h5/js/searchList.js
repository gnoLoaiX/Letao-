/**
 * Created by 20189 on 2019/1/19.
 */
$(function () {
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true//是否启用回弹
    });
    $('.lt_search a').on('tap', function () {
        var key = $('input').val()
        if (!key) {
            mui.toast('请输入关键字')
            return false;
        }
    });

    /*处理业务逻辑
     *1、把搜索关键字显示在搜索栏里面 在URL地址栏获取
     *2、页面初始化自动加载一次
     *3、用户点击搜索的时候搜索商品 用户再次输入关键字进行搜索
     *4、用户点击排序的时候 根据选项自动排序 
     *5、下拉刷新 重置上拉加载的功能
     *6、上拉刷新（没有数据不加载）*/

    // 1.common.js 封装函数暴露LT对象 对象添加全局方法
    var ulrPramas = LT.getParamsByUrl()
    var $input = $(".lt_search input").val(ulrPramas.key || "")
    // console.log(ulrPramas.value)    

    // 2、页面初始化自动加载一次  
    // getProductListData({
    //     page: 1,
    //     pageSize: 4,
    //     proName: ulrPramas.value
    // }, function (data) {
    //     $('.lt_product').html(template('list', data))
    // })

    // 3、用户点击搜索的时候搜索商品 用户再次输入关键字进行搜索
    $('.lt_search a').on('tap', function () {
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        getProductListData({
            proName: key,
            page: 1,
            pageSize: 4
        }, function (data) {
            /*渲染数据*/
            $('.lt_product').html(template('list', data));
        });
    });

    /*4.用户点击排序的时候  根据排序的选项去进行排序（默认的时候是 降序  再次点击的时候 升序）*/
    $(".lt_order a").on("tap", function () {
        if (!$(this).hasClass("now")) {
            $(this).addClass("now").siblings().removeClass("now").find("span").removeClass('fa-angle-up').addClass('fa-angle-down')
        } else {
            if ($(this).find("span").hasClass("fa-angle-down")) {
                $(this).find('span').removeClass('fa-angle-down').addClass('fa-angle-up')
            } else {
                $(this).find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }
        /*获取当前点击的功能参数  price 1 2 num 1 2*/
        // 获取自定义属性---当前点击状态 那么就不用判断到底是点击了哪个
        var order = $(this).attr("data-order")
        var orderVal = $(this).find("span").hasClass("fa-angle-up") ? 1 : 2
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        var params = {
            proName: key,
            page: 1,
            pageSize: 4
        }
        // 还没有完事  看接口文档说明 要想排序还需要添加参数
        params[order] = orderVal
        getProductListData(params, function (data) {
            /*渲染数据*/
            $('.lt_product').html(template('list', data))
        })
    })

    /*5.用户下拉的时候  根据当前条件刷新 上拉加载重置  排序功能也重置 */
    mui.init({
        pullRefresh: {
            /*下拉容器*/
            container: "#refreshContainer",
            /*下拉*/
            down: {
                /*最近跟新的功能*/
                /*style:'circle',*/
                /*自动加载*/
                auto: true,
                callback: function () {
                    /*组件对象*/
                    var that = this
                    var key = $.trim($input.val())
                    if (!key) {
                        mui.toast('请输入关键字')
                        return false;
                    }

                    /*排序功能也重置*/
                    $('.lt_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down')

                    getProductListData({
                        proName: key,
                        page: 1,
                        pageSize: 4
                    }, function (data) {
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.lt_product').html(template('list', data))
                            /*注意：停止下拉刷新*/
                            that.endPulldownToRefresh()
                            /*上拉加载重置*/
                            that.refresh(true)
                        }, 1000)
                    })
                }
            },
            /*上拉*/
            up: {
                callback: function () {
                    window.page++
                    /*组件对象*/
                    var that = this
                    var key = $.trim($input.val())
                    if (!key) {
                        mui.toast('请输入关键字')
                        return false;
                    }

                    /*获取当前点击的功能参数  price 1 2 num 1 2*/
                    var order = $('.lt_order a.now').attr('data-order');
                    var orderVal = $('.lt_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2
                    /*获取数据*/
                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                        /*排序的方式*/
                    };
                    params[order] = orderVal
                    getProductListData(params, function (data) {
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.lt_product').append(template('list', data))
                            /*注意：停止上拉加载*/
                            if (data.data.length) {
                                that.endPullupToRefresh()
                            } else {
                                that.endPullupToRefresh(true)
                            }
                        }, 1000)
                    })
                }
            }
        }
    });
})
var getProductListData = function (params, callback) {
    $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function (response) {
            /*存当前页码 用于上拉加载取数据*/
            window.page = response.page;
            callback && callback(response)
        }
    })
}