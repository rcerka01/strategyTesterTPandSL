const conf = require("../config/config");
const com = require("./commonsController");
const fs = require('fs')

// *** FROM TRAIDING VIEW FiLES *** //

/* CONTROLLER */

function formLines(dataArray) {
    var takeNext = false
    var directionToGreen = false
    var directionToRed = false

    var direction = ""

    var startValue = 0
    var acc = 0

    var sums = []
    var days = []

    function addItem(ts, prevProf, currentProf, isIncrAcc) {
        if (com.dateTimeToYear(ts) >= conf.year.from && com.dateTimeToYear(ts) <= conf.year.to) {
            if (direction == "red") {
                var profit = prevProf - currentProf
                    var test = com.roundToFixed(prevProf) + " - " + com.roundToFixed(currentProf)
                if (isIncrAcc) acc = acc + profit
            }
            else if (direction == "green") {
                var profit = currentProf - prevProf
                var test = com.roundToFixed(currentProf) + " - " + com.roundToFixed(prevProf)
                if (isIncrAcc) acc = acc + profit
            }
            return { profit: profit, time: ts, acc: acc, close:currentProf, direction: direction, test: test }
        }
    }

    dataArray.forEach( line => {
        var lineArr = line.split(",")
        var ts = lineArr[0]
        var sh1 = lineArr[7]
        var sh2 = lineArr[8]

        var convertedTs = com.convertTimestamp(ts)

        if (com.dateTimeToYear(convertedTs) >= conf.year.from && com.dateTimeToYear(convertedTs) <= conf.year.to) {

            days.push(addItem(convertedTs, startValue, lineArr[4], false))

            if (takeNext) {

                sums.push(addItem(convertedTs, startValue, lineArr[4], true))
                takeNext = false

                if (directionToRed) { direction = "red"; directionToRed = false }
                if (directionToGreen) { direction = "green"; directionToGreen = false }
               
                startValue = lineArr[4]
            }

            if (sh1 != "NaN") {
                takeNext = true
                directionToRed = true
            }

            if (sh2 != "NaN") {
                takeNext = true
                directionToGreen = true
            }
        }
    })
    return { sums: sums, days: days }
}

const readFile = async path => {
    try {
        const data = await fs.promises.readFile(path, 'utf8')
        var dataArray = data.split(/\r?\n/);
        dataArray.shift();
        return  formLines(dataArray)
    }
    catch(err) {
        console.log(err)
    }
}

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
            
            for (var i=1; i<daysArr.length; i++) {
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

/* OUTPUTT */

/* buy year */
function formatMultipleFileTable(multArr, currencies) {
    var output = "<table>"
    for (var i=conf.year.from; i<conf.year.to+1; i++) {
        output = output + "<tr>" + formatMultipleFileRow(multArr, i.toString(), currencies) + "</tr>"
    }
    return output + "</table>"
}

function formatMultipleFileRow(multArr, year, currencies) {
    var output = ""
    multArr.forEach( (arr, index) => {
        output = output + 
                    "<td style='text-align:center;padding:10px;vertical-align:top'>" + 
                        "<strong>" + currencies.map(val => val.name)[index] + " " + year + "</strong>" +
                        "</br></br>" +
                        formatYearlyOutput(com.filterByYear(arr, year)) + 
                    "</td>"
    })
    return output
}

function formatYearlyOutput(arr) {
    var output = 
    "<table>" +
      "<tr>" +
        "<th></th><th>Date</th><th>Direction</th><th>Profit</th><th>Yearly acc</th><th>Total acc</th>" +
      "</tr>"
      
    var COUNTER = 1
    var yearlyProfit = 0
  
    arr.forEach( data => {
  
      if (Number(data.profit) < 0) var color = "coral"
      else var color = ""
  
      if (!isNaN(Number(data.profit))) yearlyProfit = yearlyProfit + Number(data.profit)

      output = output + 
        "<tr>" +
          "<td style='background-color:" + color + ";white-space:nowrap;'>" + COUNTER  + "</td>" + 
          "<td style='background-color:" + color + ";white-space:nowrap;'>" + data.time + "</td>" + 
          "<td style='background-color:" + color + ";white-space:nowrap;'>" + data.direction + "</td>" +
          "<td style='background-color:" + color + ";white-space:nowrap;'>" + com.pipsToFixed(data.profit) + "</td>" +
          "<td style='background-color:" + color + ";white-space:nowrap;'>" + com.pipsToFixed(yearlyProfit) + "</td>" +
          "<td style='background-color:" + color + ";white-space:nowrap;'>" + com.pipsToFixed(data.acc) +  "</td>" +
        "</tr>"
  
        COUNTER = COUNTER + 1
    })
  
    output = output + "</table>"
  
    return output
  }

/* every day */ 
function formatDay(days, currency) {
    var output = "<table><tr><th colspan=7>" + currency + "</th></tr>" +
                    "<th>Nr</th><th>Date</th><th>Close</th><th>Direction</th><th>Profit</th><th>Test</th><th>Cash</th>"
    var counter = 1
    days.forEach( day => {
        output = output + "<tr>" +
        "<td><strong>" + counter + "</strong></td>" + 
        "<td>" + day.time + "</td>" +
        "<td><strong>" + com.roundToFixed(day.close) + "</strong></td>" +
        "<td>" + day.direction + "</td>" +
        "<td><strong>" + com.roundToFixed(day.profit) + "</strong></td>" +
        "<td>" + day.test + "</td>" +
        "<td><strong>" + com.pipsToFixed(day.profit) + "</strong></td>" +
        "</tr>"
        counter = counter + 1
    })
    return output
}

module.exports = { readFiles: async function () {
        var data = []
        var currencies = []
        var cur = conf.mapper
        for (var i=0; i<cur.length; i++) {
            if (cur[i].enabled) {
                var path = "uploads/" + cur[i].id + ".csv"
                currencies.push(cur[i])
                data.push(await readFile(path))
            }
        }

        switch (conf.read.switch) {
            case 1:
                var name = com.getCurrencyById(conf.read.everyDayCurrency).name
                var filteredIndex = currencies.findIndex(val => val.id == conf.read.everyDayCurrency)
                var output = formatDay(data.map(val => val.days)[filteredIndex], name)
            break
            case 2:
                var output = formatMultipleFileTable(data.map(val => val.sums), currencies)
            break
            case 3: 
                com.saveJson(transfearDaysArr(data.map(val => val.days)))
                var output = "OK"
            break
        }
    
        return output
    }
 }