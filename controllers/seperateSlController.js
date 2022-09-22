const conf = require("../config/config");

var CI = 6

// var AVARAGE = []

function arrSum(val) {
    if (val.length > 0) {
        return val.reduce((a, b) => Number(a) + Number(b))
    }
}

function dateTimeToYear(time) {
    return time.split("/")[2].split(" ")[0]
 }

function dateTimeToMonth(time) {
    return time.split("/")[0].substring(1)
}

function getProfits(arr, tp, sl) {
    var profitsArr = [] 
    var CLOSE = true
    var PREV_CLOSE = true
    var PREV_PROFIT = 0
    var PREV_DIR = ""
    function takeProfit(profit, dir) {
        // disable to remove SL
        if (!CLOSE && profit <= sl) { CLOSE = true; return profit }
        else if (PREV_DIR != dir && profit <= sl) { CLOSE = true; return profit }
        //
        if (PREV_CLOSE == false && PREV_DIR != dir && profit >= tp) { CLOSE = true; return Number(PREV_PROFIT) + Number(profit) }
        else if (!CLOSE && profit >= tp) { CLOSE = true; return profit }
        else if (!CLOSE && PREV_DIR != dir) { return PREV_PROFIT }
        else if (CLOSE && PREV_DIR != dir) {
            if (profit >= tp) return profit
            else { CLOSE = false; return 0 }
        }
        else return 0
        // only this to remove TP and SL, and: var CLOSE = false
        // if (!CLOSE && PREV_DIR != dir) { CLOSE = false; return PREV_PROFIT }
        // else return 0
    }
    arr.forEach( (element, i) => {
        var profit = takeProfit(element.profits[CI], element.directions[CI])
        profitsArr.push({ date: element.date, profitDaily: element.profits[CI],  profit: profit, direction: element.directions[CI], close: CLOSE })

        PREV_CLOSE = CLOSE
        PREV_DIR = element.directions[CI]
        PREV_PROFIT = element.profits[CI]
    });  
    return profitsArr
}

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

function profitsByYearArr(arr) {
    var result = []

    for (var i=conf.year.from; i<=conf.year.to; i++) {
        var yearlyArr = []
        var byYear = arr.filter(val => dateTimeToYear(val.date) == i)
        for (var ii=1; ii<=12; ii++) {
            var byMonth = byYear.filter(val => dateTimeToMonth(val.date) == ii)
            yearlyArr.push(arrSum(byMonth.map(val => val.profit)))
        }
        result.push({ year: i, profits: yearlyArr, sum: arrSum(yearlyArr.filter(val => val != undefined))})
    }

    return result
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

    var sumOfSum = arrSum(periodSum)
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
            var profits = getProfits(jsonData, i, ii)
            output = output + outputProfitsByYear(profitsByYearArr(profits), i, ii)
        }
    }
    // var av = AVARAGE.sort((a,b) => Number(a.av) - Number(b.av))
    // output = output + "<br>" + av.map(val => JSON.stringify(val) + "<br>")

    // var profits = getProfits(jsonData, tp, sl)
    // output = output + outputProfitsByYear(profitsByYearArr(profits), tp, sl)

    // var profits = getProfits(jsonData, tp, sl)
    // var output = outputProfits(profits)

    return output
}}
