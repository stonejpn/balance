'use strict';
const _ = require("underscore");
const Logic = require("logic-solver");

/** @typedef {{name: string, dist: number, weight: number|string|null, bar: string|null}} Load */


class Bar {
    constructor(name) {
        this.name = name;
        this.fixed = true;
        this.leftHand = [];
        this.rightHand = [];
        this.depends = [];
        this.bitsMap = {};
    }

    isFixed() {
        return this.fixed;
    }

    getName() {
        return this.name;
    }

    getDepends() {
        return this.depends.concat();
    }

    /**
     *
     * @param {Load} load
     * @param {boolean} isLeft
     */
    addLoad(load, isLeft=true) {
        // 数字にマッチしなかったら、未指定か、さらにBarがぶら下がっている
        if (isLeft) {
            load.name = `L${this.leftHand.length + 1}`;
        } else {
            load.name = `R${this.rightHand.length + 1}`;
        }
        load.bar = null;

        if (typeof(load.weight) === "number") {
            // そのまま
        } else if (load.weight.match(/^\d+$/)) {
            load.weight = parseInt(load.weight);
        } else {
            let weight = load.weight;

            load.weight = null;

            // "x"以外なら、Barがぶら下がっている
            if (weight !== "x") {
                load.bar = weight;
                this.depends.push(weight);
            }

            this.fixed = false;
        }

        if (isLeft) {
            this.leftHand.push(load);
        } else {
            this.rightHand.push(load);
        }
    }

    /**
     *
     * @param {Logic.Solver} logic
     * @param {Object.<string, Bar>} all_bars
     *
     * @return {Logic.Bits}
     */
    setConstraints(logic, all_bars) {
        let bar_sum = [];
        let bits;

        if (! this.fixed) {
            let hand_sum = [[], []];
            let bar;
            let min_bits = Logic.constantBits(1);

            // 両側の制約を作成
            [this.leftHand, this.rightHand].forEach((load_list, i) => {
                load_list.forEach((load) => {
                    if (load.bar !== null) {
                        // 他のBarがぶら下がっている
                        bar = this.findBar(all_bars, load.bar);
                        bits = bar.setConstraints(logic, all_bars);
                    } else if (load.weight !== null) {
                        // 固定値
                        bits = Logic.constantBits(load.weight);
                        console.log(`${load.name}: constant=${load.weight}`);
                    } else {
                        // 直接重りがぶら下がっている
                        bits = Logic.variableBits(load.name, 8);
                        logic.require(Logic.greaterThanOrEqual(bits, min_bits));

                        this.bitsMap[load.name] = bits;
                        console.log(`${load.name}: variable`);
                    }
                    _.range(load.dist).forEach(() => {
                        hand_sum[i].push(bits);
                    });

                    bar_sum.push(bits);
                });
            });
            logic.require(Logic.equalBits(Logic.sum(hand_sum[0]), Logic.sum(hand_sum[1])));
        } else {
            this.leftHand.concat(this.rightHand).forEach((load) => {
                bits = Logic.constantBits(load.weight);
                bar_sum.push(bits);
            });
        }

        return Logic.sum(bar_sum);
    }

    findBar(bar_list, name) {
        return bar_list.find((bar) => {
            return (bar.name === name);
        });
    }

    evaluate(solution, all_bars) {
        this.leftHand.concat(this.rightHand).forEach((load) => {
            if (load.bar !== null) {
                let bar = this.findBar(all_bars, load.bar);
                bar.evaluate(solution, all_bars);
            } else if (load.weight === null) {
                load.weight = solution.evaluate(this.bitsMap[load.name]);
            }
        });
        this.fixed = true;
    }

    toString() {
        let list = [];
        let buffer = "";
        if (this.fixed) {
            list.push(`${this.name}:`);
            this.leftHand.concat(this.rightHand).forEach((load) => {
                if (load.bar !== null) {
                    list.push(`${load.name}=${load.bar}`)
                } else {
                    list.push(`${load.name}=${load.weight}`)
                }
            });
            return list.join(" ");
        }

        buffer += `Bar[${this.name}]: to be fixed`;
        list.push(buffer);

        buffer = "  LeftHand: " + _(this.leftHand).map((load) => {
            if (load.bar !== null) {
                return `Name:${load.name}, Dist:${load.dist}, Bar->${load.bar}`;
            } else {
                return `Name:${load.name}, Dist:${load.dist}, Weight:${load.weight}`;
            }
            }).join(" / ");
        list.push(buffer);

        buffer = " RightHand: " + _(this.rightHand).map((load) => {
                if (load.bar !== null) {
                    return `Name:${load.name}, Dist:${load.dist}, Bar->${load.bar}`;
                } else {
                    return `Name:${load.name}, Dist:${load.dist}, Weight:${load.weight}`;
                }
            }).join(" / ");
        list.push(buffer);

        return list.join("\n");
    }
}

module.exports = Bar;
