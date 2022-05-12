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
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/dashboard2/location/new" class="btn btn-info">Add new</a>`)
        }
        $("#tr-th-row").empty()
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.location_id}</th>
                <td>${elem.location_nameEn}<br />${elem.location_nameAr}</td>
                <td><img class="rounded p-0" width=45 height=45 src="/p/img/${elem.img}" alt="Image"></td>
                <td><img class="rounded p-0" width=45 height=45 src="/p/img/${elem.imgvr}" alt="Image VR"></td>
                <td>${elem.tbl_initiative.init_en_name}<br />${elem.tbl_initiative.init_ar_name}</td>
                <td>${elem.location_address}</td>
                <td>${elem.tbl_city.en_name}<br />${elem.tbl_city.ar_name}</td>
                <td>${elem.location_status == "active" ? `<span class="badge badge-success">${elem.location_status}</span>` : `<span class="badge badge-danger">${elem.location_status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <td>${new Date(elem.createdAt).toLocaleDateString("en-US")}</td>
                <td>
                    <a data-tooltip="View location" class="btn btn-info" href="/dashboard2/location/view/${elem.location_id}"><i class="fas fa-eye"></i></a>
                    <a data-tooltip="Edit location" class="btn btn-primary" href="/dashboard2/location/edit/${elem.location_id}"><i class="fas fa-edit"></i></a>
                    ${elem.location_status == "active" ? `<button data-tooltip="Unactive location" class="btn btn-warning" onclick='active(${elem.location_id},"active","yes")'><i class="fas fa-exclamation-triangle"></i></button>` : `<button data-tooltip="Active location" class="btn btn-info" onclick='active(${elem.location_id},"active","no")'><i class="fas fa-exclamation-triangle"></i></button>`}
                    ${elem.deleted == "no" ? `<button data-tooltip="Delete location" class="btn btn-danger" onclick='active(${elem.location_id},"delete","yes")'><i class="fas fa-trash-alt"></i></button>` : `<button data-tooltip="Restore location" class="btn btn-success" onclick='active(${elem.location_id},"delete","no")'><i class="fas fa-sync-alt"></i></button>`}
                </td>
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.location_id}</th>
                <td>${elem.location_nameEn}<br />${elem.location_nameAr}</td>
                <td><img class="rounded p-0" width=45 height=45 src="/p/img/${elem.img}" alt="Image"></td>
                <td><img class="rounded p-0" width=45 height=45 src="/p/img/${elem.imgvr}" alt="VR Image"></td>
                <td>${elem.tbl_initiative.init_en_name}<br />${elem.tbl_initiative.init_ar_name}</td>
                <td>${elem.location_address}</td>
                <td>${elem.tbl_city.en_name}<br />${elem.tbl_city.ar_name}</td>
                <td>${elem.location_status == "active" ? `<span class="badge badge-success">${elem.location_status}</span>` : `<span class="badge badge-danger">${elem.location_status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <td>${new Date(elem.createdAt).toLocaleDateString("en-US")}</td>
                <td>
                    <a data-tooltip="View location" class="btn btn-info" href="/dashboard2/location/view/${elem.location_id}"><i class="fas fa-eye"></i></a>
                </td>
                </tr>`)
            })
        }
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