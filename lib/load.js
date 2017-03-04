'use strict';

const Logic = require("logic-solver");

/**
 * Load
 *
 * Barに下がっている重り
 *
 * @property {string} _name
 * @property {number} _dist
 * @property {number|string|null} _weight
 * @property {string|null} _bar
 * @property {boolean} _fixed
 */
class Load {
    constructor(name, dist, param, need_bits) {
        this._name = name;
        this._dist = dist;

        this._weight = null;
        this._bar = null;
        if (typeof(param) === "number") {
            this._weight = param;
        } else if (param.match(/^\d+$/)) {
            this._weight = parseInt(param, 10);
        } else if (param !== "x") {
            // "x"以外なら、Barの指定
            this._bar = param;
        }

        this._bits = null;
        if (this._bar === null) {
            if (this._weight === null) {
                this._bits = Logic.variableBits(this._name, need_bits);
            } else {
                this._bits = Logic.constantBits(this._weight);
            }
        }

        this._fixed = (this.weight !== null);
    }

    get name() {
        return this._name;
    }
    get dist() {
        return this._dist;
    }
    get weight() {
        return this._weight;
    }
    set weight(weight) {
        if (this._fixed) {
            throw Error("Unable to set weight to fixed Load.");
        }
        this._weight = weight;
    }
    get bar() {
        return this._bar;
    }
    get bits() {
        return this._bits;
    }

    isFixed() {
        return this._fixed;
    }

    isCascading() {
        return (this.bar !== null);
    }

    toString() {
        return `Load[${this._name}]: fixed=${this._fixed} dist=${this._dist} weight=${this._weight} bar=${this._bar}`;
    }
}

module.exports = Load;
