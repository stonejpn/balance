'use strict';

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
        this.leftHand = [];
        this.rightHand = [];
    }

    addLoad(id, dist, param, is_left) {
        let load;
        if (is_left) {
            load = new Load(`L${id}`, dist, param);
            this.leftHand.push(load);
        } else {
            load = new Load(`R${id}`, dist, param);
            this.rightHand.push(load);
        }
        return load;
    }

    constraint(logic, all_bars) {
        let hand_sum = [[], []];  // left, right

        [this.leftHand, this.rightHand].forEach((load_list, i) => {
            load_list.forEach((load) => {
                let bits;

                if (load.hasDescent()) {
                    let descent_bar = all_bars[load.descent];
                    let bits_list = descent_bar.getBitsDeeply(all_bars);
                    bits = Logic.sum(bits_list);
                } else {
                    bits = load.bits;
                }
                // distの値の回数追加することで、荷重を表現できる
                for (let n = 0; n < load.dist; n++) {
                    hand_sum[i].push(bits);
                }
            });
        });

        // 右側と左側が釣りあう
        logic.require(Logic.equalBits(Logic.sum(hand_sum[0]), Logic.sum(hand_sum[1])));
    }

    /**
     * Bar以下descentの分も含めたbitsをすべて列挙する
     *
     * @param {Object.<string, Bar>} all_bars
     * @return {Logic.Bits[]}
     */
    getBitsDeeply(all_bars) {
        let bits_list = [];

        this.leftHand.concat(this.rightHand).forEach((load) => {
            if (load.hasDescent()) {
                let descent = all_bars[load.descent];
                bits_list = bits_list.concat(descent.getBitsDeeply(all_bars));
            } else {
                bits_list.push(load.bits);
            }
        });
        return bits_list;
    }

    toString() {
        let list = [];
        let buffer = "";

        // このBarのすべての値が決定しているかどうか
        let fixed = this.leftHand.concat(this.rightHand).every((load) => {
            if (load.hasDescent() || load.isFixed()) {
                return true;
            } else if (load.weight !== null) {
                return true;
            }
            return false;
        });

        if (fixed) {
            list.push(`${this.name}:`);
            this.leftHand.concat(this.rightHand).forEach((load) => {
                if (load.descent !== null) {
                    list.push(`${load.name}=${load.descent}`)
                } else {
                    list.push(`${load.name}=${load.weight}`)
                }
            });
            return list.join(" ");
        }

        buffer += `Bar[${this.name}]: to be fixed`;
        list.push(buffer);

        buffer = "  LeftHand: " + this.leftHand.map((load) => {
            if (load.hasDescent()) {
                return `${load.name}(d:${load.dist} ->${load.descent})`;
            } else {
                return `${load.name}(d:${load.dist}, w:${load.weight})`;
            }
            }).join(" / ");
        list.push(buffer);

        buffer = " RightHand: " + this.rightHand.map((load) => {
                if (load.hasDescent()) {
                    return `${load.name}(d:${load.dist} ->${load.descent})`;
                } else {
                    return `${load.name}(d:${load.dist}, w:${load.weight})`;
                }
            }).join(" / ");
        list.push(buffer);

        return list.join("\n");
    }
}

module.exports = Bar;
