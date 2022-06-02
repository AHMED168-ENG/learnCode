$(document).ready(function () {
    const activity_category_id = JSON.parse(`<%-JSON.stringify(activity_category_id)%>`);
    const destination_id = JSON.parse(`<%-JSON.stringify(destination_id)%>`);
    getList(1, activity_category_id, destination_id)
})
function getList(page, category, destination_id) {
    // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/list?limit=20&page=${page}&category=${category}&destination_id=${destination_id}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res, textStatus) {
        // hidden spinner
        spinnerNotfound(2)
        pagination(res.pages)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`
                <div class="card col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6 m-2">
                    <img class="card-img-top" src="/p/img/${elem.image}" alt="Photo">
                    <div class="card-body">
                    <h4 class="card-title">${elem.name}</h4>
                    <h6 class="card-subtitle mb-2 text-muted">${elem.category}</h6>
                    <a href="/destination/view/${elem.id}" class="btn btn-primary">More Details ...</a>
                    </div>
                </div>
            `);
        });
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