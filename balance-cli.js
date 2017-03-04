#! /usr/bin/env NODE_PATH=./lib node

const _ = require("underscore");
const Balance = require("./lib/balance");

const MAX_VALUE = 20;
const PUZZLE = [
    "Bar1:3,2/2,5|1,16",
    "Bar2:1,Bar1|1,9/2,7",
    "Bar3:1,Bar2|1,x/2,x",
    "Bar4:3,x/2,x|3,x",
    "Bar5:2,x|1,x",
    "Bar6:3,x/2,x/1,Bar5|1,x",
    "Bar7:2,x/1,x|1,Bar6",
    "Bar8:2,x/1,x|1,Bar7",
    "Bar9:3,Bar8/1,x|2,Bar3/4,Bar4"
    ];
/*
const MAX_VALUE = 9;
const PUZZLE = [
    "Bar1:3,x/1,x|1,x",
    "Bar2:1,Bar1|2,x",
    "Bar3:4,x/1,x|2,x",
    "Bar4:2,Bar3|2,Bar2",
    "Bar5:2,x|3,x",
    "Bar6:2,Bar4|4,Bar5"
];
*/

let balance = new Balance(MAX_VALUE);
try {
    let start = Date.now();
    balance.parse(PUZZLE.join("\n"));

    /*
    console.log("---- Inspection of Bars ----");
    _.each(balance.bars, (descent) => {
        console.log(`${descent}`);
    });
    console.log("");
    */

    let result = balance.solve();
    let spend_time = Date.now() - start;
    if (balance.solve()) {
        console.log(`SOLVED!! Time: ${spend_time / 1000} sec\n`);

        // Barの値を表示
        _.each(balance.bars, (bar) => {
            buffer = `${bar.name}: `;
            bar.leftHand.forEach((load) => {
                buffer += `${load.dist}=${load.descent !== null ? load.descent : load.weight} `;
            });
            buffer += "| ";
            bar.rightHand.forEach((load) => {
                buffer += `${load.dist}=${load.descent !== null ? load.descent : load.weight} `;
            });
            console.log(buffer);
        });
    } else {
        console.log(`UNABLE TO SOLVE Time: ${spend_time / 1000} sec\n`);

        // Barの詳細表示
        console.log("---- Results of Bars ----");
        _.each(balance.bars, (bar) => {
            console.log(`${bar}`);
        });
    }
} catch (error) {
    console.log("catch error");
    if (error.hasOwnProperty('stack')) {
        console.log(`${error.stack}`);
    } else {
        console.log(`${error}`);
    }
}
