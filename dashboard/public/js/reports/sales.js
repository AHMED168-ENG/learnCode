var userType = "all"
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null) {  // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/order/completed/listreport?from=${from}&to=${to}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem, i) => {
            $("#tr-th-row").append(`<tr id="${elem.order_id}">
            <th scope="row">${i + 1}</th>
            <td><a href="/dashboard/user/edit/${elem.user_id}" class="btn btn-link text-dark">${elem.user_name}</a></td>
            <td class="text-center"><a href="/dashboard/order/view/${elem.order_id}" data-tooltip="View order">${elem.order_id}</a></td>
            <td class="text-danger">${elem.all_sum * (elem.promo_code_percent ? elem.promo_code_percent / 100 : 0)} SAR</td>
            <td><span class="text-success">${elem.all_sum - (elem.all_sum * (elem.promo_code_percent ? elem.promo_code_percent / 100 : 0))} SAR</span></td>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            </tr>`)
        })
        const sum = res.data.reduce((a, b) => a + (b.all_sum - (b.all_sum * (b.promo_code_percent ? b.promo_code_percent / 100 : 0))), 0)
        $("#tr-th-row").append(`<tr>
        <th scope="row"></th><td></td><td></td><td></td>
        <td class="text-center"><strong>${sum} SAR</strong></td>
        <td></td>
        </tr>`)
    }).fail(() => spinnerNotfound(3))
}

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