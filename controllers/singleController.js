const com = require("./commonsController");
const conf = require("../config/config");

var CI = com.getEnabledCurrencies().findIndex(val => val.id == conf.single.currencyId)

// *** FROM data.json *** //

/* CONTROLLER */

function countAvaregesAndPositives(arr, tp, sl) {
    var positives = 0
    var total = 0
    var avarages = []
    var sums = []
    arr.forEach( val => {
        sums.push(com.pipsToFixed(val.sum))

        var av = com.arrSum(val.profits) / val.profits.length
        avarages.push(com.pipsToFixed(av))

        val.profits.forEach( prof => {
            total = total + 1
            if (prof > 0) positives = positives + 1
        })
    })
    return { tp, sl, avarages, positives, total, sums }
}

function sortAvaragesAndPositives(arr) {
    return  arr.sort((a,b) => Number(b.positives) - Number(a.positives))
}

/* OUTPUTT */

// 1
function outputAvaragesAndPositives(arr) {
    var output = "<table>"
    arr.forEach( val => {
        output = output + "<tr>" + 
        "<td>TP: " + val.tp + "</td>" +
        "<td>SL: " + val.sl + "</td>" +
        "<td>" + val.positives + "/" + val.total + "</td>" +
        "<td>TP: " + val.avarages+ "</td>" +
        "<td><strong>" + val.sums + "</strong></td>" +
        "<td style='color:red;'>" + com.arrSum(val.sums).toFixed(2) + "</td>" +
        "</tr>" 
    })
    output = output + "</table>"
    return output
}

// 2
function outputProfits(arr) {
    var output = "<table><tr><th></th><th></th><th>Daily</th><th>Profit</th><th>close</th></tr>"
    arr.forEach( (element, i) => {

        if (!element.close) var color = element.direction 
        else var color= "black"

        output = output + "<tr>" +
        "<td>" + i + "</td>" +
        "<td>" + element.date + "</td>" +
        "<td><span style='color:" + element.direction + ";'>" + com.pipsToFixed(element.profitDaily) + "</span></td>" +
        "<td>" + com.pipsToFixed(element.profit)  + "</td>" +
        "<td><span style='color:" + color + ";'>" + element.close + "</td>" +
        "</tr>" 
    })
    output = output + "</table>"
    return output
}


module.exports = { run: function (data) {
    var jsonData = JSON.parse(data)
    var output = ""

    switch (conf.single.switch) {
        case 1:
            var startTp = conf.single.multipleTP.start
            var stopTp = conf.single.multipleTP.stop
            var stepTp = conf.single.multipleTP.step
           
            var startSl = conf.single.multipleSl.start
            var stopSl = conf.single.multipleSl.stop
            var stepSl = conf.single.multipleSl.step

            var avAndPos = []
            var outputProfitsByYear = ""
            for (var i=startTp; i<=stopTp; i=i+stepTp) {
                for (var ii=startSl; ii<=stopSl; ii=ii+stepSl) {
                    var profits = com.getProfits(jsonData, CI, i/10000, ii/10000)
                    var profitsByYear = com.profitsByYearArr(profits)

                    avAndPos.push(countAvaregesAndPositives(profitsByYear, i, ii))

                    outputProfitsByYear = outputProfitsByYear + "<br>" +  com.outputProfitsByYear(profitsByYear, i, ii) 
                }
            }

            output = output + outputAvaragesAndPositives(sortAvaragesAndPositives(avAndPos)) + outputProfitsByYear
        break

        case 2:
            var tp = conf.single.singleTp
            var sl = conf.single.singleSl
            var profits = com.getProfits(jsonData, CI, tp/10000, sl/10000)
            var profitsByYear = com.profitsByYearArr(profits)

            output = com.outputProfitsByYear(profitsByYear, tp, sl) + outputProfits(profits)
        break
    }

    return output
}}
