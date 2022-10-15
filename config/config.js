module.exports = {
    app: {
        port: 3000
    },
    year: {
        from: 1990,
        to: 2022
    },
    closingHour: 22,
    mapper: [
        {
            id: 1,
            name: "USDCHF",
            enabled: false
        },
        {
            id: 2,
            name: "EURUSD",
            enabled: false
        },
        {
            id: 3,
            name: "EURCHF",
            enabled: true
        },
        {
            id: 4,
            name: "GBPUSD",
            enabled: false
        },
        {
            id: 5,
            name: "USDCAD",
            enabled: false
        },
        {
            id: 6,
            name: "AUDUSD",
            enabled: false
        },
        {
            id: 7,
            name: "NZDUSD",
            enabled: false
        },
    ],
    
    // Directly from TV files
    // 1 - every day
    // 2 - by year
    // 3 - read intermediate file
    read: {
        switch: 1,
        everyDayCurrency: 3
    },
    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    single: {
        switch: 2,

        currencyId: 2,

        singleTp: 0,
        singleSl: 0,

        multipleTP: {
            start: 0,
            stop: 300,
            step: 20
        },
        multipleSL: {
            start: -100,
            stop: 0,
            step: 20
        },
    },

    // From data.json
    // 1 - single tp
    // 2 - multiple tp
    combined: {
        switch: 2,

        tp: 200,
        sl: -200,

        multipleTP: {
            start: 0,
            stop: 300,
            step: 50
        },

        multipleSL: {
            start: 0,
            stop: -300,
            step: 50
        }
    }
}
