$(function () {
    var id = LT.getParamsByUrl().productId
    getProductData(id, function (data) {
        /*清除加载状态-渲染商品详情页*/
        $('.loading').remove()
        $('.mui-scroll').html(template('detail', data))
        /*轮播图-区域滚动*/
        mui('.mui-slider').slider({
            interval: 2000
        })
        mui('.mui-scroll-wrapper').scroll({
            indicators: false
        })
        /* 1.尺码的选择 */
        $('.btn_size').on('tap', function () {
            $(this).addClass('now').siblings().removeClass('now')
        })
        /* 2.数量选择 */
        $(".p_number span").on("tap", function () {
            var $input = $(this).siblings("input")
            var currNum = $input.val()
            // var maxNum = $input.attr("data-max")  // 注意：在判断的时候会出现问题 currNum >= maxNum 是数字和字符串进行比较的
            var maxNum = parseInt($input.attr("data-max"))
            if ($(this).hasClass("jian")) {
                if (currNum == 0) {
                    return false
                }
                currNum--
            } else {
                if (currNum == maxNum) {
                    // 注意：延时处理--解决tap击穿的bug(消息框点击的时候会消失 如果正好和加号在一块)，也可以改样式使之触及不到 
                    // 但是，click事件就不会有，tap 是封装的(基于touch)，click 是原生的
                    setTimeout(function () {
                        mui.toast("库存不足")
                    }, 100)
                    return false
                }
                currNum++
            }
            $input.val(currNum)
        })

        /* 3.加人购物车 */
        $('.btn_addCart').on("tap", function () {
            /* 数据校验 点击尺码的时候加了now */
            var $sizeTap = $(".btn_size.now")
            if (!$sizeTap) {
                mui.toast('请您选择尺码')
                return false
            }
            // val() 取出来的是值 attr() 取出来的是字符串
            var num = $('.p_number input').val();
            if (num <= 0) {
                mui.toast('请您选择数量');
                return false;
            }

            /* 提交数据 --封装Ajax common.js */
            // $.ajax({
            //     url: "/cart/addCart",
            //     type: "post",
            //     data: {
            //         productId: id,
            //         num: num,
            //         size: $sizeTap.html()
            //     },
            //     dataType: "json",
            //     success: function (data) {
            //         console.log(data)  // => {error: 400, message: "未登录！"}
            //     }
            // })
            LT.loginAjax({
                url: '/cart/addCart',
                type: 'post',
                data: {
                    productId: id,
                    num: num,
                    // html() 获取元素的内容
                    size: $sizeTap.html()
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success == true) {
                        /*弹出提示框*/
                        mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function (e) {
                            if (e.index == 0) {
                                location.href = LT.cartUrl
                            } else {
                                //TODO
                            }
                        })
                    }
                }
            })

        })
    })
})

var getProductData = function (productId, callback) {
    $.ajax({

        url: "/product/queryProductDetail",
        type: "get",
        data: {
            id: productId
        },
        dataType: "json",
        success: function (data) {
            setTimeout(function () {
                callback && callback(data)
            }, 300)
        }
    })
}