# 03 — Hold typed Measurements in state

**What to build:** the ability for a row to hold a Measurement the worker typed instead of a Mark the app derived. There is no way to reach it from the interface yet — that arrives with the toolbar switch in ticket 04 — so this ticket is driven by starting the app already in Entered mode, the way the persistence test starts the app from saved state.

In Entered mode the worker types a staff reading into a row and the app shows its Offset from the Zero point. Correcting the Zero point updates every Offset in the column. A newly added row starts empty, never pre-filled with a number nobody measured. Step is not consulted at all.

In Generated mode nothing changes.

Per ADR 0001, both modes share one list of rows. Switching to Generated regenerates every row from the Zero point and the Step, replacing whatever was typed; switching to Entered keeps the rows as they are and makes them editable. Neither switch asks for confirmation yet — that is ticket 06.

**Blocked by:** 01, 02.

**Status:** ready-for-agent

- [ ] The app has a mode, Generated or Entered, and starts in Generated
- [ ] In Entered mode a row's value is editable; in Generated mode it is not
- [ ] Typing a Measurement shows its Offset from the Zero point, negative when the point sits below it
- [ ] Changing the Zero point recomputes every Offset
- [ ] The Offset is blank while the Measurement is empty, and blank when the Measurement or the Zero point is malformed
- [ ] A malformed Measurement is highlighted, as a malformed Zero point already is
- [ ] Offsets round the same way in both modes
- [ ] Adding a row in Entered mode appends an empty one
- [ ] Switching to Entered keeps the existing rows; switching to Generated regenerates them from the Zero point and the Step
- [ ] Entered-mode behaviour is covered in its own test file, driven through the existing render-and-fire-events seam
- [ ] The row placeholder is unchanged in both modes — per the glossary, Measurement deliberately shares Mark's label
