# A row carries an identity that is not its Position

Rows were rendered keyed by array index, so a row was only ever its Position. Removing a row from the middle of the table left React reusing the same input for a different Measurement: the values redrew correctly, because they are controlled from state, but focus, cursor and IME state stayed with the screen slot. A worker typing when they pressed minus on another row had their next keystrokes land in the wrong Measurement. The app worked around that by closing the keyboard on every removal.

Each `Measurement` now carries an `id`, assigned at add time as one more than the highest in the array. Rows render keyed by it, and `remove measurement` and `change measurement` address rows by it rather than by index. Position stays what the worker sees — the array order, numbered from one — and is still what the Generated rule derives a Mark from.

## Considered Options

- **Keep index keys and keep the keyboard dismiss.** No code to write, and the worker sees no bug today. Rejected because the dismiss sits in a delete handler with nothing at the call site explaining it, so the next person to tidy it away reintroduces the original fault.
- **Persist the id.** One row type everywhere instead of two. Rejected because the id source would have to persist as well, or be re-derived from stored ids, and every payload written by the current build would be rejected under ADR 0002 for a value that means nothing across restarts.
- **A `nextId` counter on `State`.** Readable, but a fifth state field that has to be kept out of the payload, where `Math.max` over the rows costs nothing at this size.

## Consequences

Identity is per-session. `restore` numbers the rows it read, and `persisted` maps each row down to `{ size, offset }`, so the storage contract in ADR 0002 is untouched — no schema field, no test fixture changes.

The id only has to be unique within one array. It rises and never reuses a freed value, so a removal cannot hand a new row the id of a row still on screen.

`calculateMeasurements` lost its `amount` parameter. It used to conjure a new row by being asked for a longer array than the state held; `add measurement` now appends an empty row and recomputes, and every case in the reducer reads the same way.

`Keyboard.dismiss()` is gone from the delete handler, and the test that asserted it inverted into `does not close the keyboard when a row is removed`. Focus itself is not assertable through this seam — `react-test-renderer` has no real focus — so no test claims to cover it.
