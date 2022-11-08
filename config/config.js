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
        everyDayCurrency: 1
    },

    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    single: {
        switch: 1,

        currencyId: 53,

        tpSlInGBP: true,

        deductSpread: false,
        // in GBP
        spread: 5,

        singleTp: 27,
        singleSl: -320,

        multipleTP: {
            start: 0,
            stop: 120,
            step: 20,
        },
        multipleSL: {
            start: -500,
            stop: 0,
            step: 50
        },
        // multipleTP: {
        //     start: 0,
        //     stop: 40,
        //     step: 2,
        // },
        // multipleSL: {
        //     start: -400,
        //     stop: -100,
        //     step: 20
        // },
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
