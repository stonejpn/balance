const expect = require("chai").expect;
const Bar = require("../lib/bar");

describe("Bar", () =>{
    it("constructor", () => {
        let bar = new Bar("bar123");

        expect(bar.name).to.be.equal("bar123");
        expect(bar.leftHand).to.be.eql([]);
        expect(bar.rightHand).to.be.eql([]);
    });

    describe("addLoad", () => {
        /** @param {Bar} bar */
        let [bar, dist, weight] = [];

        beforeEach(() => {
            bar = new Bar("test left");
            dist = 3;
            weight = 2;
        });

        it("leftHand 固定値", () => {
            bar.addLoad("L1", dist, 2, true);
            expect(bar.leftHand).to.have.lengthOf(1);
        });
        it("rightHand", () => {
            bar.addLoad("R1", dist, weight, false, 5);
            expect(bar.rightHand).to.have.lengthOf(1);
        });
    });

});
