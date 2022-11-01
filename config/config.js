const currencies = require("./currencies");

module.exports = {
    app: {
        port: 3000
    },
    year: {
        from: 2012,
        to: 2022
    },
    closingHour: 22,

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
        everyDayCurrency: 49
    },

    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    single: {
        switch: 1,

        // 4 16 27 28 44 46 47 49
        currencyId: 49,

        tpSlInGBP: true,

        deductSpread: true,
        // in GBP
        spread: 10,

        singleTp: 40,
        singleSl: -500,

        multipleTP: {
            start: 0,
            stop: 60,
            step: 5,
        },
        multipleSL: {
            start: -500,
            stop: -300,
            step: 50
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
            start: 0,
            stop: 400,
            step: 50
        },

        multipleSL: {
            start: -400,
            stop: 0,
            step: 50
        }
    }
}
