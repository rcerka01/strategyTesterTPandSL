const conf = require("../config/config");

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

// *** From Data.json *** //

function getProfits(arr, ci, tp, sl) {
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
        var profit = takeProfit(element.profits[ci], element.directions[ci])
        profitsArr.push({ date: element.date, profitDaily: element.profits[ci],  profit: profit, direction: element.directions[ci], close: CLOSE })

        PREV_CLOSE = CLOSE
        PREV_DIR = element.directions[ci]
        PREV_PROFIT = element.profits[ci]
    });  
    return profitsArr
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

module.exports = {
    arrSum,
    dateTimeToYear,
    dateTimeToMonth,
    getProfits,
    profitsByYearArr
}
