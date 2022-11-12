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
        everyDayCurrency: 4
    },

    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    single: {
        switch: 4,

        currencyId: 3,

        tpSlInGBP: true,

        deductSpread: false,
        // in GBP
        spread: 5,

        singleTp: 50,
        singleSl: -400,

        multipleTP: {
            start: 0,
            stop: 120,
            step: 10,
        },
        multipleSL: {
            start: -500,
            stop: 0,
            step: 50
        },
        // multipleTP: {
        //     start: 30,
        //     stop: 80,
        //     step: 2,
        // },
        // multipleSL: {
        //     start: -500,
        //     stop: -200,
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
