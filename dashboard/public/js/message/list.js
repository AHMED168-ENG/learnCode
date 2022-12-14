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
        // hidden spinner
        spinnerNotfound(2)
        pagination(res.pages, res.page)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.message_id}">
            <th scope="row">${elem.message_id}</th>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            <td>${elem.name}</td>
            <td>${elem.email ? `<a class="text-dark" href='mailto:${elem.email}'>${elem.email}</a>` : "—"}</td>
            <td><a href="/dashboard/message/view/${elem.message_id}" data-tooltip="View message" class="btn btn-info"><i class="fas fa-eye"></i></a>
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

function changeStatus(id, status) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/message/status/${id}?status=${status}`,
        method: "PUT",
    }
    $.ajax(settings).always(function () {
        window.location.reload();
    });
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