const conf = require("../config/config");
const com = require("./commonsController");

function joinProfits(data) {
    var depth = conf.currencies.length
    var jsonData = JSON.parse(data)
    var arr = []
    var result = []
    for (var i=0; i<depth; i++) {
        arr.push(com.getProfits(jsonData, i, 0, 0))
    }
    arr[0].forEach( (val, index) => {
        var dailies = []
        var profits = []
        var directions = []
        for (var i=0; i<depth; i++) {
            dailies.push(arr[i][index].profitDaily)
            profits.push(arr[i][index].profit)
            directions.push(arr[i][index].direction)
        }
        var item = { date: val.date, dailies: dailies, profits: profits, directions: directions, sum: com.arrSum(dailies) }
        result.push(item)
    })
    return result
}

function createOutputItem(val, closes, commonProfit) {
    return { date: val.date, dailies: val.dailies, profits: val.profits, directions: val.directions, sum: val.sum, closes: closes, profit: commonProfit }
}

function takeIfSwapDirection(dir, prevDir, closes, profits) {
    var results = []
    closes.forEach( (val, i) => {
        if (!val && prevDir[i] != dir[i]) results.push(profits[i])
    })
    return com.arrSum(results)
}

function updateCloses(prevDir, dir, prevCloses) {
    var results = []
    prevCloses.forEach( (val, i) => {
        if (prevDir[i] != dir[i]) results.push(false)
        else results.push(val)
    })
    return results
}

function isOpensGreaterTp(closes, dailies, tp) {
    var results = []
    dailies.forEach( (val, i) => {
        if (!closes[i]) results.push(val)
    })
    if (com.arrSum(results) > tp) return true
    return false
}

function closesAndProfits(closes, dailies) {
    var profits = []
    var indexes = []
    dailies.forEach( (val, i) => {
        if (!closes[i]) { profits.push(val); indexes.push(i) }
    })
    return { profit: Number(com.arrSum(profits)), indexes: indexes }
}

function killTaken(closes, indexes) {
    var results = []
    closes.forEach( (val, i) => {
       if (indexes.includes(i)) results.push(true)
       else results.push(val)
    })
    return results
}

function takeProfit(arr, tp) {
    var results = []

    var prev_directions = []
    var prev_closes = com.loadCurrenciesBoolArray(true)

    var closes = com.loadCurrenciesBoolArray(true)

    arr.forEach( val => { 
        if (isOpensGreaterTp(closes, val.dailies, tp)) {
            var cp = closesAndProfits(closes, val.dailies)
            var profit = cp.profit + com.arrSum(val.profits)
            var killIndexes = cp.indexes
            
            closes = killTaken(updateCloses(prev_directions, val.directions, prev_closes), killIndexes)
            results.push(createOutputItem(val, closes, profit))
        }
        else  {
            var profit = takeIfSwapDirection(val.directions, prev_directions, closes, val.profits)
            closes = updateCloses(prev_directions, val.directions, prev_closes)
            results.push(createOutputItem(val, closes, profit))
        }
        
        prev_directions = val.directions
        prev_closes = closes
    })

    return results
} 

function formTableArrHead(length) {
    var output = ""
    for (var i=0; i<length; i++) {
        output = output + "<th>" + conf.currencies[i] + "</th>"
    }
    return output
}

function formTableArrCells(arr, colors) {
    var output = ""
    arr.forEach( (val, i) => {
        if (typeof val == "boolean" && val) 
            output = output + "<td style='color:black;'>" + val + "</td>"
        else
            output = output + "<td style='color:" + colors[i] + ";'>" + val + "</td>"
    })
    return output
} 

function outputResult(arr) {
    var length = conf.currencies.length
    var output = "<table>"
    output = output 
                + "<tr>"
                + "<th>date</th>"
                + "<th colspan='" + length + "'>profit</th>"
                + "<th>sum</th>"
                + "<th colspan='" + length + "'>taken</th>"
                + "<th colspan='" + length + "'>close</th>"
                + "<th>prof</th>"
                + "</tr>"

                + "<tr>"
                + "<th></th>"
                + formTableArrHead(length)
                + "<th></th>"
                + formTableArrHead(length)
                + formTableArrHead(length)
                + "<th></th>"
                + "</tr>"
    arr.forEach( val => {
        output = output 
                    + "<tr>"
                    + "<td>" + val.date + "</td>"
                    + formTableArrCells(val.dailies, val.directions)
                    + "<td>" + Number(val.sum).toFixed(2) + "</td>"
                    + formTableArrCells(val.profits, val.directions)
                    + formTableArrCells(val.closes, val.directions)
                    + "<td>" + Number(val.profit).toFixed(2) + "</td>"
                    + "</tr>"
    })

    output = output + "</table>"
    return output
}

module.exports = { run: function (data) {

    var joined = joinProfits(data)
    var result = takeProfit(joined, 300)
    var profitsByYear = com.profitsByYearArr(result)

    console.log(profitsByYear)

    var output = outputResult(result)

    return output
}}
