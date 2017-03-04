'use strict';

const Logic = require("logic-solver");

/**
 * Load
 *
 * Barに下がっている重り
 *
 * @property {string} name
 * @property {number} dist
 * @property {number|string|null} weight
 * @property {string|null} descent
 *
 * @property {boolean} variable
 * @property {boolean} fixed
 */
class Load {
    static setMaxValue(max_value) {
        Load.NeedBits = Math.ceil(Math.log2(max_value + 1));
    }

    constructor(name, dist, param) {
        this.name = name;
        this.dist = dist;

        this.weight = null;
        this.descent = null;

        this.variable = false;
        this.fixed = false;

        this.bits = null;

        if (typeof(param) === "number") {
            this.weight = param;
        } else if (param.match(/^\d+$/)) {
            this.weight = parseInt(param, 10);
        } else if (param !== "x") {
            // "x"以外なら、Barの指定
            this.descent = param;
        }


        if (this.descent === null) {
            if (this.weight === null) {
                // 未確定の値
                this.bits = Logic.variableBits(this.name, Load.NeedBits);
                this.variable = true;
            } else {
                // 固定の数字
                this.bits = Logic.constantBits(this.weight);
                this.fixed = true;
            }
        }
    }

    isVariable() {
        return this.variable;
    }

    isFixed() {
        return this.fixed;
    }

    hasDescent() {
        return (this.descent !== null);
    }

    hasBits() {
        return (this.variable || this.fixed);
    }

    toString() {
        let type = "unknown";
        if (this.fixed) {
            type = "fixed";
        } else if (this.variable) {
            type = "variable";
        } else if (this.hasDescent()) {
            type = "descent"
        }
        let weight = (this.weight !== null) ? this.weight : "";
        let descent = (this.descent !== null) ? this.descent : "";

        return `Load(${this.name}):[${type}] dist=${this.dist} weight=${weight} bar=${descent}`;
    }
}

module.exports = Load;
