const expect = require("chai").expect;
const Bar = require("../lib/bar");

describe("Bar", () =>{
    it("constructor", () => {
        let bar = new Bar("bar123");

        expect(bar.name).to.be.equal("bar123");
        expect(bar.fixed).to.be.true;
        expect(bar.leftHand).to.be.eql([]);
        expect(bar.rightHand).to.be.eql([]);
        expect(bar.depends).to.be.eql([]);
    });

    describe("addLoad", () => {
        let [bar, dist, weight] = [];

        beforeEach(() => {
            bar = new Bar("test left");
            dist = 3;
            weight = 2;
        });

        it("leftHand 固定値", () => {
            bar.addLoad({dist, weight});
            expect(bar.leftHand).to.be.eql([{name: "L1", dist, weight, bar: null}]);
            expect(bar.fixed).to.be.true;
        });
        it("leftHand 未定値", () => {
            weight = "x";
            bar.addLoad({dist, weight});
            expect(bar.leftHand).to.be.eql([{name: "L1", dist, weight: null, bar: null}]);
            expect(bar.fixed).to.be.false;
        });
        it("leftHand 多段", () => {
            bar.addLoad({dist, weight: "bar#1"});
            expect(bar.leftHand).to.be.eql([{name: "L1", dist, weight: null, bar: "bar#1"}]);
            expect(bar.depends).to.be.eql(["bar#1"]);
            expect(bar.fixed).to.be.false;
        });
        it("rightHand", () => {
            bar.addLoad({dist, weight}, false);
            expect(bar.rightHand).to.be.eql([{name: "R1", dist, weight, bar: null}]);
        });
    });

});
