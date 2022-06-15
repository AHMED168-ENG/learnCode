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
        var placeStatusColor = "";
        res.data.forEach((elem) => {
            placeStatusColor = elem.status === "active" ? "success" : "secondary";
            $("#tr-th-row").append(`
            <tr id="${elem.id}">
            <th scope="row">${elem.id}</th>
            <td>${elem.en_name}</td>
            <td>${elem.ar_name}</td>
            <td>${elem.price || 0} %</td>
            <td>${elem.request}</td>
            <td><span class="badge badge-${placeStatusColor}">${elem.status}</span></td>
            <td></td>
            </tr>`)
            $(`#${elem.id} td:last`).append(`<a href="/dashboard/ads/view/${elem.id}" data-tooltip="View ads" class="btn btn-info"><i class="fas fa-eye"></i></a>`)
            if (elem.request == "new" && res.canEditNew) {
                $(`#${elem.id} td:last`).append(`
                <button type="button" data-tooltip="Inprogress" onclick='request(${elem.id},"inprogress")' class="btn btn-warning"><i class="fas fa-circle-notch"></i></button>
                <button type="button" data-tooltip="Cancelle ads" onclick='request(${elem.id},"cancelled")' class="btn btn-danger"><i class="fas fa-times-circle"></i></button>
                ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}`)
            }
            if (elem.request == "inprogress" && res.canEditInProgress) {
                $(`#${elem.id} td:last`).append(`
                <button type="button" data-tooltip="Complete" onclick='request(${elem.id},"completed")' class="btn btn-success"><i class="fas fa-check-circle"></i></button>
                <button type="button" data-tooltip="Cancelle ads" onclick='request(${elem.id},"cancelled")' class="btn btn-danger"><i class="fas fa-times-circle"></i></button>
                ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}`)
            }
            if (elem.request == "completed" && res.canEditCompleted) {
                $(`#${elem.id} td:last`).append(`
                 ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}`)
            }
            if (elem.request == "cancelled" && res.canEditCancelled) {
                $(`#${elem.id} td:last`).append(`
                ${elem.status == "active" ? `<i class="m-1 fas fa-exclamation-triangle text-secondary" onclick='active(${elem.id},"deactive")'></i>` : `<i class="m-1 fas fa-exclamation-triangle text-success" onclick='active(${elem.id},"active")'></i>`}
                `)
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
        url: `/dashboard/ads/edit/${id}?request=${request}`,
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