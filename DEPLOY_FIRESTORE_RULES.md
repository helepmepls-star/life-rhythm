# Prerequisites

- Node.js & npm installed
- Firebase CLI installed (or install via `npm i -g firebase-tools`)
- You must be an owner/editor of the Firebase project

Quick one-time deploy (local)

1. Login with Firebase CLI:

```bash
firebase login
```

1. Select the project (optional if `projectId` in `src/firebaseConfig.js` is correct):

```bash
# list projects
firebase projects:list

# set active project
firebase use --add
```

1. Deploy Firestore rules only:

```bash
firebase deploy --only firestore:rules
```

1. Verify in Firebase Console → Firestore → Rules that the new rules are active.

CI / Production: automatic rules deploy on push

Use CI to avoid manual deploys. Below is a minimal GitHub Actions workflow that deploys rules when you push to `main`. It requires a `FIREBASE_TOKEN` secret (generate with `firebase login:ci`).

- Create a repository secret `FIREBASE_TOKEN` with the token from `firebase login:ci`.
- Commit the workflow at `.github/workflows/deploy-firestore-rules.yml` (example included in repo).

Notes & recommendations

- Ensure `projectId` in `src/firebaseConfig.js` matches the Firebase project you deploy rules to.
- Confirm client writes include `ownerId` (we already set this in `MyPrayers.js`).
- Do not relax rules in production; instead fix mismatches (client UID vs path) or handle writes server-side.
- Consider enabling App Check to protect from unauthorized clients.

If you want, I can create the GitHub Action file now and show you the exact command to generate a `FIREBASE_TOKEN`.

Deploying Cloud Functions (scripture proxy)

1. Initialize functions (if not already):

```bash
firebase init functions
```

2. Install dependencies in `functions/`:

```bash
cd functions
npm install
```

1. Deploy functions:

```bash
firebase deploy --only functions:scripture
```

After deploying, `src/components/Scripture.js` calls the function at `https://us-central1-<projectId>.cloudfunctions.net/scripture`.
