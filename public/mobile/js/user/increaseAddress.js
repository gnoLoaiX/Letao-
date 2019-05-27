$(function () {

    // 由于addressManage 收货地址管理的特殊性 点击地址框会跳转到修改收货地址页面，同时增加收货地址和它是一样页面 没有必要再重新写另外一个页面。怎么重复使用呢？将使用地址传参 和不传参 来判定-下面是代码
    var addressId = location.search
    addressId = addressId && addressId.split('=')
    addressId = addressId && addressId[1]

    // 传入了数据 说明是修改收货地址页面
    if (addressId) {
        $('header h3').text('修改收货地址')
        // 渲染历史收货地址信息给用户 使之能修改
        getAddressData(function (data) {
            var historyAdd = LT.getItemById(data, addressId)
            $('[name="recipients"]').val(historyAdd.recipients);
            $('[name="postCode"]').val(historyAdd.postCode);
            $('[name="address"]').val(historyAdd.address);
            $('[name="addressDetail"]').val(historyAdd.addressDetail);
        })
    } else {
        $('header h3').text('添加收货地址')
    }

    // 点击确认按钮
    $(document).on('tap', '.btn_submit', function () {
        // 为方便Ajax传值 和 校验数据
        var dataObj = {
            recipients: $.trim($('[name=recipients]').val()),
            postcode : $.trim($('[name=postCode]').val()),
            address: $.trim($('[name=address]').val()),
            addressDetail: $.trim($('[name=addressDetail]').val())
        }
        if (!dataObj.recipients) {
            mui.toast('请输入收货人'); return false;
        } else if (!dataObj.postcode) {
            mui.toast('请输入邮编'); return false;
        } else if (!/^\d{6}$/.test(dataObj.postcode)) {
            mui.toast('请输入合法邮编'); return false;
        } else if (!dataObj.address) {
            mui.toast('请选择省市区'); return false;
        } else if (!dataObj.addressDetail) {
            mui.toast('请输入详细地址'); return false;
        }

        // 如果是添加收货地址 同样也是修改完跳转到收货地址管理 addressManage.html的页面
        var editUrl = '/address/addAddress'
        var tip = '添加'
        if (addressId) {
            editUrl = '/address/updateAddress'
            tip = '修改'
            dataObj.id = addressId
        }
        addAddress(dataObj, editUrl, function () {
            $('.btn_submit').text(tip + '成功')
            location.href = 'addressManage.html'
        })
    }).on('tap', '[name=address]', function () {
        // 点击城市选择
        var cityPicker = new mui.PopPicker({
            // 三级联动
            layer: 3
        })
        cityPicker.setData(cityData)
        cityPicker.show(function (items) {
            if (items[0].text == items[1].text) {
                items[0].text = ''
            }
            $('[name="address"]').val(items[0].text + items[1].text + (items[2].text || ''))
            //返回 false 可以阻止选择框的关闭
        })
    })

})

// 封装添加收货地址-修改收货地址 Ajax请求
var addAddress = function (dataObj, url, callback) {
    LT.loginAjax({
        type: "post",
        url: url,  // url 业务逻辑处理
        data: dataObj,
        dataType: "json",
        success: function (response) {
            // console.log(response)    // => {success: true}
            callback && callback(response) // it means=> if(callback) { callback(response); }
        }
    })
}

// 添加完地址 重新渲染列表数据
var getAddressData = function (callback) {
    LT.loginAjax({
        type: "get",
        url: "/address/queryAddress",
        data: " ",
        dataType: "json",
        success: function (response) {
            callback && callback(response)
        }
    })
}

// 关于callback: 首先，它检查以确保callback定义（更准确地说，它是一个真正的值）。然后，如果是，则调用该函数。这在定义采用可选回调的函数时很有用。这是检查是否实际给出回调的简便方法。
// About callback: First it checks to ensure that callback is defined (more accurately, that it is a truthy value). Then, if it is, it calls that function.This is useful when defining a function that takes an optional callback. It's a shorthand way of checking if a callback was actually given.