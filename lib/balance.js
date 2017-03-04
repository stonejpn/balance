/**
 * モビール問題を解く
 *
 * Label:Dist,Weight/Dist,Weight....|Dist.Weight....
 *
 */
const _ = require("underscore");
const Logic = require("logic-solver");

const Bar = require("./bar");
const Load = require("./load");

/**
 * Balance
 *
 * @property {Map.<string, Bar>} bars
 */
class Balance {
    constructor(max_value) {
        this.bars = {};
        this.loadList = [];

        this.maxValue = max_value;
        this.nextId = 1;

        Load.setMaxValue(max_value);
    }

    parse(puzzle) {
        let lines = puzzle.split(/\r?\n/);

        // エラー
        let parse_error = (message, line) => {
            throw new Error(`ParseError: ${message}\n  at Line:${line}`);
        };

        _(lines).each((line, i) => {
            let bar;
            let is_left = true;
            let left_spec, right_spec;
            let [bar_name, load_list] = line.split(':');

            if (bar_name === "" || load_list === "") {
                parse_error("empty Bar name or Load list", line);
            }

            // BalancePointのチェック
            if (! load_list.includes('|')) {
                // 含まれてない
                parse_error("Balance Point is not found", line);
            }
            if (load_list.indexOf('|') !== load_list.lastIndexOf('|')) {
                // ２つ以上ある
                parse_error("too many Balance Point", line);
            }

            bar = new Bar(bar_name);
            this.bars[bar_name] = bar;

            load_list.split('|').forEach((spec) => {
                if (spec === "") {
                    parse_error("empty Load list", line_no);
                }

                spec.split('/').forEach((load_spec) => {
                    let [dist, param] = load_spec.split(',');
                    if (dist === "" || param === "") {
                        parse_error("empty dist or weight/descent", line);
                    }
                    dist = parseInt(dist, 10);
                    let load = bar.addLoad(this.nextId, dist, param, is_left);
                    this.loadList.push(load);

                    this.nextId++;
                });

                // 左側から右側へスイッチ
                is_left = false;
            });
        });
    }

    solve() {
        let logic = new Logic.Solver();

        // それぞれのLogic.Bitsの制約
        this.constraintBits(logic);

        // それぞれのBarでの制約
        _.each(this.bars, (bar) => {
            bar.constraint(logic, this.bars);
        });

        let solution = logic.solve();
        if (solution !== null) {
            this.loadList.forEach((load) => {
                if (load.isVariable()) {
                    load.weight = solution.evaluate(load.bits);
                }
            });
        }
        return (solution !== null);
    }

    /**
     * Loadに割当らてたBitsに対しての制約
     *
     * 最大値と最小値、すべて違う数字になる
     *
     * @param logic
     */
    constraintBits(logic) {
        // 最大値、最小値
        let min_bits = Logic.constantBits(1);
        let max_bits = Logic.constantBits(this.maxValue);

        this.loadList.forEach((load) => {
            if (load.isVariable()) {
                logic.require(Logic.greaterThanOrEqual(load.bits, min_bits));
                logic.require(Logic.lessThanOrEqual(load.bits, max_bits));
            }
        });

        // 互いに違う数字になる
        for (let i1 = 0; i1 < this.loadList.length; i1++) {
            let load1 = this.loadList[i1];
            if (i1 === this.loadList.length - 1 || (!load1.hasBits())) {
                continue;
            }

            for (let i2 = i1 + 1; i2 < this.loadList.length; i2++) {
                let load2 = this.loadList[i2];
                if (! load2.hasBits()) {
                    continue;
                }
                logic.require(Logic.not(Logic.equalBits(load1.bits, load2.bits)));
            }
        }
    }
}
module.exports = Balance;
