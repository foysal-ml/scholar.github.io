# Foysal Ahammad – Harvard/MIT‑styled Academic Website

**Repo:** https://github.com/foysal-ml/scholar.github.io  
**Pages URL:** https://foysal-ml.github.io/scholar.github.io/

## Highlights
- Multi-page HTML site (About, Stanford Fit, Research, Publications, Teaching, Awards, News, Contact)
- **Appearance panel**: Light/Dark, background (White/Warm/Dim/Paper), and accent (Harvard/MIT/Stanford/Cobalt)
- Command Palette (⌘/Ctrl+K), active nav, back-to-top
- Publications: live search + year filter (from `assets/pubs.json`)
- Contact form sends to **foysalgebt@gmail.com** via FormSubmit (no backend)
- SEO: `sitemap.xml`, `robots.txt`, `og-image.jpg`
- 404 page

## Local Run
Open `index.html` directly, or:
```bash
python -m http.server 8000
# visit http://localhost:8000
```

## Publish
```bash
git clone https://github.com/foysal-ml/scholar.github.io.git
cd scholar.github.io
# copy ALL files from this folder into the repo root
git add .
git commit -m "Update site"
git push
```
Then in GitHub: Settings → Pages → Deploy from branch → Branch `main` / root.

### Contact form notes
- Uses FormSubmit (`https://formsubmit.co/YOUREMAIL`). It's already pointed at **foysalgebt@gmail.com**.
- On first submission, FormSubmit sends a one‑time confirmation email to verify forwarding.
- If you prefer another provider (Formspree, EmailJS), swap the `<form action=...>` and keys.
