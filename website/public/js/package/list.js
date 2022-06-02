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
            $('#addNewBtn').html(`<a type="button" href="/website/package/new" class="btn btn-info">Add new</a>`)
        }
        pagination(res.pages)
        $("#tr-th-row").empty()
        var placeStatusColor = "";
        if (res.canEdit) {
            res.data.forEach((elem) => {
                placeStatusColor = elem.status === "active" ? "success" : "secondary";
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.en_name}</td>
                <td>${elem.ar_name}</td>
                <td>${elem.tbl_destination.en_title} - ${elem.tbl_destination.ar_title}</td>
                <td>${elem.tbl_provider.en_name} - ${elem.tbl_provider.ar_name}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.image}" alt="Image"></td>
                <td><a data-tooltip="Bookings list" href="/website/package-booking/${elem.id}">Go To Bookings List</a></td>
                <td><span class="badge badge-${placeStatusColor}">${elem.status}</span></td>
                <td>
                   <a class="m-1" data-tooltip="View More Images" href="/website/media/${res.module_id}/image/${elem.id}">View More Images</a>
                   <a class="m-1" data-tooltip="View More Videos" href="/website/media/${res.module_id}/video/${elem.id}">View More Videos</a>
                </td>
                <td>
                    <a class="m-1" data-tooltip="View Package" href="/website/package/view/${elem.id}"><i class="fas fa-eye"></i></a>
                    <a class="m-1" href="/website/package/edit/${elem.id}"><i class="fas fa-edit text-primary"></i></a>
                    ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                placeStatusColor = elem.status === "active" ? "success" : "secondary";
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.en_name}</td>
                <td>${elem.ar_name}</td>
                <td>${elem.tbl_destination.en_title} - ${elem.tbl_destination.ar_title}</td>
                <td>${elem.tbl_provider.en_name} - ${elem.tbl_provider.ar_name}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.image}" alt="Image"></td>
                <td><span class="badge badge-${placeStatusColor}">${elem.status}</span></td>
                <td>
                   <a class="m-1" data-tooltip="View More Images" href="/website/media/${res.module_id}/image/${elem.id}">View More Images</a>
                   <a class="m-1" data-tooltip="View More Videos" href="/website/media/${res.module_id}/video/${elem.id}">View More Videos</a>
                </td>
                <td>
                    <a class="m-1" data-tooltip="View Package" href="/website/package/view/${elem.id}"><i class="fas fa-eye"></i></a></td>
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