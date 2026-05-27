# Monetization setup

JobQuote Kit is configured for Ezoic-first monetization with Google AdSense as the fallback path.

## Current state

- Ezoic Standalone script is loaded in `index.html`.
- Google AdSense script remains loaded in `index.html`.
- `script.js` uses Ezoic first when real Ezoic placeholder IDs are present.
- If Ezoic placeholder IDs are empty, the site falls back to AdSense slot IDs when those are present.
- If neither provider has real placement IDs, the page keeps clean placeholder ad panels instead of rendering broken ad code.
- Trust/support pages are live at `/about/`, `/editorial/`, `/privacy/`, and `/contact/`.
- A public `/terms/` page is live and linked across the site.
- A `google-adsense-account` meta tag is present on the site pages.

## Fill these after Ezoic setup

In `script.js`, update:

```js
const EZOIC_PLACEHOLDER_MAP = {
  leaderboard: "",
  sidebar: "",
  inline: "",
  footer: ""
};
```

Use the numeric placeholder IDs generated inside the Ezoic dashboard.

Recommended mapping:

- `leaderboard`: the wide ad slot after the main quote workflow.
- `inline`: the ad slot before the guide list.
- `sidebar`: reserved for future article/sidebar pages.
- `footer`: reserved for future footer or bottom-page placement.

## Keep AdSense ready

When Google AdSense approves the site, update:

```js
const ADSENSE_SLOT_MAP = {
  leaderboard: "",
  sidebar: "",
  inline: "",
  footer: ""
};
```

Use Google ad slot IDs from AdSense. Ezoic will still take priority when Ezoic placeholders are present.

## ads.txt

The current `ads.txt` includes the Google publisher line:

```txt
google.com, pub-2456404542897668, DIRECT, f08c47fec0942fa0
```

After Ezoic approves/connects the site, copy the complete Ezoic `ads.txt` lines from the Ezoic dashboard and append them to `ads.txt`. Do not guess these lines manually because Ezoic can provide many seller-specific entries.

## Ezoic AdstxtManager redirect

The site domain is:

```txt
jobkit20.top
```

For the Ezoic/AdstxtManager template, replace `[YOUR_DOMAIN].com` with:

```txt
jobkit20.top
```

So the redirect target is:

```txt
https://srv.adstxtmanager.com/19390/jobkit20.top
```

Static-host redirect files have been added:

- `_redirects` for Netlify and Cloudflare Pages style redirects.
- `vercel.json` for Vercel redirects.

The current production host responds as GitHub Pages (`server: GitHub.com`). GitHub Pages does not support Apache, Nginx, PHP, `_redirects`, or `vercel.json` redirects for `/ads.txt`.

For GitHub Pages, use the added GitHub Actions workflow instead:

```txt
.github/workflows/update-ads-txt.yml
```

It follows Ezoic's automated update method:

```txt
curl -L https://srv.adstxtmanager.com/19390/jobkit20.top > ads.txt
```

The workflow uses a safer version of that command and will only replace `ads.txt` if the download succeeds and looks like a seller list.

Important: the Ezoic manager URL currently needs to be active inside Ezoic. If `https://srv.adstxtmanager.com/19390/jobkit20.top` returns `404`, finish domain/site setup in Ezoic first, then run the workflow manually or wait for the daily schedule.

## Approval-readiness notes

- Keep the contact page published and linked in the main navigation and footer.
- Keep privacy, editorial, about, and terms pages accessible without login or popups.
- Avoid adding aggressive ad placements before approval. Content and tool utility should stay primary.
