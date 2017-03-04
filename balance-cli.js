#! /usr/bin/env NODE_PATH=./lib node

const _ = require("underscore");
const cli_option = require("commander");
const this_package = require("./package.json");

const Balance = require("./lib/balance");

display_result = (balance, result, time) => {
    if (result) {
        console.log(`SOLVED!! Time: ${time / 1000} sec\n`);

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
        console.log(`UNABLE TO SOLVE Time: ${time / 1000} sec\n`);
    }
};

cli_option.version(this_package.version)
    .usage("max_value [puzzle]")
    .on('--help', () => {
        console.log( "Puzzle example:\n  Bar1:2,x|3,x\n  Bar2:1,Bar1|3,x\n");
    });
cli_option.parse(process.argv);

max_value = cli_option.args.shift();
puzzle = cli_option.args.shift();

if (max_value === undefined) {
    console.log("Please specify max_value");
    process.exit();
} else if (!max_value.match(/^\d$/)) {
    console.log(`not number max_value=${max_value}`);
    process.exit();
}
max_value = parseInt(max_value, 10);
if (max_value === 0) {
    console.log("specified max_value is zero.")
    process.exit();
}

let balance = new Balance(max_value);
if (puzzle != null) {
    // コマンドライン上で、指定がされていたケース
    try {
        let start = Date.now();
        balance.parse(PUZZLE.join("\n"));

        let result = balance.solve();
        let spend_time = Date.now() - start;
        display_result(balance, result, spend_time);
    } catch (error) {
        console.log(`${error}`);
    }
    process.exit();
}

try {
    // 標準入力から
    console.log("Please input puzzle. EOF will start solve.");
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (user_input) => {
        user_input = user_input.replace(/\r?\n$/, "");
        if (user_input !== "") {
            balance.parse(user_input);
        }
    });
    process.stdin.on('end', () => {
        let start = Date.now();
        let result = balance.solve();
        let time = Date.now() - start;
        display_result(balance, result, time);
        process.exit();
    });
} catch (error) {
    console.log(`${error}`);
    process.exit();
}
