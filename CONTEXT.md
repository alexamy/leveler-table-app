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

**Note on Проектные значения and Результат in the copied table**: these two labels flip by audience. The Entered mode table reads for a person and labels the Measurement column Проектные значения and the Offset column Результат, as the entries above say. The Generated mode table reads for a machine, for which the design value is the offset and the staff reading is what results, so its Проектные значения column holds the Offset and its Результат column holds the Mark. The header row is the same in both modes; it is the values under those two columns that are in opposite order.

**Position** (UI: Шаг in the Generated mode copied table, № in the Entered mode one):
The ordinal of a Mark in the series, counted from 1. Note that Шаг names two different things in Generated mode: the Step value in the input, and the Position column in the copied table. The Entered mode table avoids the collision by calling the column №.
_Avoid_: index, row number

## Modes

**Generated mode**:
Values come from the app — every Mark in the series is derived from the Zero point and the Step, and cannot be edited.

**Entered mode**:
Values come from the worker — each row holds a Measurement typed in on site. Step does not apply, since each Offset is taken from the Zero point to the Measurement directly.
