#! /usr/bin/env NODE_PATH=./lib node

const _ = require("underscore");
const Balance = require("./lib/balance");

const PUZZLE = [
    "Bar1:3,2/2,5|1,16",
    "Bar2:1,Bar1|1,9/2,7",
    "Bar3:1,Bar2|1,x/2,x",
    "Bar4:3,x/2,x|3,x",
    "Bar5:2,2|1,x",
    "Bar6:3,x/2,x/1,Bar5|1,x",
    "Bar7:2,x/1,x|1,Bar6",
    "Bar8:2,x/1,x|1,Bar7",
    "Bar9:3,Bar8/1,x|2,Bar3/4,Bar4"
    ];

/*
const PUZZLE = [
    "Bar1:1,x|2,x",
    "Bar2:3,x|1,x",
    "Bar3:1,Bar1|1,Bar2"
];
*/

let balance = new Balance();
try {
    let start = Date.now();
    balance.parse(PUZZLE.join("\n"));

    console.log("---- Inspection of Bars ----");
    balance.bars.forEach((bar) => {
        console.log(`${bar}`);
    });
    console.log("");

    let spend_time;
    if (balance.solve()) {
        spend_time = Date.now() - start;
        console.log(`SOLVED!! Time: ${spend_time / 1000} sec\n`);
        balance.bars.forEach((bar) => {
            buffer = `${bar.getName()}: `;
            bar.leftHand.forEach((load) => {
                buffer += `${load.name}=${load.bar !== null ? load.bar : load.weight} `;
            });
            buffer += "| ";
            bar.rightHand.forEach((load) => {
                buffer += `${load.name}=${load.bar !== null ? load.bar : load.weight} `;
            });
            console.log(buffer);
        });
    } else {
        spend_time = Date.now() - start;
        console.log(`UNABLE TO SOLVE Time: ${spend_time / 1000} sec\n`);
        console.log("---- Results of Bars ----");
        balance.bars.forEach((bar) => {
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
