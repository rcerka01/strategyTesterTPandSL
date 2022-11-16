const currencies = require("./currencies");

module.exports = {
    app: {
        port: 3000
    },

    year: {
        from: 2021,
        to: 2022
    },

    closingHour: 22,

    // 1D 4H 1H
    timeGap: "1H",

    mapper: currencies.mapper,

    // ALLWAYS FALSE FOR COMBINED !!!
    tp: true,
    sl: true,
    
    // Directly from TV files
    // 1 - every day
    // 2 - by year
    // 3 - read intermediate file
    read: {
        switch: 3,
        everyDayCurrency: 4
    },

    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    // 3 - single TP and SL and every day output, ordinary tp and sl (takeProfits2())
    // 4 - multiple TP and SL combinations, ordinary tp and sl (takeProfits2())
    single: {
        switch: 4,

        currencyId: 4,

        tpSlInGBP: true,

        deductSpread: false,
        // in GBP
        spread: 5,

        singleTp: 23,
        singleSl: 0,

        // multipleTP: {
        //     start: 0,
        //     stop: 120,
        //     step: 10,
        // },
        // multipleSL: {
        //     start: -500,
        //     stop: 0,
        //     step: 50
        // },
        multipleTP: {
            start: 0,
            stop: 30,
            step: 1,
        },
        multipleSL: {
            start: -300,
            stop: -10,
            step: 10
        },
    },

    // From data.json
    // 1 - single tp
    // 2 - multiple tp
    combined: {
        switch: 2,

        tp: 100,
        sl: -100,

        multipleTP: {
            start: 10,
            stop: 50,
            step: 20
        },

        multipleSL: {
            start: -320,
            stop: -120,
            step: 20
        }
    }
}
