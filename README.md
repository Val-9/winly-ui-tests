# Winly UI Automation Framework

## 1. Install dependencies

npm install
npx playwright install

## 2. Create .env file

Copy `.env.example` to `.env` and set valid credentials.

`setup` project generates `storage/auth.json` automatically before dependent projects run.

## 3. Run tests

npm run test

> Note: backend allows only one active session per user. Test execution is configured as single-worker and projects are chained to avoid session invalidation.

## 4. Open HTML report

npm run report
