$(document).ready(function () { addOrRemovePages(1); });
function addOrRemovePages(page, roleId, moduleId, pageId) {
    spinnerNotfound(1);
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/edit/`,
        method: "Put",
    }
    $.ajax(settings).done(function (res, textStatus) {
        spinnerNotfound(2);
        pagination(res.pages);
        $("#tr-th-row").empty();
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`
                <tr>
                    <th scope="row">${elem.module_id}</th>
                    <td>${elem.module_name}</td>
                    <td id="tr-th-row-pages"></td>
                </tr>
            `);
            elem.pages.forEach((page) => {
                $("#tr-th-row-pages").append(`
                    <div class="row">
                        <input class="form-check-input" type="checkbox" value="${page.checked}" id="defaultCheck${page.id}" onclick="addOrRemovePages(1, ${role_id}, ${elem.module_id}, ${page.id})">
                        <label class="form-check-label" for="defaultCheck${page.id}">${page.type}</label>
                        <p class="text-center text-secondary">${page.link}</p>
                    </div>
                `);
            });
        });
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
