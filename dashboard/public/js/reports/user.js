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
        url: `/dashboard/report/${type}/userlistreport?from=${from}&to=${to}`,
        method: "Get",
    }
    $.ajax(settings).done(function (res) {
        // hidden spinner
        spinnerNotfound(2)
        $("#tr-th-row").empty()
        const usersInYear = res.usersChart ? res.usersChart : JSON.parse(`<%-JSON.stringify(res.data.usersInYear)%>`);
        const fromMonth = !from ? undefined : monthsChart[new Date(from).getMonth()];
        const toMonth = !to ? undefined : monthsChart[new Date(to).getMonth()];
        const selectedMonths = fromMonth && toMonth ? [...new Set([fromMonth, toMonth])] : undefined;
        changeChart(usersInYear, selectedMonths);
        res.data.forEach((elem) => {
            $("#tr-th-row").append(`<tr id="${elem.user_id}">
            <th scope="row">${elem.user_id}</th>
            <td>${elem.fullName || "—"}</td>
            <td>${elem.gender || "—"}</td>
            <td>${new Date(elem.birth_date).toLocaleDateString("en-US") || "—"}</td>
            <td>${elem.email ? `<a class="text-dark" href='mailto:${elem.email}'>${elem.email}</a>` : "—"}</td>
            <td>${elem.phone ? `<a class="text-dark" href='tel:${elem.phone}'>${elem.phone}</a>` : "—"}</td>
            <td>${elem.account_status == "active" ? `<span class="badge badge-success">${elem.account_status}</span>` : `<span class="badge badge-danger">${elem.account_status}</span>`}</td>
            <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
            <td>${elem.sahlan_gained_points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "—"}</td>
            <td>${elem.carbon_gained_points || "—"}</td>
            <td>
                <span class="text-info"><i class="fas fa-calendar-alt"></i>&emsp;${moment(elem.createdAt).format('DD-MM-YYYY')}</span><br />
                <span class="text-danger"><i class="fas fa-clock"></i>&emsp;${moment(elem.createdAt).format('LT')}</span>
            </td>
            </tr>`)
        })
    }).fail(() => spinnerNotfound(3))
}
function changeType(type) {
    getList(type, fromOrder, toOrder)
    userType = type
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
                label: "New Users per month",
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
    window.bar = new Chart($("#userDetails").get(0).getContext("2d"), {
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