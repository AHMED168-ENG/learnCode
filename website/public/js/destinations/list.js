$(document).ready(function () {
    getList(1)
})
function getList(page) {
    // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}/list?limit=20&page=${page}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res, textStatus) {
        // hidden spinner
        spinnerNotfound(2)
        pagination(res.pages)
        $("#tr-th-row").empty()
        const itemsIds = res.favourites?.map((favourite) => { return favourite.item_id });
        res.data.forEach((elem) => {
            if (res.user) {
                $("#tr-th-row").append(`
                    <div class="card col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6 m-2">
                        <img class="card-img-top" src="/p/img/${elem.image}" alt="Photo">
                        <div class="card-body">
                            <div class="mb-4" style="height: auto;">
                                <div class="row"><span class="card-title">${elem.title}</span></div>
                                <div class="row form-group mt-2">
                                    <button class="btn btn-primary" id="Addfav-${elem.id}" onclick="addToFavourites('${elem.id}', '${!itemsIds.includes(elem.id)}')" type="submit">${itemsIds.includes(elem.id) ? 'Remove Favourite' : 'Add Favourite'}</button>
                                </div>
                            </div>
                            <a href="/destination/view/${elem.id}" class="btn btn-primary">More Details ...</a>
                        </div>
                    </div>
                `);
            } else {
                $("#tr-th-row").append(`
                    <div class="card col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6 m-2">
                        <img class="card-img-top" src="/p/img/${elem.image}" alt="Photo">
                        <div class="card-body">
                            <div class="mb-4" style="height: auto;">
                                <div class="row"><span class="card-title">${elem.title}</span></div>
                            </div>
                            <a href="/destination/view/${elem.id}" class="btn btn-primary">More Details ...</a>
                        </div>
                    </div>
                `);
            }
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
function addToFavourites(item_id, checked) {
    const settings = { url: `/favourite`, data: JSON.stringify({ item_id, checked, category: "destination" }), contentType: "application/json", type: 'PUT' };
    $.ajax(settings).done(function (data) { location.reload(); }).fail(() => spinnerNotfound(3));
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