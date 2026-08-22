# 06 — Ask before regenerating typed Measurements

**What to build:** a guard on the one destructive transition. Switching to Generated regenerates every row from the Zero point and the Step, so a walk's worth of typed readings goes with it — and if no Step was ever set, the rows go blank as well. That is the accepted design (ADR 0001), but it should not happen on a stray tap of a small toolbar control.

When switching to Generated would overwrite at least one non-empty row, the app asks first: «Введённые значения будут пересчитаны.» — no title, two buttons, `Отмена` and `Продолжить`. The mode changes only on `Продолжить`. `Отмена` leaves the mode and every row exactly as they were.

Every other transition stays silent. Switching into Entered destroys nothing. Switching to Generated with no rows, or with only empty ones, has nothing to lose. A worker who is not about to lose anything should never see this.

Note this is the app's second confirmation idiom — the clear button confirms by holding it down. A switch is tapped, not held, and a tap that did nothing would read as broken, so a dialog is used here instead.

**Blocked by:** 04.

**Status:** ready-for-agent

- [ ] Switching to Generated with at least one non-empty row raises the confirmation
- [ ] `Продолжить` performs the switch and regenerates the rows
- [ ] `Отмена` dismisses it, leaving the mode and every row untouched
- [ ] Switching to Generated with no rows, or only empty ones, raises nothing
- [ ] Switching into Entered never raises anything
- [ ] Confirming with an empty Step blanks the rows, as designed
- [ ] The dialog's open state is not persisted — a restarted app never reopens it
