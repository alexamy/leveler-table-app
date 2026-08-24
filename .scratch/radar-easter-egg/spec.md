# Radar easter egg

Status: ready-for-agent

## Problem Statement

The app is a field tool and nothing else. It does one job — Zero point in, Step in, series of Marks out — and every pixel on the screen is in service of that job. There is nothing in it that belongs to the people who use it rather than to the work.

The team wants a hidden joke in the build: a mock radar sweep that claims to be locating Петрушкин. It has to be genuinely hidden, so a worker on site never stumbles into it while clearing the table, and it has to be genuinely harmless, so entering it cannot lose a Zero point, a Step, or a single Measurement.

## Solution

Five quick taps on the clear button open a full-screen radar.

The clear button is a press-and-hold: holding it for 1500 ms wipes the table, and a short tap does nothing at all today. That unused short tap becomes the trigger. Five of them, no more than 500 ms apart, and the screen turns into a black scope with a green sweep line rotating clockwise, concentric rings, a crosshair, and a beep each time the sweep passes the top. There are no targets — it never finds anything. Along the bottom, "Определяем Петрушкина" fades in and out.

The radar sits above the table, not in place of it. The table stays mounted, the Zero point, Step and Measurements are untouched, and nothing about the radar is ever written to storage — reopening the app after a crash inside the radar puts the worker back on a normal table. Tapping anywhere, or pressing back on Android, closes it.

Holding the clear button behaves exactly as it does today: the wipe still fires at 1500 ms, and a hold never counts towards the five taps.

## User Stories

1. As a worker, I want the app to look and behave exactly as it does now until I go looking for the easter egg, so that my work is never interrupted by something I did not ask for.
2. As a worker, I want five quick taps on the clear button to open the radar, so that there is a way in for someone who has been told about it.
3. As a worker, I want the taps to count only when they land within 500 ms of each other, so that a slow, deliberate press is never mistaken for the trigger.
4. As a worker, I want the tap streak to reset after a pause, so that taps spread across a working session cannot accumulate into an accidental entry.
5. As a worker, I want four taps to do nothing, so that the easter egg needs intent rather than fumbling.
6. As a worker, I want holding the clear button to still clear the table after 1500 ms, so that the gesture I rely on is unchanged.
7. As a worker, I want a completed clear to reset the tap streak, so that a wipe followed by a few taps does not open the radar.
8. As a worker, I want a hold to never count as a tap, so that the two gestures on one button stay separate.
9. As a worker, I want the clear button's hold indicator to keep appearing as it does today, so that the hold gesture gives the same feedback it always has.
10. As a worker, I want the radar to cover the whole screen, so that the joke lands rather than looking like a widget.
11. As a worker, I want the radar to be black with green markings, so that it reads as a movie radar scope at a glance.
12. As a worker, I want a sweep line that rotates clockwise, so that it looks like it is searching.
13. As a worker, I want the sweep to trail a fading wedge behind it, so that it looks like a phosphor scope rather than a spinning stick.
14. As a worker, I want concentric rings and a crosshair on the dial, so that the scope has range markings like the real thing.
15. As a worker, I want the dial to glow, so that the screen has the look of a lit CRT.
16. As a worker, I want the radar to never find a target, so that the joke stays that it is still looking for Петрушкин.
17. As a worker, I want a beep each time the sweep passes the top of the dial, so that the sound belongs to what I am watching rather than running on its own clock.
18. As a worker, I want a beep as soon as the radar opens, so that the first four seconds are not silent as if the sound were broken.
19. As a worker, I want the beep to respect my phone's silent switch, so that opening the radar in a quiet place does not announce itself.
20. As a worker, I want the beep to stop when I leave the app, so that nothing keeps pinging in the background.
21. As a worker, I want "Определяем Петрушкина" along the bottom, so that the joke is spelled out.
22. As a worker, I want that label to fade in and out rather than sit still, so that the screen feels alive.
23. As a worker, I want the dial to fit whatever phone I am holding, in portrait or landscape, so that it is not cropped or lost in the middle of a large screen.
24. As a worker, I want the status bar hidden while the radar is open, so that the black screen is unbroken.
25. As a worker, I want tapping anywhere on the radar to close it, so that I am never trapped in it.
26. As a worker on Android, I want the back button to close the radar, so that the gesture I expect works.
27. As a worker, I want my Zero point, Step and Measurements to be exactly as I left them when the radar closes, so that the easter egg cannot cost me my work.
28. As a worker, I want the keyboard dismissed when the radar opens, so that it does not sit over the scope.
29. As a worker, I want the radar to never be saved, so that closing the app inside it and reopening puts me back on a normal table.
30. As a worker, I want a table restored from storage to open as a table, so that a previously saved state can never bring the radar back.
31. As a worker, I want the mode I was in — Generated or Entered — to be untouched by the radar, so that the easter egg has no bearing on the tool.
32. As a worker on the web build, I want the radar to work there too, so that the joke is not silently missing on one platform.

## Implementation Decisions

**Trigger.** The tap streak counts only presses that ended before the 1500 ms clear timer fired — a short tap. A hold that completes and wipes the table does not count, and resets the streak. The gap between consecutive taps is capped at 500 ms; a longer gap resets the count to zero. Five taps open the radar and reset the streak. The clear button's existing press-and-hold path — the 1500 ms delayed reset and the hold indicator dispatch — is not changed, so the indicator still flashes on each tap of the streak. This was considered and accepted rather than overlooked.

**Tap streak hook.** A `useTapStreak(count, gapMs, onReached)` hook lives alongside the existing `useDelayedAction` helper, in the same helpers module and with the same shape — it returns the handlers the button wires up. No timing logic is inlined in the button component.

**Radar flag in state.** The radar is a transient boolean on the reducer's `State`, exactly mirroring the existing `waitingDeletion` field and its `waiting deletion` action: one field, one action carrying a boolean value. The persistence layer whitelists the fields it writes, so the flag cannot reach storage; restoring a saved state always produces a closed radar. The flag is not part of the persisted shape or its type guard.

**Overlay.** The radar renders as a React Native `Modal` with a fade animation, not an absolutely positioned view. The `Modal` gives Android back handling through its close request, covers the status bar, and leaves the table mounted underneath so no table state is rebuilt on open or close. The status bar is hidden while the radar is open and restored on dismiss. The keyboard is dismissed on open. A full-screen pressable closes the radar.

**Dial.** Drawn with `react-native-svg`, pinned to the version bundled with the project's Expo SDK. All geometry is expressed in a square 100×100 viewBox so it is resolution-independent; the rendered size is derived from the window's shorter dimension, which handles both orientations without branching. The dial has three concentric rings, a horizontal and vertical crosshair, spokes at 45°, and a sweep wedge of roughly 60° with an alpha gradient so the trail fades behind the leading edge. Phosphor green on pure black. React Native has no blur filter, so the glow is approximated with layered low-opacity circles.

**Sweep and animation.** One clockwise revolution every 4 seconds, starting from the top, driven by a looping rotation. The bottom label fades between full and near-zero opacity over 800 ms. Both animations run on the native driver everywhere except web, where the native driver is unavailable and would warn.

**Beep.** `expo-av`, pinned to the version bundled with the project's Expo SDK, is confined to a single module exposing a `useBeep` hook. That module owns loading, unloading, the interval, and pausing on app background; nothing else in the app imports `expo-av`. The beep fires on open and then once per revolution as the sweep passes the top. The audio mode is left at its default, so iOS honours the silent switch. The sound is a committed WAV asset — a 1000 Hz sine, 120 ms, mono 16-bit at 22.05 kHz, with a short attack and decay so it does not click. `expo-av` cannot synthesise tones, and Metro bundles `.wav` by default.

**Wording.** The bottom label is the exact string "Определяем Петрушкина", set in a monospace face with slight letter spacing, in the same green. Not uppercased.

**Structure.** The radar lives in its own folder next to the existing table folder, split into the modal container and a stateless dial that draws the SVG. The beep module sits at the source root beside the other non-component modules.

## Testing Decisions

A good test here asserts what the worker sees and what survives, not how it is built. Tests drive the real app through its public surface — render the root, press the real buttons, advance the real timers — and assert on rendered output and on the payload handed to storage. They do not reach into the reducer, the hook, or the animation values.

**Seams.** One primary seam, already established: rendering the app root under React Testing Library, with element accessors gathered in the shared test accessor module. Every trigger, exit and persistence assertion goes through it. The accessor module gains one entry for the radar screen. One new seam is unavoidable: audio cannot run under Jest, so the beep module is the boundary and is mocked wholesale. Nothing else is mocked — the SVG library is already permitted through the Jest transform configuration and renders for real.

**Prior art.** The existing clear-button tests are the model: render the root, fire `pressIn` / `pressOut` on the real clear button, advance fake timers, assert on visible output. The existing persistence tests are the model for asserting that a field never reaches the stored payload, and for restoring a payload and checking what the app opens on.

**Coverage.** A new test file for the radar covers: five fast taps open it; four do not; five taps with a gap beyond the threshold do not; a completed hold still clears the table and does not open it; a tap on the radar closes it; the table's Zero point, Step and Measurements are unchanged across open and close; the radar flag never appears in what is written to storage; a restored saved state opens on the table.

**Existing suite.** The clear-button tests, the persistence tests, the Jest configuration and the shared test setup are all left untouched. The suite passes as it stands.

## Out of Scope

- Any target, blip, or contact on the scope. It never finds anything.
- A second way in. Five taps on the clear button is the only trigger.
- Any way to discover the easter egg from the interface — no hint, no label, no changed icon.
- Reduced-motion or other accessibility accommodations for the animation.
- Configuration: sweep speed, colours, beep pitch and the label are all fixed.
- Any change to the Zero point, Step, Marks, Measurements, Offsets, the copied table, or either mode.
- Overriding the iOS silent switch to force the beep.
- An architecture decision record. The two added dependencies are recorded here.

## Further Notes

Two new dependencies, both pinned to what the project's Expo SDK bundles: an SVG renderer for the dial and the Expo audio library for the beep. Both are worth it — without the SVG gradient the sweep is a spinning line rather than a scope, and the beep is half the joke.

The clear button now carries two gestures. They are separated by duration, which is reliable, but it is the one place where an unrelated future change to the clear button could break the easter egg. The tap-streak tests will catch it.

Петрушкин is never found. That is the joke.
