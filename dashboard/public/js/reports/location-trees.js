var userType = "all"
var monthsChart = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null, city = null) {  // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard/report/treelistreport?from=${from}&to=${to}&city=${city}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        const fromMonth = !from ? undefined : monthsChart[new Date(from).getMonth()];
        const toMonth = !to ? undefined : monthsChart[new Date(to).getMonth()];
        const selectedMonths = fromMonth && toMonth ? [...new Set([fromMonth, toMonth])] : undefined;
        changeChart(res.usersChart, selectedMonths);
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.id}">
            <th scope="row">${elem.id}</th>
            <td>${elem.tbl_tree.en_name}<br />${elem.tbl_tree.ar_name}</td>
            <td><img class="rounded p-0" width=45 height=45 src="/p/img/${elem.tbl_tree.img_tree}" alt="sponser Image"></td>
            <td>${elem.tbl_initiative.init_en_name}<br />${elem.tbl_initiative.init_ar_name}</td>
            <td>${elem.tbl_initiatives_location.location_nameEn}<br />${elem.tbl_initiatives_location.location_nameAr}</td>
            <td>${elem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <td>${elem.price_points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <td>${elem.carbon_points}</td>
            <td>${elem.target_num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
            <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
            <td>${new Date(elem.createdAt).toLocaleDateString("en-US")}</td>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            </tr>`)
        })
    }).fail(() => spinnerNotfound(3))
}
function changeChart(inYear, selectedMonths) {
    var months = !selectedMonths ? monthsChart : selectedMonths;
    var monthsCountArr = months.map((m, i) => {
        for (let element of inYear) {
            if (element.MONTH == m) {
                return element.count
            }
        }
        return 0
    })
    var chartSet = {
        labels: months,
        datasets: [
            {
                label: "Sponsor per month",
                backgroundColor: "rgba(60,141,188,0.9)",
                borderColor: "rgba(60,141,188,0.8)",
                pointRadius: false,
                pointColor: "#3b8bba",
                pointStrokeColor: "rgba(60,141,188,1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(60,141,188,1)",
                data: monthsCountArr,
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
    window.bar = new Chart($("#locationTreesDetails").get(0).getContext("2d"), {
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