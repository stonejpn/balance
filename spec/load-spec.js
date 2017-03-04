const expect = require("chai").expect;
const Load = require("../lib/load");

describe("Load", () => {
    it("NeedBits", () => {
        Load.setMaxValue(7);
        expect(Load.NeedBits).to.be.equal(3);
        Load.setMaxValue(8);
        expect(Load.NeedBits).to.be.equal(4);

        Load.setMaxValue(15);
        expect(Load.NeedBits).to.be.equal(4);
        Load.setMaxValue(16);
        expect(Load.NeedBits).to.be.equal(5);
    });

    describe("constructor", () => {
        beforeEach(() => {
            Load.setMaxValue(16);
        });


        it("paramが数字", () => {
            let load = new Load("test1", 2, 3, 4);

            expect(load.name).to.be.equal("test1");
            expect(load.dist).to.be.equal(2);
            expect(load.weight).to.be.equal(3);

            expect(load.isFixed()).to.be.true;
            expect(load.isVariable()).to.be.false;
            expect(load.hasDescent()).to.be.false;
        });

        it("paramが数字の文字列", () => {
            let load = new Load("test2", 1, "4");
            expect(load.name).to.be.equal("test2");
            expect(load.weight).to.be.equal(4);

            expect(load.isFixed()).to.be.true;
            expect(load.isVariable()).to.be.false;
            expect(load.hasDescent()).to.be.false;
        });
        it("paramがx", () => {
            let load = new Load("test3", 1, "x");
            expect(load.name).to.be.equal("test3");
            expect(load.weight).to.be.null;

            expect(load.isVariable()).to.be.true;
            expect(load.isFixed()).to.be.false;
            expect(load.hasDescent()).to.be.false;
        });

        it("paramがBarの指定", () => {
            let load = new Load("test4", 2, "bar4");
            expect(load.name).to.be.equal("test4");
            expect(load.weight).to.be.null;
            expect(load.descent).to.be.equal("bar4");

            expect(load.hasDescent()).to.be.true;
            expect(load.isFixed()).to.be.false;
            expect(load.isVariable()).to.be.false;
        });
    });
});
