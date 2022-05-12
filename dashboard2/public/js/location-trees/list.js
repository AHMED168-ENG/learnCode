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
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/dashboard2/initrees/new" class="btn btn-info">Add new</a>`)
        }
        $("#tr-th-row").empty()
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <th scope="col">${elem.tbl_tree.en_name}</th>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.tbl_tree.img_tree}" alt="Image"></td>
                <th scope="col">${elem.tbl_initiative.init_en_name}</th>
                <th scope="col">${elem.tbl_initiatives_location.location_nameEn}</th>
                <th scope="col">${elem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
                <th scope="col">${elem.price_points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
                <th scope="col">${elem.carbon_points}</th>
                <th scope="col">${elem.target_num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
                <th scope="col">${elem.status}</th>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <th scope="col">${new Date(elem.createdAt).toLocaleString('default', { month: 'short' })} ${new Date(elem.createdAt).getDay()} ${new Date(elem.createdAt).getFullYear()}</th>
                <td>
                    <a data-tooltip="Edit location tree" class="btn btn-primary" href="/dashboard2/initrees/edit/${elem.id}"><i class="fas fa-edit"></i></a>
                    ${elem.status == "active" ? `<button data-tooltip="Unactive location tree" class="btn btn-warning" onclick='active(${elem.id},"active","yes")'><i class="fas fa-exclamation-triangle"></i></button>` : `<button data-tooltip="Active location tree" class="btn btn-info" onclick='active(${elem.id},"active","no")'><i class="fas fa-exclamation-triangle"></i></button>`}
                    ${elem.deleted == "no" ? `<button data-tooltip="Delete location tree" class="btn btn-danger" onclick='active(${elem.id},"delete","yes")'><i class="fas fa-trash-alt"></i></button>` : `<button data-tooltip="Restore location tree" class="btn btn-success" onclick='active(${elem.id},"delete","no")'><i class="fas fa-sync-alt"></i></button>`}
                </td>
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <th scope="col">${elem.tbl_tree.en_name}</th>
                <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.tbl_tree.img_tree}" alt="Image"></td>
                <th scope="col">${elem.tbl_initiative.init_en_name}</th>
                <th scope="col">${elem.tbl_initiatives_location.location_nameEn}</th>
                <th scope="col">${elem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
                <th scope="col">${elem.price_points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
                <th scope="col">${elem.carbon_points}</th>
                <th scope="col">${elem.target_num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
                <th scope="col">${elem.status}</th>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <th scope="col">${new Date(elem.createdAt).toLocaleString('default', { month: 'short' })} ${new Date(elem.createdAt).getDay()} ${new Date(elem.createdAt).getFullYear()}</th>
                <td></td>
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