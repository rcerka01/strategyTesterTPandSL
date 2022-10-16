const com = require("./commonsController");
const conf = require("../config/config");

var CI = com.findCurrencyIndexById(conf.single.currencyId)

// *** FROM data.json *** //

/* OUTPUTT */

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
            var tp = conf.single.singleTp
            var sl = conf.single.singleSl
            var profits = com.getProfits(jsonData, CI, tp/10000, sl/10000)
            var profitsByYear = com.profitsByYearArr(profits)

            output = com.outputProfitsByYear(profitsByYear, tp, sl) + outputProfits(profits)
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
                    var profits = com.getProfits(jsonData, CI, i/10000, ii/10000)
                    var profitsByYear = com.profitsByYearArr(profits)

                    avAndPos.push(com.countAvaregesAndPositives(profitsByYear, i, ii))

                    outputProfitsByYear = outputProfitsByYear + "<br>" +  com.outputProfitsByYear(profitsByYear, i, ii) 
                }
            }

            output = output + com.outputAvaragesAndPositives(com.sortAvaragesAndPositives(avAndPos)) + outputProfitsByYear
        break

    }

    return output
}}
