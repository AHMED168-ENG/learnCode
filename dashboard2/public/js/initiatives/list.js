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
            $('#addNewBtn').html(`<a type="button" href="/dashboard2/initiative/new" class="btn btn-info">Add new</a>`)
        }
        $("#tr-th-row").empty()
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.init_id}</th>
                <td>${elem.init_en_name}</td>
                <td>${elem.init_ar_name}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.sponsorImg}" alt="sponser Image"></td>
                <td>${elem.from_date}</td>
                <td>${elem.to_date}</td>
                <td>${elem.featured == "1" ? `<span class="badge badge-success">${elem.featured}</span>` : `<span class="badge badge-danger">${elem.featured}</span>`}</td>
                <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <td>
                    <a data-tooltip="View initiative" class="btn btn-info" href="/dashboard2/initiative/view/${elem.init_id}"><i class="fas fa-eye"></i></a>
                    <a data-tooltip="Edit initiative" class="btn btn-primary" href="/dashboard2/initiative/edit/${elem.init_id}"><i class="fas fa-edit"></i></a>
                    ${elem.status == "active" ? `<button data-tooltip="Unactive initiative" class="btn btn-warning" onclick='active(${elem.init_id},"active","yes")'><i class="fas fa-exclamation-triangle"></i></button>` : `<button data-tooltip="Active initiative" class="btn btn-info" onclick='active(${elem.init_id},"active","no")'><i class="fas fa-exclamation-triangle"></i></button>`}
                    ${elem.deleted == "no" ? `<button data-tooltip="Delete initiative" class="btn btn-danger" onclick='active(${elem.init_id},"delete","yes")'><i class="fas fa-trash-alt"></i></button>` : `<button data-tooltip="Restore initiative" class="btn btn-success" onclick='active(${elem.init_id},"delete","no")'><i class="fas fa-sync-alt"></i></button>`}
                </td>
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.init_id}</th>
                <td>${elem.init_en_name}</td>
                <td>${elem.init_ar_name}</td>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.sponsorImg}" alt="sponser Image"></td>
                <td>${elem.from_date}</td>
                <td>${elem.to_date}</td>
                <td>${elem.featured == "1" ? `<span class="badge badge-success">${elem.featured}</span>` : `<span class="badge badge-danger">${elem.featured}</span>`}</td>
                <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <td>
                    <a data-tooltip="View initiative" class="btn btn-info" href="/dashboard2/initiative/view/${elem.init_id}"><i class="fas fa-eye"></i></a>
                </td>
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