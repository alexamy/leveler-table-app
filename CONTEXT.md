# Leveler Table

Field tool for construction leveling. A worker fixes a zero point, sets a step, and the app generates the series of staff readings that mark each successive elevation, ready to copy into a spreadsheet.

## Language

**Zero point** (UI: Нулевая точка):
The staff reading at the reference point that every other value in the series is compared against.
_Avoid_: base, origin, base value

**Step** (UI: Шаг):
The fixed elevation difference between two consecutive marks.
_Avoid_: increment, interval, delta

**Mark** (UI: Проектный размер, Проектные значения):
A generated target value — the staff reading that means the point sits at its design elevation. Produced by the app, never typed by the worker.
_Avoid_: size, design size, measurement

**Measurement** (UI: Проектный размер, Проектные значения):
A staff reading the worker takes at a point and enters by hand. Belongs to Entered mode only; a Mark is not a Measurement. The interface deliberately labels both with the Mark wording — a row and the copied table read the same in either mode — so the distinction lives in the model, not on screen.
_Avoid_: reading, sample, actual

**Offset** (UI: Результат):
The elevation difference between the Zero point and the value in the row — a Mark in Generated mode, a Measurement in Entered mode. Negative means the point sits below the zero point.
_Avoid_: deviation, correction, result

**Position** (UI: Шаг, in the copied table):
The ordinal of a Mark in the series, counted from 1. Note that Шаг names two different things in the UI: the Step value in the input, and the Position column in the copied table.
_Avoid_: index, row number

## Modes

**Generated mode**:
Values come from the app — every Mark in the series is derived from the Zero point and the Step, and cannot be edited.

**Entered mode**:
Values come from the worker — each row holds a Measurement typed in on site. Step does not apply, since each Offset is taken from the Zero point to the Measurement directly.
