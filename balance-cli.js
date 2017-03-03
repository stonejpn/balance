#! /usr/bin/env NODE_PATH=./lib node

const _ = require("underscore");
const Balance = require("./lib/balance");


const PUZZLE = [
    // "Bar1:3,2/2,5|1,16",
    // "Bar2:1,Bar1|1,9/2,7",
    // "Bar3:1,Bar2|1,x/2,x",
    // "B4:3,x/2,x|3,x",
    // "Bar5:2,2|1,x",
    // "Bar6:3,x/2,x/1,Bar5|1,x",
    // "Bar7:2,x/1,x|1,Bar6",
    // "Bar8:2,x/1,x|1,Bar7",
    // "B9:3,B8/1,x|2,B3/4,B4"
    ];
/*
const PUZZLE = [
    "B1:2,x|3,x",
    "B2:1,B1|3,x",
    // "B3:4,x/2,x/1,x|2,x",
    // "B4:4,x|1,x",
    // "B5:2,B3|3,B4",
    // "B6:5,B2|4,B5"
];
*/

let balance = new Balance();
try {
    balance.parse(PUZZLE.join("\n"));

    console.log("---- Inspection of Bars ----");
    _.each(balance.bars, (bar) => {
        console.log(`${bar}`);
    });
    console.log("");

    if (balance.solve()) {
        console.log("SOLVED!!\n");
    } else {
        console.log("UNABLE TO SOLVE\n")
    }
} catch (error) {
    console.log("catch error");
    if (error.hasOwnProperty('stack')) {
        console.log(`${error.stack}`);
    } else {
        console.log(`${error}`);
    }
}

console.log("---- Results of Bars ----");
_.each(balance.bars, (bar) => {
    console.log(`${bar}`);
});
