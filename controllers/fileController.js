const conf = require("../config/config");
const com = require("./commonsController");
const fs = require('fs')

var TAKE_NEXT = false 
var SUM = []
var SUM_ARR = []
var DAYS_ARR = []
var PREVIOUS = 0
var CURRENT = 0
var ACC = 0
var DIRECTION = ""
var LOG = ""

let CURRENCIES = conf.currencies


const readFile = async path => {
    try {
        const data = await fs.promises.readFile(path, 'utf8')
        var dataArray = data.split(/\r?\n/);
        dataArray.shift();
        formLine(dataArray)
    }
    catch(err) {
        console.log(err)
    }
}


function calculateSum(firstVal, ts) {
    if (com.dateTimeToYear(com.convertTimestamp(ts)) >= conf.year.from && com.dateTimeToYear(com.convertTimestamp(ts)) <= conf.year.to) {
        if (PREVIOUS == 0) {
        PREVIOUS = firstVal
        } else {
        CURRENT = firstVal
        if (DIRECTION == "red") {
            var profit = PREVIOUS - CURRENT
            ACC = ACC + Number(profit)
            SUM.push({ profit: Number(profit * 10000).toFixed(2), time: com.convertTimestamp(ts), acc: Number(ACC * 10000).toFixed(2), direction: DIRECTION })
            PREVIOUS = CURRENT
        }
        else if (DIRECTION == "green") {
            var profit = CURRENT - PREVIOUS
            ACC = ACC + Number(profit)
            SUM.push({ profit: Number(profit * 10000).toFixed(2), time: com.convertTimestamp(ts), acc: Number(ACC * 10000).toFixed(2), direction: DIRECTION })
            PREVIOUS = CURRENT
        }
        }
    }
}

function formLine(dataArray) {
    SUM = []
    TAKE_NEXT = false 
    PREVIOUS = 0
    CURRENT = 0
    ACC = 0
    DIRECTION = ""
    DIRECTION_SWITCH_TO_RED = false
    DIRECTION_SWITCH_TO_GREEN = false

    DAYS = []
    START_VALUE = 0

    //
    function addDay(time, close) {
        var profit = 0
        if (com.dateTimeToYear(time) >= conf.year.from && com.dateTimeToYear(time) <= conf.year.to) {
        if (DIRECTION == "green" && START_VALUE != 0) profit = Number(close) - START_VALUE
        if (DIRECTION == "red" && START_VALUE !=0) profit = START_VALUE - Number(close)
        DAYS.push({ time:time, close: close, direction: DIRECTION, profit: (profit*10000).toFixed(2) })
        }
    }

    dataArray.forEach( line => {
        var lineArr = line.split(",")
        var ts = lineArr[0]
        var sh1 = lineArr[7]
        var sh2 = lineArr[8]

        if (com.dateTimeToYear(com.convertTimestamp(ts)) >= conf.year.from && com.dateTimeToYear(com.convertTimestamp(ts)) <= conf.year.to) {

        //
        var convertedTime = com.convertTimestamp(ts)
        addDay(convertedTime, lineArr[4])

        if (TAKE_NEXT) {
            calculateSum(Number(lineArr[4]), ts)
            TAKE_NEXT = false
            //
            if (DIRECTION_SWITCH_TO_RED) { DIRECTION = "red"; DIRECTION_SWITCH_TO_RED = false }
            if (DIRECTION_SWITCH_TO_GREEN) { DIRECTION = "green"; DIRECTION_SWITCH_TO_GREEN = false }
            PROFIT = 0
            START_VALUE = Number(lineArr[4])
        }

        if (sh1 != "NaN") {
            TAKE_NEXT = true
            DIRECTION_SWITCH_TO_RED = true
        }

        if (sh2 != "NaN") {
            TAKE_NEXT = true
            DIRECTION_SWITCH_TO_GREEN = true
        }

        LOG = ""
        }
    })
    SUM_ARR.push(SUM)
    DAYS_ARR.push(DAYS) 
}

// function formatDay(days) {
//     var output = "<br><br><br><table>"
//     var counter = 1
//     days.forEach( day => {
//         output = output + "<tr><td>" 
//         + counter + "</td><td>" 
//         + day.time + "</td><td>"
//         + Number(day.close).toFixed(6) + "</td><td>" 
//         + day.direction + "</td><td>" 
//         + day.profit + "</td>"
//         counter = counter + 1
//     })
//     return output
// }





async function readFiles() {
    for (var i=1; i<=conf.currencies.length; i++) {
        var path = "uploads/" + i + ".csv"
        await readFile(path)
    }
    //var output = formatMultipleFileTable(SUM_ARR)
    // var output = formatDay(DAYS)
    var output = "ok"
    com.saveJson(com.transfearDaysArr(DAYS_ARR))
    return output
    //res.render("index", { output });
}

// function formatMultipleFileTable(multArr) {
//     var output = output + "<table>"
//     for (var i=conf.year.from; i<conf.year.to+1; i++) {
//         output = output + "<tr><td colspan='2'><strong>" + i + "</strong></td></tr>";
//         output = output + formatMultipleFileRow(multArr, i.toString())
//     }
//     return output + "</table>"
// }

// function formatMultipleFileRow(multArr, year) {
//     var output = "<tr>"
//     var counter = 0
//     multArr.forEach( arr => {
//         output = output + "<td style='vertical-align:top'><strong>" + CURRENCIES[counter] + "</strong></td><td style='vertical-align:top'>" + formatOutput(com.filterByYear(arr, year)) + "</td>"
//         counter = counter + 1 
//     })
//     output = output + "</tr>"
//     return output
// }

// function formatOutput(arr) {
//     var output = 
//     "<table>" +
//       "<tr>" +
//         "<th></th><th>Date</th><th>Direction</th><th>Profit</th><th>Yearly acc</th><th>Total acc</th>" +
//       "</tr>"
      
//     var COUNTER = 1
//     var YEARLY_PROFIT = 0
  
//     arr.forEach( data => {
  
//       if (Number(data.profit) < 0 ) var color = "coral"
//       else var color = ""
  
//       YEARLY_PROFIT = YEARLY_PROFIT + Number(data.profit)
  
//       output = output + 
//         "<tr>" +
//           "<td style='background-color:" + color + ";white-space:nowrap;'>" + COUNTER  + "</td>" + 
//           "<td style='background-color:" + color + ";white-space:nowrap;'>" + data.time + "</td>" + 
//           "<td style='background-color:" + color + ";white-space:nowrap;'>" + data.direction + "</td>" +
//           "<td style='background-color:" + color + ";white-space:nowrap;'>" + Number(data.profit).toFixed(2) + "</td>" +
//           "<td style='background-color:" + color + ";white-space:nowrap;'>" + YEARLY_PROFIT.toFixed(2) + "</td>" +
//           "<td style='background-color:" + color + ";white-space:nowrap;'>" + Number(data.acc).toFixed(2) +  "</td>" +
//         "</tr>"
  
//         COUNTER = COUNTER + 1
//     })
  
//     output = output + "</table>"
  
//     return output
//   }

module.exports = { readFiles }