$(document).ready(function () {
    getList()
})
function getList(page) {
    var url = new URL(window.location.href);
    var p_param = page ? page : (new URL(location.href)).searchParams.get('p') ? (new URL(location.href)).searchParams.get('p') : 1
    url.searchParams.set("p", p_param); // setting your param
    var newUrl = url.href;
    window.history.pushState({ path: newUrl }, '', newUrl);
    // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/list?limit=6&page=${p_param}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        // hidden spinner
        spinnerNotfound(2)
        pagination(res.pages, res.page)
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
            <td>${elem.all_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SAR</td>
            <td>${elem.promo_code_percent || 0} %</td>
            <td><span class="text-success">${elem.all_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") * (elem.promo_code_percent ? elem.promo_code_percent / 100 : 1)} SAR</span></td>
            <td></td>
            </tr>`)
            if (screenType == "new") {
                $(`#${elem.order_id} td:last`).html(`
                <a href="/dashboard/order/view/${elem.order_id}" data-tooltip="View order" class="btn btn-info"><i class="fas fa-eye"></i></a>
                <button type="button" data-tooltip="Inprogress" onclick='status(${elem.order_id},"inprogress")' class="btn btn-warning"><i class="fas fa-circle-notch"></i></button>
                <button type="button" data-tooltip="Cancelle order" onclick='status(${elem.order_id},"cancelled")' class="btn btn-danger"><i class="fas fa-times-circle"></i></button>`)
            } else if (screenType == "inprogress") {
                $(`#${elem.order_id} td:last`).html(`
                <a href="/dashboard/order/view/${elem.order_id}" data-tooltip="View order" class="btn btn-info"><i class="fas fa-eye"></i></a>
                <button type="button" data-tooltip="Complete" onclick='status(${elem.order_id},"completed")' class="btn btn-success"><i class="fas fa-check-circle"></i></button>
                <button type="button" data-tooltip="Cancelle order" onclick='status(${elem.order_id},"cancelled")' class="btn btn-danger"><i class="fas fa-times-circle"></i></button>`)
            } else if (screenType == "completed") {
                $(`#${elem.order_id} td:last`).html(`
                <a href="/dashboard/order/view/${elem.order_id}" data-tooltip="View order" class="btn btn-info"><i class="fas fa-eye"></i></a>`)
            } else if (screenType == "cancelled") {
                $(`#${elem.order_id} td:last`).html(`
                <a href="/dashboard/order/view/${elem.order_id}" data-tooltip="View order" class="btn btn-info"><i class="fas fa-eye"></i></a>`)
            }
        })
    }).fail(() => spinnerNotfound(3))
}
function pagination(total, startPage) {
    $("#pagination-demo").twbsPagination({
        startPage: startPage,
        currentPage: 2,
        totalPages: total,
        visiblePages: 7,
        onPageClick: function (event, page) {
            if (total != 1) {
                getList(page)
            }
        },
    })
}

function status(id, status) {
    $("#ModalYesBtn").attr("onclick", `changeStatus(${id},'${status}')`);
    $("#modal-body-status").html(`Are you shure to change status ?`)
    $("#chandeStatusModal").modal("show")
}
function changeStatus(id, status) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/order/status/${id}?status=${status}`,
        method: "PUT",
    }
    $.ajax(settings).always(function () {
        window.location.reload();
    });
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