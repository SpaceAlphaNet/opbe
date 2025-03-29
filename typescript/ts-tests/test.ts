import {Battle} from "../core/Battle"
import {BattleReport} from "../core/BattleReport"
import {PlayerGroup} from "../models/PlayerGroup"

abstract class Test {

  protected attackers: PlayerGroup | undefined
  protected defenders: PlayerGroup | undefined

  private group_table(group: PlayerGroup, side: string): any {
    const table: any = {side}
    for (const [id, type] of group.getEquivalentFleetContent()) {
      table[`${type.constructor.name}_${id}`] = type.getCount()
    }
    return table
  }

  benchmark(times: number = 1) {
    if (times < 1) {
      times = 1
    }
    times = Math.floor(times)
    let memory = 0
    let setup_time = 0
    let process_time = 0
    let attacker_wins = 0
    let draws = 0
    let defender_wins = 0
    let report = null;
    for (let i = 0;i < times;i++) {
      if (global.gc) {
        global.gc();
      }
      const mem_before = process.memoryUsage();
      const start_time = process.hrtime();

      this.setup();
      const setup_diff_time = process.hrtime(start_time);
      report = this.test();

      const diff_time = process.hrtime(start_time);
      const mem_after = process.memoryUsage();
      const diff_mem = mem_after.heapUsed - mem_before.heapUsed
      memory += diff_mem
      setup_time += setup_diff_time[1]
      process_time += diff_time[1]

      for (let r = 1; r <= report.getLastRoundNumber(); r++) {
        const round = report.getRound(r)
        const a_table = this.group_table(report.getPresentationAttackersFleetOnRound(r), "attackers")
        const d_table = this.group_table(report.getPresentationDefendersFleetOnRound(r), "defenders")
        console.log("Round " + r)
        console.table([a_table, d_table])
        //The attacking fleet fires a total force of 50.000 points of damage with 50 shots upon the defender. The defender's shields absorb 20.000 points of damage
        console.log("The attacking fleet fires a total force of " + round.getAttackersFirePower() + " points of damage with " + round.getAttackersFireCount() + " upon the defender. The defender's shields absorb " + round.getDefendersAbsorbedDamage() + " points of damage")
        console.log("The defending fleet fires a total force of " + round.getDefendersFirePower() + " points of damage with " + round.getDefendersFireCount() + " upon the attacker. The attacker's shields absorb " + round.getAttackersAbsorbedDamage() + " points of damage")
      }

      const after_attackers = report.getAfterBattleAttackers()
      const table_attackers: any = {"side": "attackers"}
      for (const [id, type] of after_attackers.getEquivalentFleetContent()) {
        table_attackers[`${type.constructor.name}_${id}`] = type.getCount()
      }
      table_attackers["debris"] = report.getAttackerDebris()
      const after_defenders = report.getAfterBattleDefenders()
      const table_defenders: any = {"side": "defenders"}
      for (const [id, type] of after_defenders.getEquivalentFleetContent()) {
        table_defenders[`${type.constructor.name}_${id}`] = type.getCount()
      }
      table_defenders["debris"] = report.getDefenderDebris()
      console.log("BattleResult " + i)
      console.table([table_attackers, table_defenders])
      if (report.attackerHasWin()) {
        attacker_wins++
      }
      if (report.isADraw()) {
        draws++
      }
      if (report.defenderHasWin()) {
        defender_wins++
      }
    }
    memory /= times
    setup_time /= times
    process_time /= times

    console.log(`On average ${memory / 1000} kb memory used`)
    console.log(`On average ${setup_time / 1_000_000} ms setup time`)
    console.log(`On average ${process_time / 1_000_000} ms execution time`)
    console.table([{attacker_wins, draws, defender_wins}])
  }

  abstract setup(): void;

  private test(): BattleReport {
    if (!this.attackers) {
      throw new Error("Invalid test case missing attackers")
    }
    if (!this.defenders) {
      throw new Error("Invalid test case missing defenders")
    }
    const battle = new Battle(this.attackers, this.defenders)
    battle.startBattle()
    return battle.getReport()
  };


}

export {Test}