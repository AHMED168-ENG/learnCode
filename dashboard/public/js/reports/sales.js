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
        url: `/dashboard/order/completed/listreport?from=${from}&to=${to}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        const fromMonth = !from ? undefined : monthsChart[new Date(from).getMonth()];
        const toMonth = !to ? undefined : monthsChart[new Date(to).getMonth()];
        const selectedMonths = fromMonth && toMonth ? [...new Set([fromMonth, toMonth])] : undefined;
        changeChart(res.ordersChart, selectedMonths);
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        res.data.forEach((elem, i) => {
            $("#tr-th-row").append(`<tr id="${elem.order_id}">
            <th scope="row">${i + 1}</th>
            <td><a href="/dashboard/user/edit/${elem.user_id}" class="btn btn-link text-dark">${elem.user_name}</a></td>
            <td class="text-center"><a href="/dashboard/order/view/${elem.order_id}" data-tooltip="View order">${elem.order_id}</a></td>
            <td class="text-danger">${(elem.all_sum * (elem.promo_code_percent ? elem.promo_code_percent / 100 : 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SAR</td>
            <td><span class="text-success">${(elem.all_sum - (elem.all_sum * (elem.promo_code_percent ? elem.promo_code_percent / 100 : 0))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SAR</span></td>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            </tr>`)
        })
        const sum = res.data.reduce((a, b) => a + (b.all_sum - (b.all_sum * (b.promo_code_percent ? b.promo_code_percent / 100 : 0))), 0)
        $("#tr-th-row").append(`<tr>
        <th scope="row"></th><td></td><td></td><td></td>
        <td class="text-center"><strong>${sum} SAR</strong></td>
        <td></td>
        </tr>`)
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
                label: "Sales per month",
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
    window.bar = new Chart($("#salesDetails").get(0).getContext("2d"), {
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