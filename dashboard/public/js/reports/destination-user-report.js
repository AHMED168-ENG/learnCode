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
        url: `/dashboard/report/destination-user-repo/list${query}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        changeChart(res.data);
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            for (const user of elem.users) {
                $("#tr-th-row").append(`<tr id="${elem.id}">
                <th scope="row">${elem.id}</th>
                <td>${elem.name}</td>
                <td>${user.user_type}</td>
                <td>${user.fullName || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>${user.phone || '-'}</td>
                <td>${new Date(user.createdAt).toLocaleDateString("en-US")}</td>
                <td>
                    <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(user.createdAt).format('DD-MM-YYYY')}</span><br />
                    <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(user.createdAt).format('LT')}</span>
                </td>
                </tr>`);
            }
        })
    }).fail(() => spinnerNotfound(3))
}
function changeChart(data) {
    var chartSet = {
        labels: data.map((item) => { return item.name; }),
        datasets: [
            {
                label: "Registered Users per Destination",
                backgroundColor: "rgba(60,141,188,0.9)",
                borderColor: "rgba(60,141,188,0.8)",
                pointRadius: false,
                pointColor: "#3b8bba",
                pointStrokeColor: "rgba(60,141,188,1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(60,141,188,1)",
                data: data.map((item) => { return item.users.length; }),
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
    window.bar = new Chart($("#registeredUsersWithDestinations").get(0).getContext("2d"), {
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