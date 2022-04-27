$(document).ready(function () { getList(1); });
function getList(page) {
    spinnerNotfound(1);
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/list?limit=8&page=${page}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res, textStatus) {
        spinnerNotfound(2);
        pagination(res.pages);
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/dashboard/user/roles/new" class="btn btn-info">Add new</a>`);
        }
        $("#tr-th-row").empty();
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td>
                    <a href="/dashboard/user/roles/edit/${elem.id}"><i class="fas fa-edit text-primary"></i></a></td>
                </tr>`);
            });
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td></td>
                </tr>`);
            });
        }
    }).fail(() => spinnerNotfound(3));
}
function pagination(total) {
    $("#pagination-demo").twbsPagination({
        totalPages: total,
        visiblePages: 7,
        onPageClick: function (event, page) { if (total != 1) getList(page) },
    });
}
function spinnerNotfound(action) {
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
