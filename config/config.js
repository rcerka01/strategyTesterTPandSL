const currencies = require("./currencies");

module.exports = {
    app: {
        port: 3000
    },

    year: {
        from: 2022,
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
        switch: 3,

        currencyId: 4,

        tpSlInGBP: true,

        deductSpread: false,
        // in GBP
        spread: 5,

        singleTp: 11,
        singleSl: -200,

        // multipleTP: {
        //     start: 0,
        //     stop: 120,
        //     step: 10,
        // },
        // multipleSL: {
        //     start: -600,
        //     stop: -50,
        //     step: 50
        // },
        multipleTP: {
            start: 30,
            stop: 70,
            step: 2,
        },
        multipleSL: {
            start: -700,
            stop: -300,
            step: 10
        },
    },

    // From data.json
    // 1 - single tp
    // 2 - multiple tp
    combined: {
        switch: 1,

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
