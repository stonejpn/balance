'use strict';

const Logic = require("logic-solver");

/**
 * BarSolver
 *
 * @property {Bar} bar
 * @property {Logic.Solver|null} solver
 * @property {Logic.Solution[]} _solutions
 * @property {Map.<Load, Logic.Bits>} bits
 */
class BarSolver {
    // static Solvers = new Map();

    /**
     *
     * @param {Bar} bar
     * @return {BarSolver}
     */
    static getSolver(bar) {
        if (! BarSolver.hasOwnProperty("Solvers")) {
            BarSolver.Solvers = new Map();
        }

        if (BarSolver.Solvers.has(bar)) {
            return BarSolver.Solvers.get(bar);
        }

        let solver = new BarSolver(bar);
        BarSolver.Solvers.set(bar, solver);

        return solver;
    }

    constructor(bar) {
        this.bar = bar;
        this.solver = null;
        this.bits = new Map();
        this.freezeConstraint = false;
        this.cascadingLoads = [];
    }

    /**
     *
     * @param {Map.<string, Bar>} bars
     * @return {boolean} 制約に変更があったか？
     */
    initialize(bars) {
        this.cascadingLoads = this.bar.getCascadingLoads();
        this.cascadingLoads.forEach((load) => {
            let bar = bars.get(load.bar);
            let solver = BarSolver.getSolver(bar);
            solver.initialize(bars);
        });
    }

    isCascading() {
        return this.cascadingLoads.length !== 0;
    }

    localConstraints() {
        if (this.freezeConstraint) {
            return;
        }

        let hand_sum = [[], []];
        let min_bits = Logic.constantBits(1);

        this.solver = new Logic.Solver();
        this.bits.clear();

        this.bar.getBothHands().forEach((load_list, i) => {
            load_list.forEach((load) => {
                let bits;

                if (load.weight !== null) {
                    // 決定済み
                    bits = Logic.constantBits(load.weight);
                } else if (load.bar !== null) {
                    throw new Error("SolutionError: cascading load is not solved.");
                } else {
                    // 未定の重り
                    bits = Logic.variableBits(load.name, 8);
                    this.solver.require(Logic.greaterThanOrEqual(bits, min_bits));
                    this.bits.set(load, bits);
                }
                for (let n = 0; n < load.dist; n++) {
                    hand_sum[i].push(bits);
                }
            });
        });

        this.solver.require(Logic.equalBits(Logic.sum(hand_sum[0]), Logic.sum(hand_sum[1])));

        this.freezeConstraint = (! this.isCascading());
    }

    /**
     *
     * @return {boolean}
     */
    solve(bars) {
        this.solveCascading(bars, true);

        this.localConstraints();

        let load = this.bar.loadForAssuming;
        for (let attempt = 1; attempt <= 100; attempt++) {
            let solution;
            if (load !== null) {
                /*
                 * 成立する組み合わせが沢山あるケースでは、solve()の結果が発散するので、
                 * 最小の組み合わせにするようsolveAssuming()を利用する
                 */
                let start_value = (load.weight !== null) ? load.weight + 1 : 1;
                let bits = this.bits.get(load);

                for (let value = start_value; value < 256; value++) {
                    let constBits = Logic.constantBits(value);
                    solution = this.solver.solveAssuming(Logic.equalBits(bits, constBits));
                    if (solution !== null) {
                        this.evaluate(solution);
                        return true;
                    }
                }
            } else {
                // 直接重りが下がっていないケース
                solution = this.solver.solve();
                if (solution !== null) {
                    return true;
                }
            }

            if (! this.solveCascading(bars, false)) {
                return false;
            }

            this.localConstraints();
        }
        return false;
    }

    solveCascading(bars, solve_all=false) {
        if (! this.isCascading()) {
            return;
        }

        let bar, solver;
        if (solve_all) {
            this.cascadingLoads.forEach((load) =>{
                bar = bars.get(load.bar);
                solver = BarSolver.getSolver(bar);
                if (solver.solve(bars)) {
                    load.weight = bar.totalWeight;
                }
            });
            return true;
        } else {
            // solve()をコールする度に、重くなっていくので、
            // 一番軽いLoadを変更する
            let target_load = null;
            this.cascadingLoads.forEach((load) => {
                if (target_load === null || load.weight < target_load.weight) {
                    target_load = load;
                }
            });
            bar = bars.get(target_load.bar);
            solver = BarSolver.getSolver(bar);
            if (solver.solve(bars)) {
                target_load.weight = bar.totalWeight;
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     *
     * @param {Logic.Solution} solution
     */
    evaluate(solution) {
        for (let [load, bits] of this.bits) {
            load.weight = solution.evaluate(bits);
        }
    }

}

module.exports = BarSolver;
