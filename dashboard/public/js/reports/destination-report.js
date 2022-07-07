var userType = "all"
var monthsChart = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null) {  // show spinner
    spinnerNotfound(1)
    const query = !!from && !!to ? `?from=${from}&to=${to}` : '';
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/report/destination-list${query}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        const favouriteDestinations = res.data.map((elem) => { return { name: elem.name, favourites: elem.favourites.length }; });
        const sortedFavouriteDestinations = favouriteDestinations.sort(function (a, b) { return b.favourites - a.favourites; });
        const topFavouriteDestinations = sortedFavouriteDestinations.slice(Math.max(sortedFavouriteDestinations.length - 5, 0));
        changeChart(topFavouriteDestinations);
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            for (const favourite of elem.favourites) {
                $("#tr-th-row").append(`<tr id="${elem.id}">
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td>${favourite.username}</td>
                <td>${favourite.user_type}</td>
                <td>${new Date(favourite.createdAt).toLocaleDateString("en-US")}</td>
                <td>
                    <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(favourite.createdAt).format('DD-MM-YYYY')}</span><br />
                    <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(favourite.createdAt).format('LT')}</span>
                </td>
                <td><a data-tooltip="Count Related To ${elem.name} Report" class="btn btn-info" href="/dashboard/report/destination-count-repo/${elem.id}"><i class="fas fa-eye"></i></a></td>
                </tr>`);
            }
        })
        $("#tr-th-row-2").empty()
        if (!res.otherDestinations.length) $('#table-div').hide();
        else {
            res.otherDestinations.forEach((elem) => {
                $("#tr-th-row-2").append(`<tr id="${elem.id}">
                <th scope="row">${elem.id}</th>
                <td>${elem.en_title}</td>
                <td>${elem.ar_title}</td>
                <td><a data-tooltip="Count Related To ${elem.en_title} - ${elem.ar_title} Report" class="btn btn-info" href="/dashboard/report/destination-count-repo/${elem.id}"><i class="fas fa-eye"></i></a></td>
                </tr>`);
            })
        }
    }).fail(() => spinnerNotfound(3))
}
function changeChart(favouriteDestinations) {
    var chartSet = {
        labels: favouriteDestinations.map((favouriteDestination) => { return favouriteDestination.name; }),
        datasets: [
            {
                label: "Favourites per Destination",
                backgroundColor: "rgba(60,141,188,0.9)",
                borderColor: "rgba(60,141,188,0.8)",
                pointRadius: false,
                pointColor: "#3b8bba",
                pointStrokeColor: "rgba(60,141,188,1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(60,141,188,1)",
                data: favouriteDestinations.map((favouriteDestination) => { return favouriteDestination.favourites; }),
            },
        ],
    }
    var extendChartSet = $.extend(true, {}, chartSet)
    var temp1 = chartSet.datasets[0]
    extendChartSet.datasets[0] = temp1
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        datasetFill: false,
    }
    if (!!window.bar) window.bar.destroy();
    window.bar = new Chart($("#favouriteDestinationsDetails").get(0).getContext("2d"), {
        type: "bar",
        data: chartSet,
        options: chartOptions,
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

$(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    })
});

$(document).ready(function () {
    $("#city_id").on("change", function () {
        getList(userType, fromOrder, toOrder, $("#city_id option:selected").val())
    })
});