module.exports = {
    app: {
        port: 3000
    },
    year: {
        from: 1990,
        to: 2022
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
            enabled: true
        },
        {
            id: 3,
            name: "EURCHF",
            enabled: true
        },
        {
            id: 4,
            name: "GBPUSD",
            enabled: true
        },
        {
            id: 5,
            name: "USDCAD",
            enabled: true
        },
        {
            id: 6,
            name: "AUDUSD",
            enabled: true
        },
        {
            id: 7,
            name: "NZDUSD",
            enabled: true
        },
    ],
    
    // Directly from TV files
    // 1 - every day
    // 2 - by year
    // 3 - read intermediate file
    read: {
        switch: 3,
        everyDayCurrency: 7
    },
    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    single: {
        switch: 1,

        currencyId: 7,

        singleTp: 0,
        singleSl: 0,

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
            stop: 300,
            step: 50
        }

    }

}
