const com = require("./commonsController");
const conf = require("../config/config");

// *** FROM data.json *** //

/* OUTPUTT */

function outputProfits(arr, currency) {
    var output = "<table><tr><th></th><th></th><th>Daily PIPs</th><th>Daily GBP</th><th>Profit PIPs</th><th>Profit GBP</th><th>close</th></tr>"
    arr.forEach( (element, i) => {
        if (!element.close) var color = element.direction 
        else var color= "black"

        var onePip = com.getOnePipValueGbp(currency)

        var dailyProfitInPips = com.convertToPips(element.profitDaily, currency)
        var dailyProfitInGBP = dailyProfitInPips * onePip

        var profitInPips = com.convertToPips(element.profit, currency)
        var profitInGBP = profitInPips * onePip

        output = output + "<tr>" +
        "<td>" + i + "</td>" +
        "<td>" + element.date + "</td>" +
        "<td><span style='color:" + element.direction + ";'>" + dailyProfitInPips.toFixed() + "</span></td>" +
        "<td><span style='color:" + element.direction + ";'>" + dailyProfitInGBP.toFixed(2) + "</span></td>" +
        "<td>" + profitInPips.toFixed()  + "</td>" +
        "<td>" + profitInGBP.toFixed(2)  + "</td>" +
        "<td><span style='color:" + color + ";'>" + element.close + "</td>" +
        "</tr>" 
    })
    output = output + "</table>"
    return output
}

module.exports = { run: function (data) {
    var jsonData = JSON.parse(data)

    var ci = com.findCurrencyIndexById(conf.single.currencyId)

    var currency = conf.mapper.find(currency => currency.id == conf.single.currencyId)

    var output = currency.name + "<br>"

    switch (conf.single.switch) {
        case 1:
            var tp = conf.single.singleTp
            var sl = conf.single.singleSl

            var avAndPos = []

            var profits = com.getProfits(jsonData, ci, tp, sl, currency)
            var profitsByYear = com.profitsByYearArr(profits)
            avAndPos.push(com.countAvaregesAndPositives(profitsByYear, tp, sl))

            output = com.outputAvaragesAndPositives(com.sortAvaragesAndPositives(avAndPos), currency)
                   +com.outputProfitsByYear(profitsByYear, tp, sl, currency) 
                   + outputProfits(profits, currency)
        break

        case 2:
            var startTp = conf.single.multipleTP.start
            var stopTp = conf.single.multipleTP.stop
            var stepTp = conf.single.multipleTP.step
           
            var startSl = conf.single.multipleSL.start
            var stopSl = conf.single.multipleSL.stop
            var stepSl = conf.single.multipleSL.step

            var avAndPos = []
            var outputProfitsByYear = ""
            for (var i=startTp; i<=stopTp; i=i+stepTp) {
                for (var ii=startSl; ii<=stopSl; ii=ii+stepSl) {

                    var profits = com.getProfits(jsonData, ci, i, ii, currency)
                    var profitsByYear = com.profitsByYearArr(profits)

                    avAndPos.push(com.countAvaregesAndPositives(profitsByYear, i, ii))

                    outputProfitsByYear = outputProfitsByYear + "<br>" +  com.outputProfitsByYear(profitsByYear, i, ii, currency) 
                }
            }

            output = output + com.outputAvaragesAndPositives(com.sortAvaragesAndPositives(avAndPos), currency) + outputProfitsByYear
        break
    }
    return output
}}
