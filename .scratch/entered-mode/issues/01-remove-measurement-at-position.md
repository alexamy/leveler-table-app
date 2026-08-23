# 01 — Remove the Measurement at the pressed position

**What to build:** pressing a row's minus button removes that row. Today it always removes the last row instead, whichever button the worker presses. In Generated mode the two are indistinguishable — every row is derived from the Zero point and the Step, so dropping the last one and renumbering looks identical. Once a row can hold a Measurement the worker typed, it stops being indistinguishable: pressing minus on a bad reading in the middle of the column would delete a good one at the bottom.

Fix it now, before anything can be typed, so the fix lands on its own and can be reasoned about without Entered mode in the picture.

After the removal the remaining rows renumber from 1 and the series recomputes, exactly as it does today.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Pressing minus on a row removes that row and no other
- [x] Rows below the removed one shift up and renumber from 1
- [x] The series recomputes after a removal, so the remaining Marks still form a correct series from the Zero point and the Step
- [x] Removing the only row leaves an empty table
- [x] ⚠️ The existing delete case in the autocalculation tests is rewritten — it currently asserts the drop-the-last-row behaviour and will fail. This is a deliberate change to an existing test.
- [x] The rest of the existing suite passes untouched
