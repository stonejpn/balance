const expect = require("chai").expect;
const Bar = require("../lib/bar");

describe("Bar", () =>{
    it("constructor", () => {
        let bar = new Bar("bar123");

        expect(bar.name).to.be.equal("bar123");
        expect(bar.fixed).to.be.true;
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
            bar.addLoad("L1", dist, weight, true, 5);
            expect(bar.leftHand).to.have.lengthOf(1);
            expect(bar.fixed).to.be.true;
            expect(bar.isCascading()).to.be.false;
        });
        it("leftHand 未定値", () => {
            bar.addLoad("L2", dist, "x", true, 5);
            expect(bar.fixed).to.be.false;
            expect(bar.isCascading()).to.be.false;
        });
        it("leftHand 多段", () => {
            bar.addLoad("L3", dist, "Bar3", true, 5);
            expect(bar.fixed).to.be.false;
            expect(bar.isCascading()).to.be.true;
        });

        it("rightHand", () => {
            bar.addLoad("R1", dist, weight, false, 5);
            expect(bar.rightHand).to.have.lengthOf(1);
        });
    });

});
