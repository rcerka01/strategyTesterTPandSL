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
        switch: 2,

        // 4 16 27 28 44 46 47 49
        currencyId: 4,

        tpSlInGBP: true,

        singleTp: 300,
        singleSl: -50,

        multipleTP: {
            start: 0,
            stop: 500,
            step: 50
        },
        multipleSL: {
            start: -400,
            stop: 0,
            step: 25
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
            stop: 600,
            step: 50
        },

        multipleSL: {
            start: -300,
            stop: 0,
            step: 50
        }
    }
}
