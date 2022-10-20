const conf = require("../config/config");
const fs = require('fs')

function arrSum(val) {
    if (val.length > 0) {
        return val.reduce((a, b) => Number(a) + Number(b))
    } else return 0
}

function dateToYear(date) {
    return date.split("/")[2].slice(0, -1) // .split(" ")[0]
 }

function dateToMonth(date) {
    return date.split("/")[0].substring(1)
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

function convertDateFromUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000);
    // date.setDate(date.getDate()+1) // move one day back
    return "[" + date.toLocaleDateString("en-UK") + "]"
}

function convertTimeFromUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000);
    return "[" + date.toLocaleTimeString("en-UK") + "]"
}

function convertDateFromTimestamp(ts) {
    return "[" + ts.toLocaleDateString("en-UK") + "]"
}

function convertTimeFromTimestamp(ts) {
    return "[" + ts.toLocaleTimeString("en-UK") + "]"
}
  
function filterByYear(arr, year) {
    return arr.filter(val => { if (dateToYear(val.date) == year) return val })
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

function findCurrencyIndexById(id) {
    return getEnabledCurrencies().findIndex(val => val.id == id)
}

// *** USE IN MULTIPLE CONTROLLERS *** //

// single and combined
function getProfits(arr, ci, tp, sl) {
    var resultsArr = []

    var closeFlag = false

    arr.forEach( (val, i) => {

        var profit =  0

        // sl
        if (conf.sl && !closeFlag && val.profits[ci] <= sl) { closeFlag = true; profit = val.profits[ci] }

        // tp
        if (conf.tp && !closeFlag && val.profits[ci] >= tp) { closeFlag = true; profit = val.profits[ci] }

        // norm
        if (arr[i + 1] !== void 0 && val.directions[ci] != arr[i + 1].directions[ci] && !closeFlag) profit = val.profits[ci]
        else if (arr[i + 1] !== void 0 && val.directions[ci] != arr[i + 1].directions[ci]) closeFlag = false

        resultsArr.push(
            {
                date: val.date, 
                profitDaily: val.profits[ci], 
                profit: profit, 
                direction: val.directions[ci], 
                close: closeFlag 
            })
    });  

    return resultsArr
}

// single and combined
function profitsByYearArr(arr) {
    var result = []

    for (var i=conf.year.from; i<=conf.year.to; i++) {
        var yearlyArr = []
        var byYear = arr.filter(val => dateToYear(val.date) == i)
        for (var ii=1; ii<=12; ii++) {
            var byMonth = byYear.filter(val => dateToMonth(val.date) == ii)
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
    if (tp != undefined) var outputTp = "TP: " + tp + "<br>"; else var outputTp = ""
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
        output = output + 
            "<tr>" + 
                "<td>TP: " + val.tp + "</td>" +
                "<td>SL: " + val.sl + "</td>" +
                "<td>" + val.positives + "/" + val.total + "</td>" +
                "<td><strong>" + val.sums.map(val => " " + val) + "</strong></td>" +
            "</tr>" + 
            "<tr>" + 
                "<td></td>" +
                "<td></td>" +
                "<td style='color:red;'>" + arrSum(val.sums).toFixed(2)  + "</td>" +
                "<td>" + val.avarages.map(val => " " + val)  + "</td>" +
            "</tr>" +
            "<tr>" + 
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td>" + val.sums.sort( (a,b) => Number(a) - Number(b)).map(val => " " + val)  + "</td>" +

            "</tr>" 
    })
    output = output + "</table>"
    return output
}

module.exports = {
    // small
    arrSum,
    dateToYear,
    dateToMonth,
    pipsToFixed,
    roundToFixed,
    loadCurrenciesBoolArray,
    convertDateFromUnixTimestamp,
    convertTimeFromUnixTimestamp,
    convertDateFromTimestamp,
    convertTimeFromTimestamp,
    filterByYear,
    saveJson,
    getCurrencyById,
    getEnabledCurrencies,
    findCurrencyIndexById,

    // common
    getProfits,
    profitsByYearArr,
    countAvaregesAndPositives,
    sortAvaragesAndPositives,
    outputProfitsByYear,
    outputAvaragesAndPositives
}
