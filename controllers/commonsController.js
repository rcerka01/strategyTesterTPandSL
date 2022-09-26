const conf = require("../config/config");
const fs = require('fs')

function arrSum(val) {
    if (val.length > 0) {
        return val.reduce((a, b) => Number(a) + Number(b))
    } else return 0
}

function dateTimeToYear(time) {
    return time.split("/")[2].split(" ")[0]
 }

function dateTimeToMonth(time) {
    return time.split("/")[0].substring(1)
}

function loadCurrenciesBoolArray(bool) {
    var results = []
    for (i=0; i<conf.currencies.length; i++) {
        results.push(bool)
    }
    return results
}

function convertTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000);
    return "[" + date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US") + "]"
  }
  
function filterByYear(arr, year) {
    return arr.filter(val => { if (dateTimeToYear(val.time) == year) return val })
}

function saveJson(json) {
    fs.writeFile("data.json", JSON.stringify(json), function(err) {
        if (err) {
            console.log(err);
        }
    });
}



// *** For fileController *** //

function transfearDaysArr(daysArr) {
    var transfearResult = []

    daysArr[0].forEach( firstFileItem => {
        if (firstFileItem !== void 0) {
            var profits = []
            var closes = []
            var directions = []

            profits.push(firstFileItem.profit)
            closes.push(firstFileItem.close)
            directions.push(firstFileItem.direction)
            
            for (var i=1; i<conf.currencies.length; i++) {
                var val = daysArr[i].find(date => date.time === firstFileItem.time)
                if (val !== void 0) {
                profits.push(val.profit)
                closes.push(val.close)
                directions.push(val.direction)
                }
            }

            transfearResult.push({
                date: firstFileItem.time,
                closes: closes,
                profits: profits,
                directions: directions
            })
        }
    })
    return transfearResult
}




// *** From Data.json *** //

function getProfits(arr, ci, tp, sl) {
    var profitsArr = [] 
    var CLOSE = false
    var PREV_CLOSE = true
    var PREV_PROFIT = 0
    var PREV_DIR = ""
    function takeProfit(profit, dir) {
        // // disable to remove SL
        // if (!CLOSE && profit <= sl) { CLOSE = true; return profit }
        // else if (PREV_DIR != dir && profit <= sl) { CLOSE = true; return profit }
        // //
        // if (PREV_CLOSE == false && PREV_DIR != dir && profit >= tp) { CLOSE = true; return Number(PREV_PROFIT) + Number(profit) }
        // else if (!CLOSE && profit >= tp) { CLOSE = true; return profit }
        // else if (!CLOSE && PREV_DIR != dir) { return PREV_PROFIT }
        // else if (CLOSE && PREV_DIR != dir) {
        //     if (profit >= tp) return profit
        //     else { CLOSE = false; return 0 }
        // }
        // else return 0
        // only this to remove TP and SL, and: var CLOSE = false
        if (!CLOSE && PREV_DIR != dir) { CLOSE = false; return PREV_PROFIT }
        else return 0
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
    loadCurrenciesBoolArray,
    convertTimestamp,
    filterByYear,
    saveJson,

    transfearDaysArr,

    getProfits,
    profitsByYearArr
}
