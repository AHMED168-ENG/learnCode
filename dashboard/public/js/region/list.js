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
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr>
            <th scope="row">${elem.region_id}</th>
            <td>${elem.en_name}</td>
            <td>${elem.ar_name}</td>
            <td>${elem.tbl_country.en_name}<br />${elem.tbl_country.ar_name}</td>
            <td>${elem.tbl_city.en_name}<br />${elem.tbl_city.ar_name}</td>
            <td>${elem.latitude || ""}</td>
            <td>${elem.longitude || ""}</td>
            <td>${new Date(elem.createdAt).toLocaleDateString("en-US")}</td>
            <td>
                <a href="/dashboard/region/edit/${elem.region_id}"><i class="fas fa-edit text-primary"></i></a></td>
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