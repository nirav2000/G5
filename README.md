# G5 — Music Theory Studio

An independent original teaching companion for ABRSM Grade 5 Music Theory, to use alongside Christopher Dunn's *Take Five and Pass First Time*. Not affiliated with ABRSM or the publisher.

## Current release — v0.2.0 (novice-first prototype)

Start with `index.html` using a local HTTP server or a configured GitHub Pages site (the module fetches `src/lessons.json`). Twelve original lessons guide learners from reading the stave through note values, time, scales, keys, relative minors, intervals, transposition, triads, cadences, terms and instruments.

Every lesson includes a plain-English explanation, numbered steps, a worked example, a guided question, an optional hint and feedback. Answers revealed without an attempt are recorded separately. Hints do not penalise scores.

The learning ledger is saved only in this browser under `g5:learning:v2`; it is exportable as JSON. The earlier v0.1 history is not silently merged. Review-due counts use provisional intervals and are not validated mastery scores.

## Important limitations

This is not a complete ABRSM Grade 5 syllabus, not a distinction-readiness assessment, and not yet mapped to verified book pages. Full musical notation exercises, exam-style written answers, sound examples, harmony and score questions, comprehensive tests and source verification remain outstanding. The initial 12 lessons have one checkpoint each; they are teaching demonstrations, not sufficient spaced assessment.

Cloud sync, shared Auth/Account, privacy, monitoring, PWA offline caching, shared learning SDK, Version Lab and release-gated Pages deployment have **not** been installed. The shared-library compatibility inventory is in `PLATFORM_INTEGRATION.md`. kk-syllabus Firebase use is authorised but no live cloud credentials or rules are deployed.

## Development

`npm test` runs baseline tests; `node --check src/studio.js` checks the new client script. The single GitHub Actions workflow validates source but does not publish Pages. All work targets `main`.

## Next priorities

1. Audit official ABRSM Grade 5 specification and build a verified comprehensive curriculum with prerequisite gaps.
2. Build real stave notation, audio, composition/harmony, transposition and free-response marking.
3. Build per-concept adaptive lessons, 7/30-day retention evidence and realistic timed practice, with a transparent distinction-readiness model.
4. Integrate and security-test Apps shared capabilities and namespaced kk-syllabus Firebase, including guest migration, account isolation, offline sync and deletion.
5. Validate Chromium/WebKit on mobile/tablet and deploy through a gated release workflow.
