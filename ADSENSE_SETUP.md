# AdSense Setup

This site is wired for Google AdSense, but it is intentionally disabled by default.

## 1. Add your publisher ID

Open [script.js](/Users/deng/Documents/Codex/2026-05-11-new-chat/script.js) and update:

```js
const ADSENSE_ENABLED = true;
const ADSENSE_CLIENT = "ca-pub-YOUR_REAL_PUBLISHER_ID";
```

Google documents that the AdSense code should be placed on every page, and your publisher ID looks like `pub-1234567890123456`.

The current site version keeps the placeholders visible until you switch this on, which is useful while the site is still under review or before the domain is fully live.

## 2. Replace the slot IDs

Still in [script.js](/Users/deng/Documents/Codex/2026-05-11-new-chat/script.js), replace the placeholder values in `ADSENSE_SLOT_MAP` with the real ad unit slot IDs you create in AdSense.

Suggested mapping:

- `leaderboard`: homepage top banner
- `sidebar`: article sidebar unit
- `inline`: article mid-content unit
- `footer`: bottom article unit

## 3. Update ads.txt

Edit [ads.txt](/Users/deng/Documents/Codex/2026-05-11-new-chat/ads.txt) and replace the example line with your real publisher ID.

## 4. Update privacy details

Update [privacy/index.html](/Users/deng/Documents/Codex/2026-05-11-new-chat/privacy/index.html) with your live AdSense and consent details before applying.

## 5. Submit the live site first

Before applying or turning ads on, make sure the live domain is indexable and submitted in:

- Google Search Console
- Bing Webmaster Tools

This helps validate that the site is crawlable, has a sitemap, and is ready for review.

## 6. Keep enough original utility on-page

The strongest monetization case for this project is the combination of:

- a repeat-use quote workbench on the homepage
- original service-specific guides
- clear About, Editorial, and Privacy pages

Do not strip the page down to only ads and short text. The tool and supporting content are what make the inventory more valuable.

## Notes

- With `ADSENSE_ENABLED = false`, the site keeps the custom placeholder ad blocks.
- With `ADSENSE_ENABLED = true`, the placeholder blocks are replaced by responsive AdSense units.
- This setup uses responsive display ads, which Google says adapt automatically to different page layouts and devices.
