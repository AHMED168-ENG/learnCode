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
            <td>${elem.promo_type == "all_users" ? "All users" : elem.web_apps_user.fullName}</td>
            <td>${elem.num_of_uses}</td>
            <td>${elem.percent} %</td>
            <td>${moment(elem.from_date).format('DD-MM-YYYY')}</td>
            <td>${moment(elem.to_date).format('DD-MM-YYYY')}</td>
            <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
            <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
            <td>${moment(elem.createdAt).format('DD-MM-YYYY')}</td>
            <td>
                <a href="/dashboard/region/edit/${elem.promo_id}"><i class="fas fa-edit text-primary"></i></a></td>
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