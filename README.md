# Playwright JS E2E – WinlyCoins

Opinionated, readable test framework for critical paths. JavaScript + Playwright.

## Quick start
```bash
npm i
npx playwright install --with-deps
cp config/env/.env.example .env
# edit .env: BASE_URL, LOGIN_USERNAME, LOGIN_PASSWORD
npm test
# open report
npm run report
```

## Project layout
```
playwright-js-winly/
  tests/
    smoke/
      auth.login.spec.js
      auth.register.spec.js              # placeholders
      password.reset.spec.js             # placeholders
      wallet.deposit.spec.js             # placeholders
      wallet.withdraw.spec.js            # placeholders
      game.spin.spec.js                  # placeholders
    helpers/
      selectors.js
      canvas.js
      payments.mock.js
      ws.js
  pages/
    BasePage.js
    AuthPage.js
    WalletPage.js
    GameLobbyPage.js
    GameCanvasPage.js
    components/
      Modal.js
      TopBar.js
  fixtures/
    users.js
  config/
    playwright.config.js
    env/
      .env.example
  scripts/
    postTestArtifacts.js
  .github/workflows/ci.yml
  .eslintrc.cjs
  .prettierrc
  package.json
  README.md
```

## Philosophy
- Prefer *simple, explicit* flows over heavy abstraction.
- Page Objects only model *stable surface*: TopBar, Auth modal…
- All selectors centralized in `tests/helpers/selectors.js` and are **text/role-first** with fallbacks.
- Tests are short narratives; shared logic lives in small helpers.
