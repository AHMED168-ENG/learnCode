var userType = "all"
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null) {  // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/report/${type}/locationlistreport?from=${from}&to=${to}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.location_id}">
            <td>${elem.location_id}</td>
            <td>${elem.location_nameEn}<br />${elem.location_nameAr}</td>
            <td><img class="rounded p-0" width=45 height=45 src="/p/img/${elem.img}" alt="sponser Image"></td>
            <td>${elem.tbl_initiative.init_en_name}<br />${elem.tbl_initiative.init_ar_name}</td>
            <td>${elem.location_address}</td>
            <td>${elem.tbl_city.en_name}<br />${elem.tbl_city.ar_name}</td>
            <td>${elem.location_status == "active" ? `<span class="badge badge-success">${elem.location_status}</span>` : `<span class="badge badge-danger">${elem.location_status}</span>`}</td>
            <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            </tr>`)
        })
    }).fail(() => spinnerNotfound(3))
}


function changeType(type) {
    getList(type, fromOrder, toOrder)
    userType = type
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