const com = require("./commonsController");

var CI = 6

function outputProfits(arr) {
    var output = "<table>"
    arr.forEach( (element, i) => {
        output = output + "<tr>" +
        "<td>" + i + "</td>" +
        "<td>" + element.date + "</td>" +
        "<td><span style='color:" + element.direction + ";'>" + element.profitDaily + "</span></td>" +
        "<td>" + element.profit  + "</td>" +
        "<td>" + element.close + "</td>" +
        "</tr>" 
    })
    output = output + "</table>"
    return output
}

function outputProfitsByYear(arr, tp, sl) {
    var output = "<table><tr><th>TP</th><th>SL</th><th>year</th><th>January</th><th>February</th>" + 
    "<th>March</th><th>April</th><th>May</th><th>June</th><th>July</th><th>August</th><th>September</th><th>October</th>" + 
    "<th>November</th><th>December</th><th>sum</th></tr>"

    var periodSum = []

    var positives = 0

    arr.forEach(val => {
        output = output + "<tr>"
        output = output + "<td>" + tp + "</td>"
        output = output + "<td>" + sl + "</td>"
        output = output + "<td><strong>" + val.year + "</strong></td>"

        val.profits.forEach(prof => {
            output = output + "<td>" + Number(prof).toFixed(2) + "</td>"
        })

        output = output + "<td>" + Number(val.sum).toFixed(2) + "</td>" 
        output = output + "</tr>"

        if (Number(val.sum) > 0) positives = positives + 1
        periodSum.push(val.sum)
    })

    var sumOfSum = com.arrSum(periodSum)
    output = output + "<tr><td></td><td>" + (sumOfSum / 13).toFixed(0) + "</td></tr>"

    output = output + "</table>"

   //  AVARAGE.push({ av: Number(sumOfSum / 13), tp: tp, sl: sl, positives: positives })

    return output
}

module.exports = { run: function (data) {
    var jsonData = JSON.parse(data)

    var tp = 0
    var sl = -30

    var output = ""

    for (var ii=-200; ii<=0; ii=ii+10) {
        for (var i=0; i<=300; i=i+20) {
            var profits = com.getProfits(jsonData, CI, i, ii)
            output = output + outputProfitsByYear(com.profitsByYearArr(profits), i, ii)
        }
    }
    // var av = AVARAGE.sort((a,b) => Number(a.av) - Number(b.av))
    // output = output + "<br>" + av.map(val => JSON.stringify(val) + "<br>")

    // var profits = com.getProfits(jsonData, CI, tp, sl)
    // output = output + outputProfitsByYear(com.profitsByYearArr(profits), tp, sl)

    // var profits = com.getProfits(jsonData, CI, tp, sl)
    // var output = outputProfits(profits)

    return output
}}
