# Junior Music Studio design · v0.5.0

## Approach
G5 uses an original manuscript-inspired teaching interface: cream paper, midnight-violet recital stage, coloured stave/topic cues and short, non-patronising explanations. It aims to make a Grade 5 theory journey approachable without implying that the current ten lessons are a complete Grade 5 syllabus.

## Shipped
- A responsive welcome stage showing the actual number of lessons with at least one correct answer.
- Four evidence-based metrics: lessons tried correctly, total answers, previously attempted topics currently due, and consecutive-day practice streak.
- Mobile swipeable and desktop vertical repertoire cards. Colours are secondary to visible text and state labels.
- Working 'Continue practising' and 'Revisit a topic' actions. Reviews prioritise genuinely attempted and due lessons, then unseen lessons.
- A lesson workspace with four progress segments, existing stave illustrations, playable tones, hints and encouraging feedback.
- A separate quiet practice layout. The original 75-question repeated-item paper remains explicitly labelled a *teaching approximation*, not a validated ABRSM mock.
- Progress, resources and account views retained with local history export and clear sync status.
- Keyboard-visible focus, reduced-motion handling, responsive 320px+ layout, semantic names, and no required external font or image assets.

## Deferred (not disguised as shipped)
Complete Grades 1–5 curriculum, validated exam simulation and official ABRSM mark sheets. These require separate content work and licensed source material where appropriate.

## Versioning and QA
v0.5.0 updates HTML, package, service-worker cache and tests. Run npm test; verify Pages Actions deployment; visually inspect in Chromium and WebKit at mobile/tablet/desktop widths, including new sign-ins, before declaring cross-browser acceptance.
