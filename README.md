# ResumeForge

ATS-friendly resume builder web app/PWA and Android app.

## Features

- ATS-friendly single-column resume output
- 4 resume templates
- Accent colour and font choices
- LaTeX export
- PDF generation
- Installable PWA
- Offline caching after the first visit
- Android APK with ResumeForge app icon

## Download Android APK

**[📲 Download ResumeForge APK](https://sahrxhh.github.io/ResumeForge/ResumeForge.apk)**

If the link is not available yet, open the repository **Actions** tab and wait for **Build ResumeForge APK** to finish. The APK is also published by the GitHub Pages workflow when Pages is enabled.

## GitHub Pages

The repository includes a GitHub Actions workflow in `.github/workflows/pages.yml`.

Enable **Settings → Pages → Source → GitHub Actions** if Pages is not already enabled.

App website:

**https://sahrxhh.github.io/ResumeForge/**

## Run

No build step is required. Open `index.html` in a browser.

## Tech

HTML, CSS and JavaScript with jsPDF loaded from CDN. Android app uses a native WebView wrapper.
