# 01 — Vary the copied table by mode

**What to build:** the copied table differs between the two modes, in one way per mode.

In Generated mode the header row is what ships today — `Шаг`, `Нулевая точка`, `Проектные значения`, `Результат` — but the values under the last two columns trade places. The Offset goes in the Проектные значения column and the Mark in the Результат one. For the machine that reads this table, the design value is the offset from the Zero point and the staff reading is what results, so that is the pairing it expects.

In Entered mode the columns and their values stay exactly as they are today, and the position column is renamed from `Шаг` to `№`. `Шаг` is already the Step input on the same screen, and the copied table's first column is a position, not a step. Generated mode keeps `Шаг` there.

Both tables keep four tab-separated columns and the same number formatting. The position and Нулевая точка columns are untouched in both.

**Status:** ready-for-agent

- [ ] Copying in Generated mode produces the header row `Шаг`, `Нулевая точка`, `Проектные значения`, `Результат`
- [ ] In Generated mode each value row is position, Zero point, Offset, Mark — the last two in the opposite order to what ships today
- [ ] Copying in Entered mode produces the header row `№`, `Нулевая точка`, `Проектные значения`, `Результат`
- [ ] In Entered mode each value row is position, Zero point, Measurement, Offset — unchanged from what ships today
- [ ] Number formatting and the tab separator are unchanged in both modes
- [ ] Flipping mode and copying again produces the table for the mode now selected
- [ ] Nothing on screen changes — the Zero point and Step placeholders are untouched

**Note on tests:** ⚠️ the existing serialization test asserts today's value order and will fail until it is updated to the Generated mode order. Add coverage for the Entered mode table alongside it.

**Out of scope:**

- Column count, the tab separator, and number formatting
- On-screen labels and placeholders
- How Marks, Measurements, or Offsets are computed or rounded
