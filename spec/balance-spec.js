const expect = require("chai").expect;

const Balance = require("../lib/balance");

describe("Balance", () => {
    it("parse", () => {
        let balance = new Balance(20);
        let puzzle = 'bar#1:3,2/2,5|1,x';

        expect(balance.parse(puzzle)).not.to.throw;
        expect(balance.bars).to.have.ownProperty("bar#1");
    });
});
