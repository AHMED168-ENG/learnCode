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
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/dashboard/rental-company/new" class="btn btn-info">Add new</a>`)
        }
        pagination(res.pages)
        $("#tr-th-row").empty()
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td>${elem.phone}</td>
                <td>${elem.email}</td>
                <td>
                    <a class="m-1" data-tooltip="View Rental Company" href="/dashboard/rental-company/view/${elem.id}"><i class="fas fa-eye"></i></a>
                    <a class="m-1" href="/dashboard/rental-company/edit/${elem.id}"><i class="fas fa-edit text-primary"></i></a></td>
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td>${elem.phone}</td>
                <td>${elem.email}</td>
                <td><a data-tooltip="View Rental Company" class="btn btn-info" href="/dashboard/rental-company/view/${elem.id}"><i class="fas fa-eye"></i></a></td>
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