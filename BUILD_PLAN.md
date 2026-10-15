# G5 — teaching-first delivery specification
Version 0.2.0 · 15 October 2026

## Product
A novice must be taught before being tested. Every concept follows **See → Hear → Move → Guided try → Explain → Independent try → Spaced review**. Never punish hint use. Use short, child-readable copy and musical examples from scratch. Intended as an independent companion to Christopher Dunn's *Take Five and Pass First Time*, not a reproduction of it. Book page/chapter mapping remains unverified.

## Curriculum map (cumulative Grades 1–5)
1. Rhythm and metre: durations, rests, dots, ties, triplets, duplets, simple/compound/irregular time, grouping.
2. Pitch and notation: treble, bass, alto and tenor clefs, ledger lines, accidentals, enharmonics.
3. Keys and scales: major, natural/harmonic/melodic minor, circle of fifths, up to six sharps/flats, chromatic scale, scale-degree names.
4. Intervals: number, quality, simple and compound intervals.
5. Harmony: triads, tonic/supertonic/subdominant/dominant, inversions and perfect/plagal/imperfect cadences.
6. Transposition: clef/octave and instruments in B-flat, A and F.
7. Terms, ornaments, dynamics, articulation.
8. Instrument families, voices, score observation.

Official source: https://www.abrsm.org/sites/default/files/2023-09/music-theory-syllabus-outline-grades-1-5-from-2020.pdf

## Interaction contracts
- Each topic has a worked demonstration, staged hint and a short checkpoint.
- Stave interactions should use SVG with pointer and keyboard alternatives; sound is optional and user-initiated.
- Save each completed answer once with timestamp, topic, hint count and mode. A reset must not accidentally resurrect cloud data.
- Review after 1, 3, 7, 14 and 30 days; report separate supported practice, immediate fluency, seven-day confidence and thirty-day retention.
- The distinction dashboard requires complete topic coverage and multiple independent mock results; never infer it from a single mini-test.

## Mock and marks
The official Grade 5 online exam has seven sections and 75 marks. Build original questions covering all sections, with selectable, numeric, matching and note placement tasks. The first mock engine is a **practice approximation**, not an official paper or a validated 75-mark equivalent. Use 50/75 pass, 60/75 merit, 65/75 distinction as reference thresholds; verify against the current ABRSM qualification specification before certification-style claims. Do not claim to reproduce the exam interface exactly.

## Shared capabilities and Firebase
Canonical Apps Platform v1.7, Auth, Account, Learning, Learning Sync, PWA, Notes, Privacy, Monitor and Version Lab are candidates. Validate version, initialization contract, identity, offline behavior, child privacy and account boundaries individually. Installation states: Available → Tested-compatible → Installed. No shared-library rollout to other apps.

Authorised Firebase project: kk-syllabus. Require verified web config, authorized domains, Auth provider and Firestore rules before cloud writes. Scope data to `learningSyncApps/g5/users/{uid}/learners/{learnerId}/chunks/{chunkId}`. No public access or permissive rules. Keep guest mode functional without cloud. Guest import requires explicit approval; never merge learners automatically.

## Release gates
Node unit tests, Chromium and WebKit mobile/tablet smoke tests, GitHub Actions success, correct on-screen version, privacy and Firestore emulator rule tests, account switching, offline/online sync, visual review, deployed URL HTTP and interaction verification. Commit directly to main only. No claim of completion without evidence.

## Official marking documents
Online Grades 1–5 are computer-marked; the candidate receives a digital PDF mark form showing marks by section. This is distinct from the examiner-written performance-grade form. ABRSM supplies the real candidate form after the exam; a blank exact replica has not been verified for public redistribution. Include official links and an explicitly **unofficial practice score sheet** rather than presenting an invented document as an official assessor form.

Results: https://www.abrsm.org/en-cy/results-and-certificates
Regulations: https://www.abrsm.org/en-ai/about-our-exams/exam-regulations
Official example interaction sheet: https://www.abrsm.org/sites/default/files/2023-09/abrsm-ot-reference-sheet-example-questions_online-music-theory-from-2020.pdf
