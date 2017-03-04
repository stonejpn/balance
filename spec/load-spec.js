const expect = require("chai").expect;
const Load = require("../lib/load");

describe("Load", () => {
    describe("constructor", () => {

        it("paramが数字", () => {
            let load = new Load("test1", 2, 3, 4);

            expect(load.name).to.be.equal("test1");
            expect(load.dist).to.be.equal(2);
            expect(load.weight).to.be.equal(3);
            expect(load.bar).to.be.null;

            expect(load.isFixed()).to.be.true;
            expect(load.isCascading()).to.be.false;
        });
        it("paramが数字の文字列", () => {
            let load = new Load("test2", 1, "4", 5);
            expect(load.name).to.be.equal("test2");
            expect(load.weight).to.be.equal(4);
            expect(load.isFixed()).to.be.true;
        });
        it("paramがx", () => {
            let load = new Load("test3", 1, "x", 5);
            expect(load.name).to.be.equal("test3");
            expect(load.weight).to.be.null;
            expect(load.isFixed()).to.be.false;
        });
        it("paramがBarの指定", () => {
            let load = new Load("test4", 2, "bar4", 5);
            expect(load.name).to.be.equal("test4");
            expect(load.weight).to.be.null;
            expect(load.bar).to.be.equal("bar4");
            expect(load.isFixed()).to.be.false;
            expect(load.isCascading()).to.be.true;
        });
    });
});
