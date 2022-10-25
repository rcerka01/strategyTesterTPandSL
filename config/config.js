// 21.10.22
const toGBP = {
    CHF: 0.89,
    HUF: 0.0021,
    PLN: 0.18,
    EUR: 0.87,
    CZK: 0.036,
    MXN: 0.045,
    RON: 0.18,
}

module.exports = {
    app: {
        port: 3000
    },
    year: {
        from: 2012,
        to: 2022
    },
    closingHour: 22,
    mapper: [
        // major
        // used
        {
            id: 1,
            name: "USDCHF",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 2,
            name: "EURUSD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 3,
            name: "EURCHF",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 4,
            name: "GBPUSD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 5,
            name: "USDCAD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 6,
            name: "AUDUSD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 7,
            name: "NZDUSD",
            pips: 0.0001,
            enabled: false
        },
        // not used
        {
            id: 8,
            name: "EURGBP",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 9,
            name: "GBPCHF",
            pips: 0.0001,
            enabled: false
        },

        // minor
        {
            id: 10,
            name: "AUDCAD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 11,
            name: "AUDCHF",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 12,
            name: "AUDNZD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 13,
            name: "CADCHF",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 14,
            name: "EURAUD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 15,
            name: "EURCAD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 16,
            name: "EURNOK",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 17,
            name: "EURNZD",
            pips: 0.0001,
            pips: 0.0001,
            enabled: false
        },
        {
            id: 18,
            name: "EURSEK",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 19,
            name: "GBPAUD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 20,
            name: "GBPCAD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 21,
            name: "GBPNZD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 22,
            name: "NZDCAD",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 23,
            name: "NZDCHF",
            pips: 0.0001,
            enabled: false
        },
        // not exists in Trading View
        // {
        //     id: 24,
        //     name: "USDCHN",
        //     enabled: false
        // },
        // {
        //     id: 25,
        //     name: "USDIDX",
        //     enabled: false
        // },
        {
            id: 26,
            name: "USDNOK",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 27,
            name: "USDSEK",
            pips: 0.0001,
            enabled: false
        },

        // emerging
        {
            id: 28,
            name: "CHFHUF",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.CHF,
            pipToGBP: toGBP.HUF,
            enabled: true
        },
        {
            id: 29,
            name: "CHFPLN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.CHF,
            pipToGBP: toGBP.PLN,
            enabled: true
        },
        {
            id: 30,
            name: "EURCZK",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.CZK,
            enabled: true
        },
        {
            id: 31,
            name: "EURHUF",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.HUF,
            enabled: true
        },
        {
            id: 32,
            name: "EURMXN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.MXN,
            enabled: false
        },
        {
            id: 33,
            name: "EURPLN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.PLN,
            enabled: false
        },
        {
            id: 34,
            name: "EURRON",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.RON,
            enabled: false
        },
        {
            id: 35,
            name: "EURTRY",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 36,
            name: "EURZAR",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 37,
            name: "GBPMXN",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 38,
            name: "GBPPLN",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 39,
            name: "GBPZAR",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 40,
            name: "USDBRL",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 41,
            name: "USDCZK",
            pips: 0.01,
            enabled: false
        },
        {
            id: 42,
            name: "USDHUF",
            pips: 0.01,
            enabled: false
        },
        {
            id: 43,
            name: "USDMXN",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 44,
            name: "USDPLN",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 45,
            name: "USDRON",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 46,
            name: "USDTRY",
            pips: 0.0001,
            enabled: false
        },
        {
            id: 47,
            name: "USDZAR",
            pips: 0.0001,
            enabled: false
        },
    ],

    tp: true,
    sl: true,
    
    // Directly from TV files
    // 1 - every day
    // 2 - by year
    // 3 - read intermediate file
    read: {
        switch: 3,
        everyDayCurrency: 29
    },

    // From data.json
    // 1 - single TP and SL and every day output
    // 2 - multiple TP and SL combinations
    single: {
        switch: 2,

        currencyId: 29,

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

        tp: 500,
        sl: -50,

        multipleTP: {
            start: 0,
            stop: 400,
            step: 20
        },

        multipleSL: {
            start: -40,
            stop: 0,
            step: 20
        }
    }
}
