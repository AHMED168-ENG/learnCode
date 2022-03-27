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
        spinnerNotfound(2)
        pagination(res.pages, res.page)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr>
            <th scope="row">${elem.id}</th>
            <td>${elem.tbl_tree.en_name}<br />${elem.tbl_tree.ar_name}</td>
            <td><img class="rounded p-0" width=45 height=45 src="/p/img/${elem.tbl_tree.img_tree}" alt="sponser Image"></td>
            <td>${elem.tbl_initiative.init_en_name}<br />${elem.tbl_initiative.init_ar_name}</td>
            <td>${elem.tbl_initiatives_location.location_nameEn}<br />${elem.tbl_initiatives_location.location_nameAr}</td>
            <td>${elem.price}</td>
            <td>${elem.price_points}</td>
            <td>${elem.carbon_points}</td>
            <td>${elem.target_num}</td>
            <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
            <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
            <td>${new Date(elem.createdAt).toLocaleDateString("en-US")}</td>
            <td>
                <a data-tooltip="View tree" class="btn btn-info" href="/dashboard/initrees/view/${elem.id}"><i class="fas fa-eye"></i></a>
                <a data-tooltip="Edit tree" class="btn btn-primary" href="/dashboard/initrees/edit/${elem.id}"><i class="fas fa-edit"></i></a>
                ${elem.status == "active" ? `<button data-tooltip="Unactive tree" class="btn btn-warning" onclick='active(${elem.id},"active","yes")'><i class="fas fa-exclamation-triangle"></i></button>` : `<button data-tooltip="Active tree" class="btn btn-info" onclick='active(${elem.id},"active","no")'><i class="fas fa-exclamation-triangle"></i></button>`}
                ${elem.deleted == "no" ? `<button data-tooltip="Delete tree" class="btn btn-danger" onclick='active(${elem.id},"delete","yes")'><i class="fas fa-trash-alt"></i></button>` : `<button data-tooltip="Restore tree" class="btn btn-success" onclick='active(${elem.id},"delete","no")'><i class="fas fa-sync-alt"></i></button>`}
            </td>
            </tr>`)
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