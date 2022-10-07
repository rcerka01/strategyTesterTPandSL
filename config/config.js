module.exports = {
    app: {
        port: 3000
    },
    year: {
        from: 2020,
        to: 2021
    },
    mapper: [
        {
            id: 1,
            name: "USDCHF",
            enabled: true
        },
        {
            id: 2,
            name: "EURUSD",
            enabled: false
        },
        {
            id: 3,
            name: "EURCHF",
            enabled: false
        },
        {
            id: 4,
            name: "GBPUSD",
            enabled: false
        },
        {
            id: 5,
            name: "USDCAD",
            enabled: true
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
        switch: 2,
        everyDayCurrency: 1
    },
    // From data.json
    // 1 - multiple TP and SL combinations
    // 2 - single TP and SL and every day output
    single: {
        switch: 2,

        currencyId: 1,

        singleTp: 0,
        singleSl: 300,

        multipleTP: {
            start: 0,
            stop: 300,
            step: 20
        },
        multipleSl: {
            start: -300,
            stop: 0,
            step: 20
        },
    },

    // From data.json
    // 1 - single tp
    // 2 - multiple tp
    combined: {
        switch: 1,

        tp: 60,

        multipleTP: {
            start: 0,
            stop: 1000,
            step: 50
        }

    }

}
