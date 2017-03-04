const expect = require("chai").expect;
const Balance = require("../lib/balance");

describe("Balance", () => {
    it("parse", () => {
        let balance = new Balance();
        let puzzle = "bar-A:3,2/2,5|1,x";

        expect(balance.parse(puzzle)).not.to.throw;
        expect(balance.bars.has("bar-A")).to.be.true;
    });
});
