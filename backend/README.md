# ResumeForge backend setup

The web/Android app is prepared for:
- Google Sign-In
- explicit resume-data consent
- secure backend submission after resume generation
- storing each user's resume record
- generating CSV/XLSX records
- emailing a notification/record to `sahrxhh.in@gmail.com`

## Required configuration

In `index.html`, replace:
- `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
- `YOUR_BACKEND_URL`

Do not put Google client secrets, email passwords, API keys, or service-account private keys in this public repository.

## Backend contract

The app POSTs JSON:
```json
{
  "googleUser": {"id":"...", "name":"...", "email":"...", "picture":"..."},
  "resume": {},
  "template": "classic",
  "accent": "#1a4fd6",
  "font": "sans",
  "latex": "...",
  "createdAt": "..."
}
```

The backend should authenticate/validate the request, store the record, create/update the Excel/CSV dataset, and send the configured notification email.

Microphone/camera/media permissions are intentionally not requested because they are not needed by the current feature set.
