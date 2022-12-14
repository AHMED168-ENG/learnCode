$(document).ready(function () {});
// var addedPages = [];
// var removedPages = [];
// function addOrRemovePages(page_id, checked) {
//     if (checked == "true") {
//         addedPages.push(page_id);
//         if (removedPages.includes(page_id)) removedPages = removedPages.filter((removedPage) => removedPage != page_id);
//     }
//     if (checked == "false") {
//         removedPages.push(page_id);
//         if (addedPages.includes(page_id)) addedPages = addedPages.filter((addedPage) => addedPage != page_id);
//     }
// }
// function submit() {
//     spinnerNotfound(1);
//     const settings = {
//         async: true,
//         crossDomain: true,
//         data: { addedPages, removedPages },
//         url: `${window.location.pathname}/edit`,
//         method: "Put",
//     }
//     $.ajax(settings).done(function (res, textStatus) {
//         spinnerNotfound(2);
//         addedPages = [];
//         removedPages = [];
//     }).fail(() => spinnerNotfound(3));
// }
function addOrRemovePages(page_id, checked) {
    spinnerNotfound(1);
    const settings = {
        async: true,
        crossDomain: true,
        data: { checked, page_id },
        url: `${window.location.pathname}/edit`,
        method: "Put",
    }
    $.ajax(settings).done(function (res, textStatus) { spinnerNotfound(2); }).fail(() => spinnerNotfound(3));
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
