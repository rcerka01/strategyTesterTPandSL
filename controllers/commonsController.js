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

function getMarginGbp(currency) {
    return currency.lot / currency.leverage * currency.value * currency.marginToGBP
}

function convertToPips(val, currency) {
    return val / currency.pip
}

function getOnePipValueGbp(currency) {
    return currency.lot * currency.value * currency.pip * currency.pipToGBP
}

function createTitle(currency) {
    return currency.name + "<br> margin: " + getMarginGbp(currency).toFixed(2) + 
        " pip: "    + currency.pip + " or " + getOnePipValueGbp(currency).toFixed(2) + " gbp"
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
function getProfits(arr, ci, tp, sl, currency, isCombined) {
    var resultsArr = []

    var closeFlag = false
    var inGbp = conf.single.tpSlInGBP

    var onePipValueInGbp = getOnePipValueGbp(currency) 

    // deduct spread
    if (conf.single.deductSpread)  {
        var spreadToDeductInGbp = conf.single.spread
        var spreadToDeductInPip = conf.single.spread / onePipValueInGbp * currency.pip
    } else { 
        var spreadToDeductInGbp = 0
        var spreadToDeductInPip = 0
    }

    arr.forEach( (val, i) => {
        var profit =  0

        var profitFromArr = convertToPips(val.profits[ci], currency)
        if (inGbp) { profitFromArr = profitFromArr * onePipValueInGbp - spreadToDeductInGbp }

        // sl
        if (conf.sl && !closeFlag && profitFromArr <= sl) { closeFlag = true; profit = val.profits[ci] - spreadToDeductInPip }

        // tp
        if (conf.tp && !closeFlag && profitFromArr >= tp) { closeFlag = true; profit = val.profits[ci] - spreadToDeductInPip }

        // norm
        if (arr[i + 1] !== void 0 && val.directions[ci] != arr[i + 1].directions[ci] && !closeFlag) profit = val.profits[ci] - spreadToDeductInPip
        else if (arr[i + 1] !== void 0 && val.directions[ci] != arr[i + 1].directions[ci]) closeFlag = false

        // combined returns profit in GBP
        if (isCombined) {
            resultsArr.push(
                {
                    date: val.date, 
                    profitDaily: convertToPips(val.profits[ci], currency) * onePipValueInGbp,
                    profit: convertToPips(profit, currency) * onePipValueInGbp,
                    direction: val.directions[ci], 
                    close: closeFlag 
                })
        } else {
            resultsArr.push(
                {
                    date: val.date, 
                    profitDaily: val.profits[ci], 
                    profit: profit, 
                    direction: val.directions[ci], 
                    close: closeFlag 
                })
        }
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
    var sums = []
    var monthlyProfits = []


    arr.forEach( val => {
        sums.push(val.sum)

        monthlyProfits.push(val.profits)

        val.profits.forEach( prof => {
            total = total + 1
            if (prof > 0) positives = positives + 1
        })
    })

    monthlyProfits = monthlyProfits.flatMap(val => val)

    return { tp, sl, monthlyProfits, positives, total, sums }
}

// single
function outputProfitsByYear(arr, tp, sl, currency) {
    if (tp != undefined) var outputTp = "TP: " + tp + "<br>"; else var outputTp = ""
    if (sl != undefined) var outputSl = "SL: " + sl; else var outputSl = ""

    var onePipvalue = getOnePipValueGbp(currency)

    var output = createTitle(currency) + "<br>"
    
    output = output + "<table style='border: 1px solid black;'>"

    output = output + "<tr>"
    arr.forEach( val => {
        output = output + "<th>" + val.year + "<br>" + outputTp + " " + outputSl + "</th>"
    })
    output = output + "</tr>"

    output = output + "<tr>"

    var inlineMonthlyProfits = []

    arr.forEach( (val, i) => {

        var pips0 = convertToPips(val.profits[0], currency)
        var pips1 = convertToPips(val.profits[1], currency)
        var pips2 = convertToPips(val.profits[2], currency)
        var pips3 = convertToPips(val.profits[3], currency)
        var pips4 = convertToPips(val.profits[4], currency)
        var pips5 = convertToPips(val.profits[5], currency)
        var pips6 = convertToPips(val.profits[6], currency)
        var pips7 = convertToPips(val.profits[7], currency)
        var pips8 = convertToPips(val.profits[8], currency)
        var pips9 = convertToPips(val.profits[9], currency)
        var pips10 = convertToPips(val.profits[10], currency)
        var pips11 = convertToPips(val.profits[11], currency)

        inlineMonthlyProfits.push((pips0 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips1 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips2 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips3 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips4 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips5 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips6 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips7 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips8 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips9 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips10 * onePipvalue).toFixed(2))
        inlineMonthlyProfits.push((pips11 * onePipvalue).toFixed(2))

        output = output + "<td>" + 
        "January: " + pips0.toFixed() + " / <strong>" + (pips0 * onePipvalue).toFixed(2) + "</strong><br>" +
        "February: " + pips1.toFixed() + " / <strong>" + (pips1 * onePipvalue).toFixed(2) + "</strong><br>" +
        "March: " + pips2.toFixed() + " / <strong>" + (pips2 * onePipvalue).toFixed(2)+ "</strong><br>" + 
        "April: " + pips3.toFixed() + " / <strong>" + (pips3 * onePipvalue).toFixed(2) + "</strong><br>" + 
        "May: " + pips4.toFixed() + " / <strong>" + (pips4 * onePipvalue).toFixed(2) + "</strong><br>" + 
        "June: " + pips5.toFixed() + " / <strong>" + (pips5 * onePipvalue).toFixed(2) + "</strong><br>" + 
        "July: " + pips6.toFixed() + " / <strong>" + (pips6 * onePipvalue).toFixed(2) + "</strong><br>" + 
        "August: " + pips7.toFixed() + " / <strong>" + (pips7 * onePipvalue).toFixed(2) + "</strong><br>" + 
        "September: " + pips8.toFixed() + " / <strong>" + (pips8 * onePipvalue).toFixed(2) + "</strong><br>" +
        "October: " + pips9.toFixed() + " / <strong>" + (pips9 * onePipvalue).toFixed(2) + "</strong><br>" +
        "November: " + pips10.toFixed() + " / <strong>" + (pips10 * onePipvalue).toFixed(2) + "</strong><br>" +
        "December: " + pips11.toFixed() + " / <strong>" + (pips11 * onePipvalue).toFixed(2) + "</strong><br>" +
      "</td>"
    })

    output = output + "</tr><tr>"

    arr.forEach( (val, i) => {
        output = output + "<th>" + (convertToPips(val.sum, currency) * onePipvalue).toFixed(2) + "</th>"
    })

    output = output + "</tr>"
    output = output + "</table>"
    output = output + "<br>"
    output = output + inlineMonthlyProfits

    return output
}

// single and combined
function sortAvaragesAndPositives(arr) {
    return  arr.sort((a,b) => arrSum(b.sums) - arrSum(a.sums))
}

// single
function outputAvaragesAndPositives(arr, currency) {
    var output = "<table>"
    var onePipvalue = getOnePipValueGbp(currency)

    var positives = arr.map(val => val.positives)
    var maxPositives = Math.max.apply(Math, positives)
    
    arr.forEach( (val) => {

        output = output + 
            "<tr>" + 
                "<td>TP: " + val.tp + "</td>" +
                "<td>SL: " + val.sl + "</td>" +
                "<td>" + val.positives + "/" + val.total + "</td>" +
                "<td><strong>" + val.sums.map(val => " " + (convertToPips(val, currency) * onePipvalue).toFixed(2)) + "</strong></td>" +
            "</tr>" + 
            "<tr>" + 
                "<td>max: " + maxPositives + " / </td>" +
                "<td>" + (val.positives / val.total * 100).toFixed() + "%</td>" +
                "<td style='color:red;'>" + (convertToPips(arrSum(val.sums), currency) * onePipvalue).toFixed(2)  + "</td>" +
                "<td>" + val.sums.sort((a,b) => Number(a) - Number(b)).map(val => " " + (convertToPips(val, currency) * onePipvalue).toFixed(2))  + "</td>" +
            "</tr>" +
            "<tr>" + 
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td>" + val.monthlyProfits.map(val => (convertToPips(val, currency) * onePipvalue).toFixed(2))  + "</td>" +
            "</tr>" +
                "<tr>" + 
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td>" + val.monthlyProfits.sort((a,b) => a - b).map(val => (convertToPips(val, currency) * onePipvalue).toFixed(2))  + "</td>" +
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
    getMarginGbp,
    convertToPips,
    getOnePipValueGbp,
    createTitle,
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
