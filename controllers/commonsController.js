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

function pipsToFixed(val) {
    return Number(val * 10000).toFixed(2)
}

function roundToFixed(val) {
    return Number(val).toFixed(5)
}

function loadCurrenciesBoolArray(bool) {
    var results = []
    var length = getEnabledCurrencies().length
    for (i=0; i<length; i++) {
        results.push(bool)
    }
    return results
}

function convertTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000);
    date.setDate(date.getDate()+1) // move one day back
    return "[" + date.toLocaleDateString("en-UK") + " " + date.toLocaleTimeString("en-UK") + "]"
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

function getCurrencyById(id) {
    return conf.mapper.find(val => val.id == id)
}

function getEnabledCurrencies() {
    return conf.mapper.filter(val => val.enabled == true)
}

// *** USE IN MULTIPLE CONTROLLERS *** //

// single and combined
function getProfits(arr, ci, tp, sl) {
    var profitsArr = [] 
    var CLOSE = false
    var PREV_CLOSE = true
    var PREV_PROFIT = 0
    var PREV_DIR = ""
    function takeProfit(profit, dir) {

        // for single output with TP and SL
        if (tp != 0 || sl != 0) {
            // disable to remove SL
            if (sl != 0) {
                if (!CLOSE && profit <= sl) { CLOSE = true; return profit }
                else if (PREV_DIR != dir && profit <= sl) { CLOSE = true; return profit }
            }
            
            if (PREV_CLOSE == false && PREV_DIR != dir && profit >= tp) { CLOSE = true; return Number(PREV_PROFIT) + Number(profit) }
            else if (!CLOSE && profit >= tp) { CLOSE = true; return profit }
            else if (!CLOSE && PREV_DIR != dir) { return PREV_PROFIT }
            else if (CLOSE && PREV_DIR != dir) {
                if (profit >= tp) return profit
                else { CLOSE = false; return 0 }
            }
            else return 0
        }

        // only this to remove TP and SL (use in combined), and: var CLOSE = false
        if (tp == 0 && sl ==0) {
            if (!CLOSE && PREV_DIR != dir) { CLOSE = false; return PREV_PROFIT }
            else return 0
        }
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

// single and combined
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

// single and combined
function countAvaregesAndPositives(arr, tp, sl) {
    var positives = 0
    var total = 0
    var avarages = []
    var sums = []
    arr.forEach( val => {
        sums.push(pipsToFixed(val.sum))

        var av = arrSum(val.profits) / val.profits.length
        avarages.push(pipsToFixed(av))

        val.profits.forEach( prof => {
            total = total + 1
            if (prof > 0) positives = positives + 1
        })
    })
    return { tp, sl, avarages, positives, total, sums }
}

// single and combined
function sortAvaragesAndPositives(arr) {
    return  arr.sort((a,b) => Number(b.positives) - Number(a.positives))
}

// single and combined
function outputProfitsByYear(arr, tp, sl) {
    if (tp != undefined) var outputTp = "TP: " + tp; else var outputTp = ""
    if (sl != undefined) var outputSl = "SL: " + sl; else var outputSl = ""
    var output = "<table style='border: 1px solid black;'>" +
                    "<tr>"
    arr.forEach( val => {
        output = output + "<th>" + val.year + "<br>" + outputTp + " " + outputSl + "</th>"
    })
    output = output + "</tr><tr>"
    arr.forEach( val => {
        output = output + "<td>" + 
        "January: " + pipsToFixed(val.profits[0]) + "<br>" +
        "February: " + pipsToFixed(val.profits[1]) + "<br>" +
        "March: " + pipsToFixed(val.profits[2]) + "<br>" + 
        "April: " + pipsToFixed(val.profits[3]) + "<br>" + 
        "May: " + pipsToFixed(val.profits[4]) + "<br>" + 
        "June: " + pipsToFixed(val.profits[5]) + "<br>" + 
        "July: " + pipsToFixed(val.profits[6]) + "<br>" + 
        "August: " + pipsToFixed(val.profits[7]) + "<br>" + 
        "September: " + pipsToFixed(val.profits[8]) + "<br>" +
        "October: " + pipsToFixed(val.profits[9]) + "<br>" +
        "November: " + pipsToFixed(val.profits[10]) + "<br>" +
        "December: " + pipsToFixed(val.profits[11]) + "<br>" +
      "</td>"
    })
    output = output + "</tr><tr>"
    arr.forEach( val => {
        output = output + "<th>" + pipsToFixed(val.sum) + "</th>"
    })
    output = output + "</tr>"

    return output
}

// single and combined
function outputAvaragesAndPositives(arr) {
    var output = "<table>"
    arr.forEach( val => {
        output = output + "<tr>" + 
        "<td>TP: " + val.tp + "</td>" +
        "<td>SL: " + val.sl + "</td>" +
        "<td>" + val.positives + "/" + val.total + "</td>" +
        "<td>TP: " + val.avarages+ "</td>" +
        "<td><strong>" + val.sums + "</strong></td>" +
        "<td style='color:red;'>" + arrSum(val.sums).toFixed(2) + "</td>" +
        "</tr>" 
    })
    output = output + "</table>"
    return output
}

module.exports = {
    // small
    arrSum,
    dateTimeToYear,
    dateTimeToMonth,
    pipsToFixed,
    roundToFixed,
    loadCurrenciesBoolArray,
    convertTimestamp,
    filterByYear,
    saveJson,
    getCurrencyById,
    getEnabledCurrencies,

    // common
    getProfits,
    profitsByYearArr,
    countAvaregesAndPositives,
    sortAvaragesAndPositives,
    outputProfitsByYear,
    outputAvaragesAndPositives
}
