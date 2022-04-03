var userType = "all"
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null, city = null) {  // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/report/treelistreport?from=${from}&to=${to}&city=${city}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.id}">
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
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            </tr>`)
        })
    }).fail(() => spinnerNotfound(3))
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

$(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    })
});

$(document).ready(function () {
    $("#city_id").on("change", function () {
        getList(userType, fromOrder, toOrder, $("#city_id option:selected").val())
    })
});