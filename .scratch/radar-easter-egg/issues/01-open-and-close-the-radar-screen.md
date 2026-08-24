# 01: Open and close the radar screen

**What to build:** five quick taps on the clear button turn the screen black. Tapping anywhere on it, or pressing back on Android, brings the table back exactly as it was — same Zero point, same Step, same Measurements, same mode. The screen is empty for now: no dial, no label, no sound.

The clear button keeps both gestures. Holding it still wipes the table after 1500 ms and shows the hold indicator as it does today; a hold never counts towards the five taps, and a completed wipe resets the count. Taps count only when each lands within 500 ms of the one before; a longer pause starts the count over. Four taps do nothing.

The radar is transient. It is never written to storage, so an app closed while the radar is open reopens on the table, and no saved state can ever bring the radar back.

Two pieces of groundwork belong here. The clear button needs to tell a short tap from a completed hold, which the existing delayed-action helper does not currently report — extend it, or track it in the button, whichever keeps the helper honest. And the tap counting itself goes in a hook beside that helper, taking the count, the maximum gap, and what to do when the streak completes; no timing logic inlined in the button.

**Blocked by:** None (can start immediately).

**Status:** done

- [x] Five taps within 500 ms of each other open a full-screen black overlay
- [x] Four taps leave the table on screen
- [x] Five taps with a gap longer than 500 ms between any two leave the table on screen
- [x] Holding the clear button clears the table after 1500 ms and does not open the radar
- [x] The hold indicator still appears while the clear button is held
- [x] Tapping the radar closes it
- [x] Android back closes it
- [x] The Zero point, Step, Measurements and mode are unchanged across open and close
- [x] The keyboard is dismissed when the radar opens
- [x] The status bar is hidden while the radar is open and back when it closes
- [x] The radar flag never appears in the payload written to storage
- [x] A restored saved state opens on the table
- [x] Tap counting lives in a reusable hook next to the existing delayed-action helper
- [x] New tests drive the real app through its root, as the existing clear-button tests do; the radar screen gets an entry in the shared test accessors
- [x] The existing suite, the Jest configuration and the shared test setup are untouched and pass
