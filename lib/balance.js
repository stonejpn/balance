/**
 * モビール問題を解く
 *
 * Label:Dist,Weight/Dist,Weight....|Dist.Weight....
 *
 */
const _ = require("underscore");

const Bar = require("./bar");
const BarSolver = require("./bar-solver");

/**
 * Balance
 *
 * @property {Map.<string, Bar>} bars
 */
class Balance {
    constructor() {
        this.bars = new Map();
    }

    parse(puzzle) {
        let lines = puzzle.split(/\r?\n/);
        let next_id = 1;

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

            this.bars.set(bar_name, bar);

            [left_spec, right_spec].forEach((spec) => {
                spec.split('/').forEach((load) => {
                    let [dist, param] = load.split(',');
                    if (dist === "" || param === "") {
                        this.parseError("empty dist or weight/bar", line_no);
                    }
                    bar.addLoad(next_id, parseInt(dist, 10), param, is_left);
                    next_id++;
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
        if (top_bar === null) {
            console.log("Not found top bar");
            return false;
        }

        let bar_solver = BarSolver.getSolver(top_bar);

        bar_solver.initialize(this.bars);
        return bar_solver.solve(this.bars);
    }

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
}
module.exports = Balance;
