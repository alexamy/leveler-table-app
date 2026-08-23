# Entered mode

Status: ready-for-agent

## Problem Statement

The app only produces Marks. A worker fixes a Zero point, sets a Step, and the app generates the whole series — every row is derived, and none of it can be typed over.

That covers only half the job on site. Once the marks are set out, the worker walks the same points with the staff and reads what is actually there. Those readings are Measurements, and the app has nowhere to put them. To get the Offset of each Measurement from the Zero point, the worker does the arithmetic by hand or in a separate sheet, then retypes the result — on a phone, in the field, one subtraction per point, with no check on any of it.

The app already knows the Zero point and already formats and copies a table. It just refuses to accept a number the worker measured.

## Solution

A second mode. The worker flips a toggle in the bottom toolbar and each row's value becomes a Measurement they type in themselves; the app keeps computing the Offset from the Zero point and keeps the copy-to-clipboard table working exactly as before.

Step has no meaning in Entered mode — an Offset runs from the Zero point straight to the Measurement, with no series to derive — so its input is hidden while keeping its space, so the layout does not jump when the worker flips back and forth.

Switching back to Generated mode regenerates every row from Zero point and Step and so destroys what was typed. When there is something real to lose, the app asks first.

## User Stories

1. As a worker, I want a toggle in the toolbar, so that I can switch between generating Marks and recording Measurements without leaving the screen.
2. As a worker, I want the toggle to show a robot on one side and a person on the other, so that I can tell at a glance whether the app is producing values or I am.
3. As a worker, I want the app to open in Generated mode, so that nothing about my existing routine changes.
4. As a worker, I want my chosen mode to survive closing and reopening the app, so that I do not re-select it every time I pick the phone up.
5. As a worker in Entered mode, I want each row's value to be editable, so that I can type the staff reading I just took.
6. As a worker in Entered mode, I want a new row to start empty, so that I am never left looking at a number I did not measure.
7. As a worker in Entered mode, I want the Offset to appear as soon as I type a Measurement, so that I see the deviation at the point instead of computing it.
8. As a worker in Entered mode, I want an Offset below the Zero point to read as a negative number, so that the sign tells me which way the point sits.
9. As a worker in Entered mode, I want every Offset to update when I correct the Zero point, so that a mis-keyed reference does not force me to retype the whole column.
10. As a worker in Entered mode, I want the Offset to stay blank while the Measurement is empty, so that a blank row does not show a number that means nothing.
11. As a worker in Entered mode, I want the Offset to stay blank when I have typed something that is not a number, so that I am not shown a result computed from a typo.
12. As a worker in Entered mode, I want a Measurement that is not a number highlighted, so that I can spot a fat-fingered entry in the column.
13. As a worker in Entered mode, I want Offsets rounded the same way as in Generated mode, so that the two modes produce a consistent column.
14. As a worker in Entered mode, I want the Step input to disappear, so that I am not asked for a value that does nothing here.
15. As a worker in Entered mode, I want the layout to stay put when the Step input disappears, so that the rows do not jump under my thumb as I flip modes.
16. As a worker in Entered mode, I want the Step value I typed earlier to still be there when I flip back to Generated mode, so that I do not re-enter it.
17. As a worker in Entered mode, I want to add a row once the Zero point is set, so that I am not blocked by a Step I will never fill in.
18. As a worker in Generated mode, I want the add button to keep requiring both Zero point and Step, so that the mode I already use behaves as it always has.
19. As a worker, I want the minus button to remove the row I pressed it on, so that I can drop one bad Measurement out of the middle without losing the rest.
20. As a worker in Generated mode, I want the series to renumber and recompute after a removal, so that the remaining Marks still form a correct series.
21. As a worker flipping into Entered mode, I want the rows already on screen to stay, so that I can overwrite the Marks with what I measured at each point.
22. As a worker flipping back into Generated mode with Measurements typed in, I want to be asked first, so that a stray tap in the toolbar does not wipe a walk's worth of readings.
23. As a worker facing that question, I want a way to back out, so that I can dismiss it and stay in Entered mode with my readings intact.
24. As a worker facing that question, I want a way to go ahead, so that I can regenerate the series deliberately.
25. As a worker flipping into Generated mode with nothing typed in, I want no question at all, so that the toggle stays a quick flick when there is nothing to lose.
26. As a worker flipping into Entered mode, I want no question, so that I am not asked to confirm something that destroys nothing.
27. As a worker, I want to copy the table in Entered mode, so that my Measurements and their Offsets reach the spreadsheet the same way Marks do.
28. As a worker, I want the copied table to have the same columns in both modes, so that everything I paste lands in one consistent sheet.
29. As a worker, I want the long-press clear to work in Entered mode, so that I can start a fresh set of readings at the next location.
30. As a worker, I want clearing to leave me in the mode I was in, so that I am not thrown back to Generated mode mid-shift.
31. As a returning worker, I want the app to open in Generated mode whenever it cannot read what was saved, so that an app update does not put me somewhere unexpected.

## Implementation Decisions

### State

- `State` gains a `mode` field with two values, Generated and Entered. Default is Generated.
- Rows continue to live in one `measurements` array shared by both modes. See ADR 0001 — Entered mode does not get its own list.
- `waitingDeletion` is unchanged. The confirmation dialog's open/closed state does **not** join it: that is transient UI state, held locally by the toggle component, so it never reaches persisted storage.

### Derivation

One rule covers both modes:

```
offset = zero − size                 // both modes
size   = zero + step*(position)      // Generated only; Entered leaves size alone
```

An empty or malformed operand on either side yields an empty string, matching how the app already blanks a row on a malformed Zero point or Step.

Note this generalises the existing behaviour rather than branching from it: in Generated mode `zero − (zero + delta)` is `−delta`, which is what the reducer computes today.

### Reducer actions

- New: change mode. Sets the mode and recomputes rows under the new rule.
- New: change measurement, by position and value. Entered mode only.
- Add measurement — Generated: recompute the whole series as today. Entered: append an empty row.
- Remove measurement — removes the row at the given position in both modes, then recomputes. **This is a fix, not just an extension**: the current reducer ignores the position it is handed and always drops the last row. Indistinguishable in Generated mode, where rows are derived and interchangeable; in Entered mode it would delete a different reading than the one the worker pressed.
- Reset state — clears Zero point, Step and rows, but preserves the current mode.

### Persisted state

- The payload is the whole state minus `waitingDeletion`. Rows keep their `offset` even though every offset is recomputed on load, so storage and state stay one type.
- A saved payload loads only if every field the app names is there and the right shape: `mode` one of the two values, `zero` and `step` text, `measurements` a list of rows each holding text `size` and text `offset`. A missing field, a wrong type, or a payload that is not an object rejects the **whole** payload and the app opens on defaults.
- Fields the app does not name are ignored. Nothing reads them, so they cannot fail a load, and dropping a field in a later build does not wipe the table.
- Nothing is salvaged from a rejected payload. Partial repair was rejected on purpose: the table is a Zero point, a Step and a short column — small enough to retype — and piecing a half-readable payload back together guesses at what the worker measured.
- This changes behaviour rather than restating it. State saved before `mode` existed carries no `mode` field, so it is rejected and that worker opens on an empty table. Nothing is written on load, so the payload stays in storage and is rejected again on every launch until the worker's first edit overwrites it. Accepted as the cost of the update that lands this.
- A rejected payload counts as empty, and so does a read that fails at the storage layer: both open the app on defaults and let the next edit overwrite whatever is in storage. A read failure is not a separate case, because a storage layer that cannot be read almost certainly cannot be written either.
- Storage trouble is never reported to the worker. A failed read is silent, and a failed write is swallowed. There is nothing the worker could do with either, and the app has no error surface to put it on.

### Toolbar

- The mode control is a two-position switch flanked by two icons: a robot on the Generated side, a person on the Entered side.
- Icons come from FontAwesome 4, the set the existing toolbar chips already use — `android` for the robot, `user` for the person. FontAwesome 5's `robot` glyph was rejected to avoid a second icon font in one row.
- The toolbar currently sizes its three chips at a quarter width each. It has to re-divide to fit the switch.

### Confirmation

- Opens only when the target mode is Generated **and** at least one row holds a value that regenerating would replace with a different one. Every other transition is silent.
- A row is only at risk if it holds something *and* the Generated rule would produce something else for it, so the app compares the two. Rows share one array (ADR 0001) and carry no record of who wrote them, so "was this typed?" cannot be asked directly — and "is it non-empty?" is the wrong question: after flipping into Entered mode the rows still hold the Marks that were generated, and flipping straight back would regenerate the same values. Asking there would make the toggle demand confirmation for a no-op, against story 25.
- Rendered with the dialog component from the existing UI library. No title; one line of body text; two buttons.
- Body: `Введённые значения будут пересчитаны.` Buttons: `Отмена` and `Продолжить`.
- The mode changes only on confirm. Cancelling leaves the mode and every row untouched.
- Note this is a second confirmation idiom in the app — the clear button confirms by hold-to-delete. Hold-to-confirm was rejected here because a switch is tapped, not held, and a tap that did nothing would read as broken.

### Row rendering

- A row's value input is editable in Entered mode and disabled in Generated mode.
- The placeholder is unchanged in both modes. Per the glossary, Measurement deliberately shares Mark's UI label.

### Step input

- In Entered mode the input renders at zero opacity, is not editable, and does not take touches. It stays mounted and keeps its space, so nothing on screen moves.
- Its value stays in state throughout and is used again the moment the worker returns to Generated mode.

### Unchanged

Clipboard serialisation, the Offset sign convention, and number formatting are untouched. The copied table keeps the same four columns and the same headers in both modes.

## Testing Decisions

A good test here drives the app the way a worker does — press the toggle, type in a row, read the Offset off the screen — and asserts only what is visible. It does not reach into state, call the reducer, or assert on the shape of a measurement object. When the reducer is restructured later, these tests should not notice.

### Seam

One seam, the one the repo already uses: render the app root with the testing library and drive it through `testID`s. No new entry point. The shared `app` helper gains accessors for the mode toggle and the dialog's two buttons — new vocabulary for the existing seam, not a second seam.

The reducer is deliberately **not** tested in isolation. No existing test does, and a unit seam there would bind tests to the state shape this spec is changing.

### Coverage

Entered-mode behaviour, as its own file:

- Offset is the difference from the Zero point to the Measurement, positive and negative
- Offsets recompute when the Zero point changes
- Offset is blank on an empty Measurement, a malformed Measurement, and a malformed Zero point
- A malformed Measurement is highlighted
- Rounding matches Generated mode — two decimals, one decimal, whole numbers
- A row's value is editable and a newly added row starts empty

Mode behaviour, as its own file:

- The app starts in Generated mode
- The Step input is not visible in Entered mode but still occupies its space, and its value survives the round trip
- The add button requires Zero point and Step in Generated mode, Zero point alone in Entered mode
- Flipping to Entered keeps existing rows and makes them editable
- Flipping to Generated with typed values raises the dialog; confirming regenerates the series; cancelling changes nothing
- Flipping to Generated with an empty Step and confirming blanks the rows
- Flipping with no typed values, and flipping into Entered, raise no dialog
- Long-press clear empties the data and leaves the mode alone

### Prior art

`autocalc.test.tsx` is the closest model for the multi-step flows — set up the head inputs, add rows, assert values, then change one input and re-assert. `malformed.test.tsx` models the blank-on-bad-input cases. `step.test.tsx` and `zero.test.tsx` model the label, entry, and highlight cases.

### Existing test to change

`autocalc.test.tsx` has a delete case written against the current drop-the-last-row behaviour. Removing the row at the pressed position makes that assertion wrong, so it has to be rewritten. This is a deliberate change to an existing test, not an incidental one.

`persistance.test.tsx` changes with the persisted-state rule above, and all three changes are deliberate. `fills in fields missing from the saved state` and `blanks a saved row that lost its value` assert the field-by-field repair being removed, so both go; their payloads join the reject list instead, alongside new cases for a missing field and a row that is not an object. `does not overwrite saved state after a failed read` inverts into `keeps saving after a failed read`.

## Out of Scope

- Any change to what is copied to the clipboard. Same columns, same headers, both modes.
- A UI label of its own for Measurement. It shares Mark's wording on purpose.
- Persisting the two modes' rows separately, so that flipping back and forth is lossless. Rejected in ADR 0001.
- Undo for a confirmed mode switch.
- Confirming, warning, or guarding any other destructive path, including the existing long-press clear.
- Mixed rows — a table that holds Marks and Measurements at once. Mode is a property of the whole table.
- Comparing a Measurement against the Mark that was set out at the same point.
- The link save/populate work still sitting as to-dos in the persistence tests.

## Further Notes

The behaviour being brought over exists and passed tests at commit `8c1263d`, before the app was restructured. Worth reading, but not copying: that commit had no modes. It had one screen where the value was always editable and was seeded on add from the previous value plus Step. The seeding is what later became Generated mode; the editability is what this spec calls Entered mode. Its offset rule — the difference from the Zero point to the value in the row — is the rule adopted here for both modes.

That commit also used a state machine library that the app no longer depends on. Its logic transfers; its structure does not.
