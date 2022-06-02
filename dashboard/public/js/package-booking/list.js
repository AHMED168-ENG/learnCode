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
            $("#tr-th-row").append(`<tr id="${elem.id}">
            <th scope="row">${elem.id}</th>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            <td><a href="/dashboard/user/edit/${elem.web_apps_user.user_id}" class="btn btn-link text-dark">${elem.web_apps_user.fullName}</a></td>
            <td><span class="text-primary"><i class="fas fa-credit-card"></i>&emsp;${elem.pay_type}</span></td>
            <td>${elem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SAR</td>
            <td>${elem.tbl_promo_code.percent || 0} %</td>
            <td><span class="text-success">${(elem.price * (elem.tbl_promo_code.percent ? elem.tbl_promo_code.percent / 100 : 1)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SAR</span></td>
            <td></td>
            </tr>`)
            $(`#${elem.id} td:last`).append(`<a href="/dashboard/package-booking/view/${elem.id}" data-tooltip="View ads" class="btn btn-info"><i class="fas fa-eye"></i></a>`)
            if (res.canEdit) {
                if (elem.request == "new") {
                    $(`#${elem.id} td:last`).append(`
                    <button type="button" data-tooltip="Inprogress" onclick='request(${elem.id},"inprogress")' class="btn btn-warning"><i class="fas fa-circle-notch"></i></button>
                    <button type="button" data-tooltip="Cancelle ads" onclick='request(${elem.id},"cancelled")' class="btn btn-danger"><i class="fas fa-times-circle"></i></button>
                    ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}`)
                } else if (elem.request == "inprogress") {
                    $(`#${elem.id} td:last`).append(`
                    <button type="button" data-tooltip="Complete" onclick='request(${elem.id},"completed")' class="btn btn-success"><i class="fas fa-check-circle"></i></button>
                    <button type="button" data-tooltip="Cancelle ads" onclick='request(${elem.id},"cancelled")' class="btn btn-danger"><i class="fas fa-times-circle"></i></button>
                    ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}`)
                } else if (elem.request == "completed") {
                    $(`#${elem.id} td:last`).append(`
                     ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}`)
                } else if (elem.request == "cancelled") {
                    $(`#${elem.id} td:last`).append(`
                    ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}
                    `)
                }
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

function request(id, request) {
    $("#ModalYesBtn").attr("onclick", `changeRequest(${id},'${request}')`);
    $("#modal-body-request").html(`Are you sure to change request ?`)
    $("#chandeStatusModal").modal("show")
}
function changeRequest(id, request) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/edit/${id}?request=${request}`,
        method: "PUT",
    }
    $.ajax(settings).always(function () {
        window.location.reload();
    });
}
function active(id, action) {
    const settings = { async: true, crossDomain: true, url: `${window.location.pathname}/edit/${id}?status=${action}`, method: "PUT" };
    $.ajax(settings).always(function () { window.location.reload(); });
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