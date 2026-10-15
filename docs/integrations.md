# Shared capability installation ledger · 2026-10-15

| Capability | State | Notes |
|---|---|---|
| Apps Platform v1.7 | Available | Contract inspected; not wired into UI |
| Auth v1 | Available | Shadow mode supported; Firebase identity not configured |
| Account / Privacy | Available | Integration requires account UX and testing |
| Learning SDK | Available | Separate local G5 event ledger is implemented; SDK not installed |
| Learning Sync v1 | Available | Auth and Firestore same-project and security gates unresolved |
| PWA | Available | Manifest added; service worker not installed |
| Notes | Available | Not installed |
| Monitor / Firebase Usage | Available | Not installed; child privacy review required |
| Notifications | Available | Not installed; unnecessary for initial child experience |
| Version Lab | Available | Not installed; must remain developer-only |

Shared source reference: Apps main 4ab46af3d052c41d82c29c7088b0b1215b244531. CI fetches an immutable snapshot for contract review only, not runtime installation.

Firebase project kk-syllabus is authorised, **not connected**. Before enabling remote writes: obtain correct Firebase web config, verify permitted sign-in domain/provider, merge least-privilege rules without replacing existing rules, run emulator tests, test offline sync, and add explicit guest import and remote deletion flow. Do not deploy permissive rules.
