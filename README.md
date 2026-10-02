# ResumeForge

ATS-friendly resume builder web app/PWA. Fill in your details, choose a template, generate LaTeX, and create a PDF resume.

## Features

- ATS-friendly single-column resume output
- 4 resume templates
- Accent colour and font choices
- LaTeX export
- PDF generation
- Installable PWA
- Offline caching after the first visit

## Run

No build step is required. Open `index.html` in a browser.

## GitHub Pages

The repository includes a GitHub Actions workflow in `.github/workflows/pages.yml`.

Enable **Settings → Pages → Source → GitHub Actions** if Pages is not already enabled.

The expected Pages URL is:

**https://sahrxhh.github.io/ResumeForge/**

## Download

The original `ResumeForge-github.zip` is also kept in this repository for direct download.

## Tech

HTML, CSS and JavaScript with jsPDF loaded from CDN.