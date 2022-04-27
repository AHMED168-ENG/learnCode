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
        // hidden spinner
        spinnerNotfound(2)
        pagination(res.pages)
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/dashboard/sponser/new" class="btn btn-info">Add new</a>`)
        }
        $("#tr-th-row").empty()
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.sponser_id}</th>
                <td>${elem.sponser_name}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.img}" alt="sponser Image"></td>
                <td>${elem.user_name}</td>
                <td>${elem.email ? `<a class="text-dark" href='mailto:${elem.email}'>${elem.email}</a>` : "—"}</td>
                <td>${elem.phone ? `<a class="text-dark" href='tel:${elem.phone}'>${elem.phone}</a>` : "—"}</td>
                <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                        <td><a class="pr-2" href="/dashboard/sponser/edit/${elem.sponser_id}"><i class="fas fa-edit text-primary"></i></a></td>
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.sponser_id}</th>
                <td>${elem.sponser_name}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.img}" alt="sponser Image"></td>
                <td>${elem.user_name}</td>
                <td>${elem.email ? `<a class="text-dark" href='mailto:${elem.email}'>${elem.email}</a>` : "—"}</td>
                <td>${elem.phone ? `<a class="text-dark" href='tel:${elem.phone}'>${elem.phone}</a>` : "—"}</td>
                <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <td></td>
                </tr>`)
            })
        }
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