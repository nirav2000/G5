# Shared library installation ledger · 2026-10-15

G5 loads the Apps Platform v1.7.0 loader at runtime and **attempts to install** Auth (shadow), Learning SDK, Learning Sync (guest local), Notes (local, UI disabled), and PWA (G5-specific service worker). Each capability is isolated so a failed remote module does not break lessons. The in-app status displays loaded and failed capabilities; no runtime deployment smoke test has yet verified each module.

- Auth: shadow mode only. No sign-in interface or Firebase credentials wired.
- Learning: guest learning store initialized; the existing G5 event history has not been migrated into the SDK.
- Learning Sync: local guest sync instance created; capture and cloud transport not yet connected.
- Notes: shared Notes initialized with local storage; no notes interface.
- PWA: shared registration attempted using /G5/sw.js, scope /G5/.
- Account, Privacy, Monitor, Firebase Usage, Version Lab: not installed. Must be separately tested, especially child data and account isolation.
- Firebase: kk-syllabus approved as target, but no verified Firebase config, transport, or Firestore rules. No cloud writes.

Never describe runtime initialization as a verified deployment. See BUILD_PLAN.md for release gates.
