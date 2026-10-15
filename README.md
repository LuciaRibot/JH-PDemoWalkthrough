# JH&P AI-Embedded Client Onboarding: walkthrough and takeaway deck

Captured from the live Appian demo on `cms-2.appiancloud.com` with Playwright.

- **Interactive walkthrough (Storylane-style):** https://claude.ai/artifact/L9YMg465neZZrzD2BBpSrV (private; share from the page's Share menu). `docs/` is the standalone site for GitHub Pages.
- **Takeaway deck:** `deck/JH&P | AI-Embedded Client Onboarding | DEMO Takeaway Deck.pptx` (built on the TMF takeaway deck template by `deck/build_deck.py` from `deck/spec.json`).

## Re-capturing

Capture attaches to your own signed-in Chrome, so there are no credentials in this package. Start Chrome with `--remote-debugging-port=9333`, sign in to cms-2, keep one tab open, then:

```bash
cd capture
node reset.mjs                 # Settings > Reset demo
node phase-client.mjs          # Rebecca's application (100-120)
node phase-client-ai.mjs       # onboarding assistant (150-152)
node phase-cse1.mjs            # queue, case assistant, case tabs (200-214)
node phase-cse2.mjs && node phase-cse2b.mjs   # screening (300-313)
node phase-cse3.mjs            # DocCenter, resolve, send for approval (400-419)
node phase-pm.mjs              # approval, client result, MI (500-702)
node assemble.mjs && node build.mjs && node verify-player.mjs
```

The phases run in order against the same case, and several steps are one-way: re-run from `reset.mjs`. `ONLY=416,417 node phase-cse3.mjs` re-captures single steps. Copy lives in `capture/copy.json`. DocCenter needs about 2½ minutes after the client submits before `phase-cse3` can reconcile.

Frame 100 was edited after capture to show the CSE initials "LR" (the portal showed a stale "MP" at the time; since fixed in the app).
