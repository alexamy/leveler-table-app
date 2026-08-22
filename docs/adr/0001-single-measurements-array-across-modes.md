# Single measurements array shared by both modes

A row holds a Mark in Generated mode and a Measurement in Entered mode, but the two occupy the same column and share the same Offset rule, so both modes store rows in one `State.measurements` array rather than keeping a list per mode. Switching to Generated therefore recomputes every row from Zero point and Step, replacing each Measurement the worker typed with a Mark; when Step is empty the rows go blank and toggling back does not restore them.

## Considered Options

- **One array per mode.** Lossless round-trip, but doubles the persisted state, forces the copied table and the reset behaviour to pick a list, and lets the two lists drift out of sync in length.
- **Clear rows on every mode switch.** Unambiguous, but turns a small toolbar control into a data-loss button even when nothing would have been overwritten.

## Consequences

The destructive case is guarded rather than designed away: switching to Generated while at least one row holds a non-empty value opens a confirmation dialog, and the mode flips only on confirm. Every other transition — into Entered, or out of Entered with nothing typed — is silent. A future reader tempted to "fix" the overwrite by splitting the array should read this first.
