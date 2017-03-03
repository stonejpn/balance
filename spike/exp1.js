'use strict';

/**
 * この問題を解く
 *
 *             |
 * +---+---+---+---+
 * |   |           |
 * 2   x           x
 *
 */
const _ = require("underscore");
const Logic = require("logic-solver");

let logic = new Logic.Solver();
let min_bit = Logic.constantBits(1);
let A, B, C;
let left_hand, right_hand;

/*
A = Logic.variableBits("A", 8);
logic.require(Logic.greaterThanOrEqual(A, min_bit));
logic.require(Logic.equalBits(A, Logic.constantBits(2)));
*/
A = Logic.constantBits(2);

B = Logic.variableBits("B", 8);
logic.require(Logic.greaterThanOrEqual(B, min_bit));

C = Logic.variableBits("C", 8);
logic.require(Logic.greaterThanOrEqual(C, min_bit));

left_hand = Logic.sum([A, A]);
right_hand = Logic.sum([B]);
logic.require(Logic.equalBits(left_hand, right_hand));
let solution = logic.solve();
if (solution !== null) {
    console.log("Solved!!");
    console.log(`A: ${solution.evaluate(A)}`);
    console.log(`B: ${solution.evaluate(B)}`);
    console.log(`C: ${solution.evaluate(C)}`);
} else {
    console.log("Not Solved.");
}
