const com = require("./commonsController");
const conf = require("../config/config");

// *** FROM data.json *** //

/* CONTROLLER */

function joinProfits(data) {
    var jsonData = JSON.parse(data)
    var currencies = com.getEnabledCurrencies()

    var arr = []
    var result = []

    currencies.forEach( val => {
        arr.push(com.getProfits(jsonData, com.findCurrencyIndexById(val.id), conf.single.singleTp, conf.single.singleSl)) 
    })

    arr[0].forEach( (val, index) => {
        var dailies = []
        var profits = []
        var directions = []
        for (var i=0; i < currencies.length; i++) {
            dailies.push(arr[i][index].profitDaily)
            profits.push(arr[i][index].profit)
            directions.push(arr[i][index].direction)
        }
        var item = { date: val.date, dailies: dailies, profits: profits, directions: directions, sum: com.arrSum(dailies) }
        result.push(item)
    })
    return result
}

function isOpensSmallerSl(closes, dailies, sl) {
    var results = []
    dailies.forEach( (val, i) => {
        if (!closes[i]) results.push(val)
    })
    if (com.pipsToFixed(com.arrSum(results)) < sl) return true
    return false
}

function isOpensGreaterTp(closes, dailies, tp) {
    var results = []
    dailies.forEach( (val, i) => {
        if (!closes[i]) results.push(val)
    })
    if (com.pipsToFixed(com.arrSum(results)) > tp) return true
    return false
}

function createOutputItem(val, closes, commonProfit) {
    return { 
        date: val.date, 
        dailies: val.dailies, 
        profits: val.profits, 
        directions: val.directions, 
        sum: val.sum, 
        closes: closes.map(Boolean), 
        profit: commonProfit }
}

function takeProfit(arr, tp, sl) {
    var results = []
    var closes = com.loadCurrenciesBoolArray(false)

    arr.forEach( val => {
        var profits = []

        if (isOpensGreaterTp(closes, val.dailies, tp) || isOpensSmallerSl(closes, val.dailies, sl)) {
            closes.forEach( (close, i) => {
                if (!close) { closes[i] = true; profits.push(val.dailies[i]) }
            })
        } 

        closes.forEach( (close, i) => {
            if (val.profits[i] != 0) { 
                if (close) closes[i] = false
                else profits.push(val.profits[i]) 
            }
        })

        results.push(createOutputItem(val, closes, com.arrSum(profits)))
    })

    return results
}

/* OUTPUTT */

function formTableArrHead(currencies) {
    var output = ""
    currencies.forEach( val => {
        output = output + "<th>" + val.name + "</th>"
    })
    return output
}

function formTableArrCells(arr, colors, closes) {
    var output = ""
    var strongOpen = ""
    var strongClose = ""
    arr.forEach( (val, i) => {
        if (typeof val == "boolean" && val) 
            output = output + "<td style='color:black;'>" + val + "</td>"
        else {
            if (closes !== void 0 &&!closes[i]) { strongOpen = "<strong>"; strongClose = "</strong>" }
            else { strongOpen = ""; strongClose = "" }  
            output = output + "<td style='color:" + colors[i] + ";'>" + strongOpen + val + strongClose + "</td>"
        }
    })
    return output
} 

function outputResult(arr) {
    var currencies = com.getEnabledCurrencies()
    var length = currencies.length
    var output = "<table>"
    output = output 
                + "<tr>"
                + "<th>DATE</th>"
                + "<th colspan='" + length + "'>profit</th>"
                + "<th>SUM</th>"
                + "<th colspan='" + length + "'>taken</th>"
                + "<th>PROFIT</th>"
                + "<th colspan='" + length + "'>close</th>"
                + "</tr>"

                + "<tr>"
                + "<th></th>"
                + formTableArrHead(currencies)
                + "<th></th>"
                + formTableArrHead(currencies)
                + "<th></th>"
                + formTableArrHead(currencies)
                + "</tr>"
    arr.forEach( val => {
        output = output 
                    + "<tr>"
                    + "<td>" + val.date + "</td>"
                    + formTableArrCells(val.dailies.map(com.pipsToFixed), val.directions, val.closes)
                    + "<td><strong>" + com.pipsToFixed(val.sum) + "</strong></td>"
                    + formTableArrCells(val.profits.map(com.pipsToFixed), val.directions)
                    + "<td><strong>" + com.pipsToFixed(val.profit) + "</strong></td>"
                    + formTableArrCells(val.closes, val.directions)
                    + "</tr>"
    })

    output = output + "</table>"
    return output
}

module.exports = { run: function (data) {
    var joined = joinProfits(data)

    var output = ""

    var startTp = conf.combined.multipleTP.start
    var stopTp = conf.combined.multipleTP.stop
    var stepTp = conf.combined.multipleTP.step


    var startSl = conf.combined.multipleSL.start
    var stopSl = conf.combined.multipleSL.stop
    var stepSl = conf.combined.multipleSL.step

    switch (conf.combined.switch) {
        case 1:
            var result = takeProfit(joined, conf.combined.tp, conf.combined.sl)
            var profitsByYear = com.profitsByYearArr(result)
        
            output = output + com.outputProfitsByYear(profitsByYear,conf.combined.tp, conf.combined.sl) + "<br>" + outputResult(result)
            break

        case 2:
            var avAndPos = []
            var outputProfitsByYear = ""
            for (var i=startTp; i<=stopTp; i=i+stepTp) {

                for (var ii=startSl; ii<=stopSl; ii=ii+stepSl) {
                    var result = takeProfit(joined, i)
                    var profitsByYear = com.profitsByYearArr(result)

                    avAndPos.push(com.countAvaregesAndPositives(profitsByYear, i, ii))

                    outputProfitsByYear = outputProfitsByYear + "<br>" +  com.outputProfitsByYear(profitsByYear, i, ii)
                }
            }

            output = output + com.outputAvaragesAndPositives(com.sortAvaragesAndPositives(avAndPos)) + outputProfitsByYear
        break
    }

    return output
}}
