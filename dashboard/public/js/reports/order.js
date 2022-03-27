var orderType = "all"
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null) {  // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/order/${type}/listreport?from=${from}&to=${to}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.order_id}">
            <th scope="row">${elem.order_id}</th>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            <td><a href="/dashboard/user/edit/${elem.user_id}" class="btn btn-link text-dark">${elem.user_name}</a></td>
            <td><span class="text-primary"><i class="fas fa-credit-card"></i>&emsp;${elem.pay_type}</span></td>
            <td>${elem.all_sum} SAR</td>
            <td>${elem.promo_code_percent || 0} %</td>
            <td><span class="text-success">${elem.all_sum * (elem.promo_code_percent ? elem.promo_code_percent / 100 : 1)} SAR</span></td>
            </tr>`)
        })
    }).fail(() => spinnerNotfound(3))
}


function changeType(type) {
    getList(type, fromOrder, toOrder)
    orderType = type
}
// function fromToFunc() {
//     getList(orderType, toOrder, fromOrder)
// }

function spinnerNotfound(action) {
    // 1 => Show Spinner
    // 2 => Hidden Spinner
    // 3 => Notfound
    if (action == 1) {
        $("#tabe-items").hide();
        $("#spinner-notfound>div").html(`<div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div>`);
        $("#spinner-notfound").show();
    } else if (action == 2) {
        $("#spinner-notfound").hide();
        $("#tabe-items").show();
    } else if (action == 3) {
        $("#tabe-items").hide();
        $("#spinner-notfound>div").html(`<p>Not found items</p>`);
        $("#spinner-notfound").show();
    }
}