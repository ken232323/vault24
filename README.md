# Vault24 Customer App

React + Vite + Mantine + JavaScript. Runs on http://localhost:5173

```bash
npm install
npm run dev
```
`.env`: `VITE_USE_MOCK=true` uses the built-in mock API (demo@vault24.test / Password123!).
Set `VITE_USE_MOCK=false` to call the Express API at `/api` (proxied to :4000).
Sign-up fields: name, email, bank account number (10 digits), password.
