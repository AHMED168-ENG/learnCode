// var is Entity || Individual
var userType = "individual"
$(document).ready(function () {
    getList(1)
})
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
function getList(page = 1) {
    // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/list?limit=6&page=${page}&type=${userType}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res, textStatus) {
        if (userType != "entity") {
            // hidden spinner
            spinnerNotfound(2)
            pagination(res.pages, "pagination-demo")
            $("#tr-th-row").empty()
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.user_id}</th>
                <td>${elem.fullName || "—"}</td>
                <td>${elem.gender || "—"}</td>
                <td>${new Date(elem.birth_date).toLocaleDateString("en-US") || "—"}</td>
                <td>${elem["tbl_country.en_name"] || "—"}</td >
                <td>${elem["tbl_city.en_name"] || "—"}</td>
                <td>${elem["tbl_region.en_name"] || "—"}</td>
                <td>${elem.email ? `<a class="text-dark" href='mailto:${elem.email}'>${elem.email}</a>` : "—"}</td>
                <td>${elem.phone ? `<a class="text-dark" href='tel:${elem.phone}'>${elem.phone}</a>` : "—"}</td>
                <td>${elem.account_status == "active" ? `<span class="badge badge-success">${elem.account_status}</span>` : `<span class="badge badge-danger">${elem.account_status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <td>${elem.sahlan_gained_points || "—"}</td>
                <td>${elem.carbon_gained_points || "—"}</td>
                <td>${new Date(elem.createdAt).toLocaleDateString("en-US")}</td>
                <td>
                    <a href="/dashboard/user/edit/${elem.user_id}"><i class="fas fa-file-signature text-info"></i></a></td>
                </tr> `)
            })
            $("#tabe-items").show();
        } else {
            // hidden spinner
            spinnerNotfound(2)
            pagination(res.pages, "pagination-entity")
            $("#tr-th-row-entity").empty()
            res.data.forEach((elem) => {
                $("#tr-th-row-entity").append(`<tr>
                <th scope="row">${elem.user_id}</th>
                <td>${elem.entity_name || "—"}</td>
                <td>${elem.fullName || "—"}</td>
                <td>${elem["tbl_entity_sector.en_name"] || "—"}</td>
                <td>${elem["tbl_country.en_name"] || "—"}</td >
                <td>${elem["tbl_city.en_name"] || "—"}</td>
                <td>${elem.email ? `<a class="text-dark" href='mailto:${elem.email}'>${elem.email}</a>` : "—"}</td>
                <td>${elem.phone ? `<a class="text-dark" href='tel:${elem.phone}'>${elem.phone}</a>` : "—"}</td>
                <td>${elem.account_status == "active" ? `<span class="badge badge-success">${elem.account_status}</span>` : `<span class="badge badge-danger">${elem.account_status}</span>`}</td>
                <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
                <td>${elem.sahlan_gained_points || "—"}</td>
                <td>${elem.carbon_gained_points || "—"}</td>
                <td>${new Date(elem.createdAt).toLocaleDateString("en-US")}</td>
                <td>
                    <a href="/dashboard/user/edit/${elem.user_id}"><i class="fas fa-file-signature text-info"></i></a></td>
                </tr> `)
            })
            $("#tabe-items-entity").show();
        }
    }).fail(() => spinnerNotfound(3))
}
function pagination(total, id) {
    $(`#${id}`).twbsPagination({
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
        $("#tabe-items-entity").hide();
        $("#spinner-notfound>div").html(`<div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div>`);
        $("#spinner-notfound").show();
    } else if (action == 2) {
        $("#spinner-notfound").hide();
    } else if (action == 3) {
        $("#tabe-items").hide();
        $("#tabe-items-entity").hide();
        $("#spinner-notfound>div").html(`<p>Not found items</p>`);
        $("#spinner-notfound").show();
    }

}
$('#isIndividual').click(function () {
    if (userType != "individual") {
        userType = "individual"
        $("#tabe-items-entity").hide();
        $("#tabe-items").show();
    }
});
$('#isEntity').click(function () {
    var clicks = $(this).data('clicks');
    if (clicks) {
        showEntity()
    } else {
        showEntity()
        getList(1)
    }
    $(this).data("clicks", !clicks);
});

function showEntity() {
    if (userType != "entity") {
        userType = "entity"
        $("#tabe-items").hide();
        $("#tabe-items-entity").show();
    }
}