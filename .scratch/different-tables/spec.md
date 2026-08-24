# Different tables per mode

Status: ready-for-agent

## Problem Statement

The copied table has one fixed header row over one fixed column order, used in both modes. That was deliberate: the Entered mode spec promised the same columns in both modes so everything pasted lands in one consistent sheet, and the glossary binds Проектные значения to the Mark/Measurement column and Результат to the Offset column.

Two audiences read the copied table, and they do not name the same things the same way. Generated mode produces a table for the machine: there the designed value is the offset from the Zero point, and the staff reading is what results. Entered mode produces a table a person reads, and a person reading a column of ordinals does not call them Шаг — that word is already the Step input on the same screen.

## Solution

The copied table varies by mode, in one way per mode.

Generated mode keeps today's header row and swaps the two columns under Проектные значения and Результат: the Offset moves into the Проектные значения column, the Mark into the Результат one. The words above them do not change.

Entered mode keeps today's columns exactly as they are and renames the position column to `№`.

## Decisions

- **Overrides Entered mode story 28** ("the copied table has the same columns in both modes"). The two tables now differ: Generated mode carries the Offset and the Mark in the opposite order to Entered mode.
- **Generated mode swaps content, not labels.** Проектные значения and Результат stay where they are in the header row; the values under them trade places.
- **Проектные значения and Результат mean different things by audience.** For the machine, the design value is the offset and the reading is the result — hence the swapped content. For a person, the design value is the reading they took and the result is its offset. This is a per-mode naming convention, not a change to what the model computes.
- **`№` is Entered mode only.** Generated mode keeps `Шаг` over the position column.

## Table shapes

Generated mode — header row unchanged, last two columns swapped:

```
Шаг	Нулевая точка	Проектные значения	Результат
1	500	-200	700
2	500	-400	900
```

Entered mode — columns unchanged, position column renamed:

```
№	Нулевая точка	Проектные значения	Результат
1	500	612	-112
2	500	530	-30
```

## Out of scope

- On-screen labels. There are no column headers on screen — only the Zero point and Step input placeholders — and none of them change.
- Column count, the tab separator, and the number formatting of any value.
- Any change to how Marks, Measurements, or Offsets are computed or rounded.
