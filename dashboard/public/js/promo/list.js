$(document).ready(function () {
    getList(1)
})
function getList(page) {
    // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/list?limit=6&page=${page}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res, textStatus) {
        spinnerNotfound(2)
        pagination(res.pages)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr>
            <th scope="row">${elem.promo_id}</th>
            <td>${elem.promo_name}</td>
            <td>${elem.promo_type == "all_users" ? "All users" : `<a  class="text-dark" href='/dashboard/user/edit/${elem.user_id}'>${elem.web_apps_user.fullName}</a>`}</td>
            <td>${elem.num_of_uses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <td class="text-info"><h6><snap class="pr-2 font-weight-bold">${elem.percent}</snap><i class="fas fa-percent"></i></h6></td>
            <td><i class="fas fa-calendar-alt text-primary"></i>&emsp;${moment(elem.from_date).format('DD-MM-YYYY')}</td>
            <td><i class="fas fa-calendar-alt text-primary"></i>&emsp;${moment(elem.to_date).format('DD-MM-YYYY')}</td>
            <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
            <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
            <td>${moment(elem.createdAt).format('DD-MM-YYYY')}</td>
            <td>
                <a data-tooltip="Edit promo" class="btn btn-primary" href="/dashboard/promo/edit/${elem.promo_id}"><i class="fas fa-edit"></i></a>
                ${elem.status == "active" ? `<button data-tooltip="Unactive promo" class="btn btn-warning" onclick='active(${elem.promo_id},"active","yes")'><i class="fas fa-exclamation-triangle"></i></button>` : `<button data-tooltip="Active promo" class="btn btn-info" onclick='active(${elem.promo_id},"active","no")'><i class="fas fa-exclamation-triangle"></i></button>`}
                ${elem.deleted == "no" ? `<button data-tooltip="Delete promo" class="btn btn-danger" onclick='active(${elem.promo_id},"delete","yes")'><i class="fas fa-trash-alt"></i></button>` : `<button data-tooltip="Restore promo" class="btn btn-success" onclick='active(${elem.promo_id},"delete","no")'><i class="fas fa-sync-alt"></i></button>`}
            </td>
            </tr>`)
        })
    }).fail(() => spinnerNotfound(3))
}
function pagination(total) {
    $("#pagination-demo").twbsPagination({
        totalPages: total,
        visiblePages: 7,
        onPageClick: function (event, page) {
            if (total != 1) getList(page)
        },
    })
}
function active(id, action, v) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/${action}/${id}?v=${v}`,
        method: "DELETE",
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