# G5 shared capability gates

Shared Apps source reviewed at commit `4ab46af3d052c41d82c29c7088b0b1215b244531`.

| Capability | Status | Gate |
|---|---|---|
| Apps Platform v1.7 | Available | Test manifest and lazy loading on Pages |
| Auth v1 | Available | Verify Firebase project and account switching |
| Learning SDK | Available | Migrate local event history without duplication |
| Learning Sync | Available | Merge Firestore owner rules; test offline and reset tombstones |
| PWA | Available | Offline assets and iOS Safari smoke tests |
| Notes | Available | Test permissions and data isolation |
| App Monitor / Firebase Usage | Available | Consent and no child data leakage |
| Notifications | Available | Parent opt-in only |
| Version Lab | Available | Developer-only, never in learner UI |

None of the above is marked Installed without validated integration. kk-syllabus is approved but credentials and owner-scoped rules have not been deployed. Do not claim cloud persistence.
