const conf = require("../config/config");

let CURRENCIES = conf.currencies

var GREY_DIRECTIONS = []

var PREV_DIRECTIONS = []
var PREV_GREY_DIRECTIONS = []

function loadGreyDirections(bool) {
    var directions = []
    for (i=0; i<conf.currencies.length; i++) {
        directions.push(bool)
    }
    return directions
}

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

module.exports = { run: function (data) {
    var profits = []

    var yearly_profits = []

    var jsonData = JSON.parse(data)
    GREY_DIRECTIONS = loadGreyDirections(true)

    var output = "<table>"

    jsonData.forEach( (element, ii) => {

        function takeProfitsArr(arr, direction, takeProfit) {
            var result = []
            var lineProfit = []

            arr.forEach( (el, i) => {
                if (GREY_DIRECTIONS[i] == true) result.push(0)
                else result.push(Number(el))

                if (!GREY_DIRECTIONS[i] && !PREV_GREY_DIRECTIONS[i] && PREV_DIRECTIONS[i] != direction[i]) lineProfit.push(el)
                else lineProfit.push(0)
            })

            if (arrSum(result) > takeProfit) {
                GREY_DIRECTIONS = loadGreyDirections(true)
                profits.push(arrSum(result))
            } else {
                profits.push(arrSum(lineProfit))
            }
            return result
        }




        function directions(arr) {
            var results = []
            for (var i=0; i<arr.length; i++) {
                if (GREY_DIRECTIONS[i] == true && PREV_DIRECTIONS[i] == arr[i]) {
                    results.push("<span style='color:black'>" + CURRENCIES[i] + "</span>")
                }
                else {
                    results.push("<span style='color:" + arr[i] + "'>" + CURRENCIES[i] + "</span>")
                    GREY_DIRECTIONS[i] = false
                } 
            }
            return results
        }




        var profitsAfterTp = takeProfitsArr(element.profits, element.directions, conf.tp)
        var directionsOut = directions(element.directions) 



        output = output + "<tr><td>" + ii + "</td><td>" + element.date + 
        "</td><td><strong>" + Number(arrSum(profitsAfterTp)).toFixed(2) + 
        "</strong></td><td>" + profitsAfterTp + 
        "</td><td>" + directionsOut +
        "</td><td>" + profits[ii] +
        "</td></tr>"

        yearly_profits.push({ date: element.date, profit: profits[ii]})

        PREV_DIRECTIONS = element.directions
        PREV_GREY_DIRECTIONS = GREY_DIRECTIONS
    });

    var profits_to_console = []

    for (var i=Number(conf.year.from); i<=Number(conf.year.to); i++) {
        var yearly = []
        var byYear = yearly_profits.filter(val => dateTimeToYear(val.date) == i)
        for (var ii=1; ii<=12; ii++) {
            var monthlyProfits = byYear.filter(val => dateTimeToMonth(val.date) == ii)
            yearly.push(arrSum(monthlyProfits.map(v => v.profit)))
        }
        profits_to_console.push({year: i, profits: yearly, sum: arrSum(yearly.filter(q => q != undefined))})
    }

    console.log(profits_to_console)
    console.log(arrSum(profits))


    PREV_DIRECTIONS = []

    return output
}}
