var userType = "all"
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null) {  // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/report/${type}/initiativelistreport?from=${from}&to=${to}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.sponser_id}">
            <th scope="row">${elem.init_id}</th>
            <td>${elem.init_en_name}</td>
            <td>${elem.init_ar_name}</td>
            <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.sponsorImg}" alt="sponser Image"></td>
            <td><span class="text-success"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.from_date).format('DD-MM-YYYY')}</span></td>
            <td><span class="text-danger"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.to_date).format('DD-MM-YYYY')}</span></td>
            <td>${elem.featured == "1" ? `<span class="badge badge-success">Yes</span>` : `<span class="badge badge-danger">No</span>`}</td>
            <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
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