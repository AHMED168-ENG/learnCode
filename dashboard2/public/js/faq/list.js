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
        if (res.canAdd) {
            $('#addNewBtn').html(`<a type="button" href="/dashboard2/faq/new" class="btn btn-info">Add new</a>`);
        }
        $("#tr-th-row").empty()
        if (res.canEdit) {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.question_en}<br />${elem.question_ar}</td>
                <td><i class="fas fa-calendar-alt text-primary"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</td>
                <td>
                    <a href="/dashboard2/faq/view/${elem.id}" data-tooltip="View FAQ" class="btn btn-info"><i class="fas fa-eye"></i></a>
                    <a href="/dashboard2/faq/edit/${elem.id}" data-tooltip="Edit FAQ" class="btn btn-primary"><i class="fas fa-edit"></i></a></td>
                </tr>`)
            })
        } else {
            res.data.forEach((elem) => {
                $("#tr-th-row").append(`<tr>
                <th scope="row">${elem.id}</th>
                <td>${elem.question_en}<br />${elem.question_ar}</td>
                <td><i class="fas fa-calendar-alt text-primary"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</td>
                <td>
                    <a href="/dashboard2/faq/view/${elem.id}" data-tooltip="View FAQ" class="btn btn-info"><i class="fas fa-eye"></i></a>
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