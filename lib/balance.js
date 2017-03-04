/**
 * モビール問題を解く
 *
 * Label:Dist,Weight/Dist,Weight....|Dist.Weight....
 *
 */
const _ = require("underscore");
const Logic = require("logic-solver");

const Bar = require("./bar");

/**
 * Balance
 *
 * @property {Map.<string, Bar>} bars
 */
class Balance {
    constructor() {
        this.bars = {};
        this.loadList = [];
        this.maxValue = 0;
    }

    parse(puzzle, max_value) {
        let lines = puzzle.split(/\r?\n/);
        let next_id = 1;
        let need_bits = Math.ceil(Math.log2(max_value));
        let parse_error = (message, line) => {
            throw new Error(`ParseError: ${message} at Line:${line}`);
        };

        this.maxValue = max_value;

        _(lines).each((line, i) => {
            let bar;
            let is_left = true;
            let line_no = i + 1;
            let left_spec, right_spec;
            let [bar_name, load_list] = line.split(':');

            if (bar_name === "" || load_list === "") {
                parse_error("empty Bar name or Load list", line_no);
            }
            if (load_list.indexOf('|') === - 1) {
                parse_error("Balance Point is not found", line_no);
            }
            if (load_list.indexOf('|') !== load_list.lastIndexOf('|')) {
                parse_error("too many Balance Point", line_no);
            }

            [left_spec, right_spec] = load_list.split('|');
            if (left_spec === "" || right_spec === "") {
                parse_error("empty Load list", line_no);
            }

            bar = new Bar(bar_name);

            this.bars[bar_name] = bar;

            [left_spec, right_spec].forEach((spec) => {
                spec.split('/').forEach((load_spec) => {
                    let [dist, param] = load_spec.split(',');
                    if (dist === "" || param === "") {
                        parse_error("empty dist or weight/bar", line_no);
                    }
                    let load = bar.addLoad(next_id, parseInt(dist, 10), param, is_left, need_bits);
                    this.loadList.push(load);

                    next_id++;
                });

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
                if (load.bits !== null && (!load.isFixed())) {
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
            if (load.weight === null && load.bits !== null) {
                logic.require(Logic.greaterThanOrEqual(load.bits, min_bits));
                logic.require(Logic.lessThanOrEqual(load.bits, max_bits));
            }
        });

        // 互いに違う数字になる
        for (let i1 = 0; i1 < this.loadList.length; i1++) {
            let load1 = this.loadList[i1];
            if (i1 === this.loadList.length - 1 || load1.bits === null) {
                continue;
            }
            for (let i2 = i1 + 1; i2 < this.loadList.length; i2++) {
                let load2 = this.loadList[i2];
                if (load2.bits === null) {
                    continue;
                }
                logic.require(Logic.not(Logic.equalBits(load1.bits, load2.bits)));
            }
        }
    }

    /*
    findTopBar() {
        // どのBarからもdependされていないのが一番上のBar
        let dep_list = [];
        this.bars.forEach((bar) => {
            bar.getCascadingLoads().forEach((load) => {
                dep_list.push(load.bar);
            });
        });

        for (let [bar_name, bar] of this.bars) {
            if (! dep_list.includes(bar_name)) {
                return bar;
            }
        }

        return null;
    }
    */
}
module.exports = Balance;
