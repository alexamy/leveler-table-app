# 02 — Derive the Offset from the Zero point

**What to build:** nothing the worker can see. This is a prefactor: make the reducer compute the Offset as the difference from the Zero point to the value in the row, rather than as the negated running total of Steps.

The two are the same arithmetic. A Mark is the Zero point plus the Step times its Position, so subtracting the Zero point from it gives back exactly the negated Step total the reducer produces today — same numbers, same sign, same rounding, same blanking on an empty or malformed operand.

It matters because it is the rule that holds in both modes. Once the Offset is derived from whatever value sits in the row, Entered mode stops being a second code path and becomes a single question: does the app write that value, or does the worker?

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] The Offset is computed from the Zero point and the value in the row, not from the Step and the Position
- [ ] Marks are still generated from the Zero point and the Step — only the Offset rule changes
- [ ] The Offset is blank when the Zero point or the row's value is empty or malformed
- [ ] Rounding and formatting are unchanged
- [ ] No new tests. The existing suite passing unchanged is the proof — if it needs edits, the change was not behaviour-preserving
