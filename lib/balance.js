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
 * @property {Bar[]} bars
 */
class Balance {
    constructor() {
        this.bars = [];
    }

    parse(puzzle) {
        let lines = puzzle.split(/\r?\n/);

        _(lines).each((line, i) => {
            let line_no = i + 1;
            let [bar_name, load_list] = line.split(':');
            if (bar_name === "" || load_list === "") {
                this.parseError("empty Bar name or Load list", line_no);
            }
            if (load_list.indexOf('|') === - 1) {
                this.parseError("Balance Point is not found", line_no);
            }
            if (load_list.indexOf('|') !== load_list.lastIndexOf('|')) {
                this.parseError("too many Balance Point", line_no);
            }

            let [left_spec, right_spec] = load_list.split('|');
            if (left_spec === "" || right_spec === "") {
                this.parseError("empty Load list", line_no);
            }

            let bar = new Bar(bar_name);
            let is_left = true;

            this.bars.push(bar);

            _([left_spec, right_spec]).each((spec) => {
                _(spec.split('/')).each((load) => {
                    let [dist, weight] = load.split(',');
                    if (dist === "" || weight === "") {
                        this.parseError("empty dist or weight", line_no);
                    }
                    bar.addLoad({dist, weight}, is_left);
                });

                is_left = false;
            });
        });
    }

    parseError(message, line) {
        throw new Error(`ParseError: ${message} at Line:${line}`);
    }

    solve() {
        let top_bar = this.findTopBar();
        if (top_bar === undefined) {
            console.log("Not found top bar");
            return false;
        }

        let logic = new Logic.Solver();
        let solution;

        top_bar.setConstraints(logic, this.bars.concat());
        solution = logic.solve();
        if (solution === null) {
            return false;
        }

        top_bar.evaluate(solution, this.bars.concat());
        return true;
    }

    findTopBar() {
        // どのBarからもdependされていないのが一番上のBar
        let dep_list = [];
        this.bars.forEach((bar) => {
            dep_list = dep_list.concat(bar.getDepends());
        });

        return this.bars.find((bar) => {
            return !(dep_list.includes(bar.getName()));
        });
    }
}
module.exports = Balance;
