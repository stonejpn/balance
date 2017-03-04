'use strict';
const _ = require("underscore");
const Logic = require("logic-solver");

const Load = require("./load");

/**
 * @property {string} name
 * @property {boolean} fixed
 * @property {boolean} cascading
 * @property {Load[]} leftHand
 * @property {Load[]} rightHand
 * @property {Object.<name, Logic.Bits>} bitsMap
 */
class Bar {
    constructor(name) {
        this.name = name;
        this.fixed = true;
        this.cascading = false;
        this.leftHand = [];
        this.rightHand = [];
        this.loadForAssuming = null;
    }

    /**
     *
     * @return {number}
     */
    get totalWeight() {
        return this.leftHand.concat(this.rightHand).reduce((prev_value, load) => {
            if (load.weight === null) {
                throw Error(`Unable to calc bar weight. Load:${load.name} has no weight.`);
            }
            return prev_value + load.weight;
        }, 0);
    }

    isFixed() {
        return this.fixed;
    }

    getName() {
        return this.name;
    }

    isCascading() {
        return this.cascading;
    }

    /**
     *
     * @return {[Load[], Load[]]}
     */
    getBothHands() {
        return [this.leftHand, this.rightHand];
    }

    /**
     * @return {Load[]}
     */
    getCascadingLoads() {
        return this.leftHand.concat(this.rightHand).filter((load) => {
            return load.isCascading();
        });
    }

    addLoad(id, dist, param, is_left=true) {
        // 数字にマッチしなかったら、未指定か、さらにBarがぶら下がっている
        let load;
        if (is_left) {
            load = new Load(`L${id}`, dist, param);
            this.leftHand.push(load);
        } else {
            load = new Load(`R${id}`, dist, param);
            this.rightHand.push(load);
        }

        if (! load.isFixed()) {
            this.fixed = false;
        }
        if (load.isCascading()) {
            this.cascading = true;
        }

        // 一番遠いLoadを変動のコントロール要素にする
        if ((!load.isFixed()) && (!load.isCascading())) {
            if (this.loadForAssuming === null || load.dist > this.loadForAssuming) {
                this.loadForAssuming = load;
            }
        }
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

        buffer = "  LeftHand: " + this.leftHand.map((load) => {
            if (load.bar !== null) {
                return `Name:${load.name}, Dist:${load.dist}, Bar->${load.bar}`;
            } else {
                return `Name:${load.name}, Dist:${load.dist}, Weight:${load.weight}`;
            }
            }).join(" / ");
        list.push(buffer);

        buffer = " RightHand: " + this.rightHand.map((load) => {
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
