var userType = "all"
var monthsChart = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
$(document).ready(function () {
    getList()
})
function getList(type = "all", from = null, to = null) {  // show spinner
    spinnerNotfound(1)
    const settings = {
        async: true,
        crossDomain: true,
        url: `/dashboard2/report/${type}/initiativelistreport?from=${from}&to=${to}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        const fromMonth = !from ? undefined : monthsChart[new Date(from).getMonth()];
        const toMonth = !to ? undefined : monthsChart[new Date(to).getMonth()];
        const selectedMonths = fromMonth && toMonth ? [...new Set([fromMonth, toMonth])] : undefined;
        changeChart(res.usersChart, selectedMonths);
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.sponser_id}">
            <th scope="row">${elem.init_id}</th>
            <td>${elem.init_en_name}</td>
            <td>${elem.init_ar_name}</td>
            <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.sponsorImg}" alt="sponser Image"></td>
            <td><span class="text-success"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.from_date).format('DD-MM-YYYY')}</span></td>
            <td><span class="text-danger"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.to_date).format('DD-MM-YYYY')}</span></td>
            <td>${elem.featured == "1" ? `<span class="badge badge-success">Yes</span>` : `<span class="badge badge-danger">No</span>`}</td>
            <td>${elem.status == "active" ? `<span class="badge badge-success">${elem.status}</span>` : `<span class="badge badge-danger">${elem.status}</span>`}</td>
            <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
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
                label: "Initiatives per month",
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
    window.bar = new Chart($("#initiativeDetails").get(0).getContext("2d"), {
        type: "bar",
        data: chartSet,
        options: chartOptions,
    })
}

function changeType(type) {
    getList(type, fromOrder, toOrder)
    userType = type
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