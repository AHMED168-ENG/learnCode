$(document).ready(function () { getList(1) })
function getList() {
    // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/list`,
        method: "Get",
    }
    $.ajax(settings).done(function (res, textStatus) {
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(
                `<tr>
                    <th scope="row">${elem.id}</th>
                    <td>${elem.en_name}</td>
                    <td>${elem.ar_name}</td>
                    <td><a href="/dashboard/tree/header/edit/${elem.id}"><i class="fas fa-edit text-primary"></i></a></td>
                </tr>`
            )
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