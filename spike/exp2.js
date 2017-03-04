'use strict';

console.log("Please input. \"quit\" to quit.");

process.stdin.setEncoding('utf8');
process.stdin.on('data', (user_input) => {
    user_input = user_input.replace(/\r?\n$/, "");
    if (user_input == "quit") {
        process.exit(0);
    }
    console.log(`${user_input.split('').reverse().join('')}`);
});
process.stdin.on('end', () => {
    console.log("end");
    process.exit(0);
});
