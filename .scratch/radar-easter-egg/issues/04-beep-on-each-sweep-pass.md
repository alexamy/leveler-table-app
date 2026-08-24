# 04: Beep on each sweep pass

**What to build:** the scope pings. A beep the moment the radar opens, then one every time the sweep crosses the top of the dial — so the sound belongs to what is on screen instead of running on its own clock.

The beep obeys the phone. On iOS the silent switch is respected, so the audio mode is left alone rather than overridden. Leaving the app stops the beeping, coming back resumes it, and closing the radar stops it and releases the sound.

The sound itself is a committed asset: a short sine tone, around 1000 Hz and 120 ms, mono, with a brief attack and decay so it does not click. The audio library cannot generate tones, so the file is produced once and checked in.

This adds the Expo audio library, pinned to the version bundled with the Expo SDK in use, and confines it to a single module that owns loading, playing on interval, pausing on background, and unloading. Nothing else in the app imports it — that module is the seam the tests mock.

**Blocked by:** 03.

**Status:** done

- [x] A beep plays as soon as the radar opens
- [x] A beep plays once per revolution, as the sweep passes the top
- [x] Beeping stops when the radar closes and when the app goes to the background
- [x] The beep is silent when the iOS silent switch is on
- [x] The tone is a committed asset and does not click on playback
- [x] The audio library is pinned to the version bundled with the project's Expo SDK, and is imported from exactly one module
- [x] The radar tests mock that one module and nothing else new
- [x] The existing suite, the Jest configuration and the shared test setup are untouched and pass
