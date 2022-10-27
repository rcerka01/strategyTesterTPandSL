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
    tp: false,
    sl: false,
    
    // Directly from TV files
    // 1 - every day
    // 2 - by year
    // 3 - read intermediate file
    read: {
        switch: 1,
        everyDayCurrency: 29
    },

    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    single: {
        switch: 1,

        currencyId: 33,

        tpSlInGBP: true,

        singleTp: 100,
        singleSl: -100,

        multipleTP: {
            start: 0,
            stop: 200,
            step: 20
        },
        multipleSL: {
            start: -200,
            stop: 0,
            step: 20
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
            stop: 200,
            step: 20
        },

        multipleSL: {
            start: -200,
            stop: 0,
            step: 20
        }
    }
}
