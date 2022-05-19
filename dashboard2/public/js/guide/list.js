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
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/dashboard2/guide/new" class="btn btn-info">Add new</a>`)
        }
        pagination(res.pages)
        $("#tr-th-row").empty()
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td>${elem.username}</td>
                <td>${elem.gender}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.image}" alt="Image"></td>
                <td>${elem.tbl_city.ar_name} - ${elem.tbl_city.en_name}</td>
                <td>${elem.email}</td>
                <td>${elem.phone}</td>
                <td>
                    <a class="m-1" data-tooltip="View Tour Guide" href="/dashboard2/guide/view/${elem.id}"><i class="fas fa-eye"></i></a>
                    <a class="m-1" href="/dashboard2/guide/edit/${elem.id}"><i class="fas fa-edit text-primary"></i></a>
                    ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}</td>
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td>${elem.username}</td>
                <td>${elem.gender}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.image}" alt="Image"></td>
                <td>${elem.tbl_cities.ar_name} - ${elem.tbl_cities.en_name}</td>
                <td>${elem.email}</td>
                <td>${elem.phone}</td>
                <td><a data-tooltip="View Tour Guide" class="btn btn-info" href="/dashboard2/guide/view/${elem.id}"><i class="fas fa-eye"></i></a></td>
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