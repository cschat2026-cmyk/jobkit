# Google And Bing Setup

The site is prepared for:

- Google Search Console
- Bing Webmaster Tools
- sitemap submission
- `ads.txt` validation

Current live domain:

- `https://jobkit20.top/`

Current sitemap:

- `https://jobkit20.top/sitemap.xml`

Current robots file:

- `https://jobkit20.top/robots.txt`

## What Was Added

In the homepage head section:

- `google-site-verification`
- `msvalidate.01`
- page keywords
- Googlebot and Bingbot directives
- referrer and publisher metadata

In all main HTML pages:

- page-specific `keywords`
- `robots`
- `googlebot`
- `bingbot`
- `author`
- `publisher`

## What You Still Need To Do

### Google Search Console

1. Open Google Search Console.
2. Add the property `https://jobkit20.top/` or the domain property `jobkit20.top`.
3. If you use HTML meta verification, copy the token Google gives you.
4. Replace this line in [index.html](/Users/deng/Documents/Codex/2026-05-11-new-chat/index.html):

```html
<meta name="google-site-verification" content="replace-with-google-search-console-token" />
```

5. Redeploy the site.
6. Submit `https://jobkit20.top/sitemap.xml`.

### Bing Webmaster Tools

1. Open Bing Webmaster Tools.
2. Add the site `https://jobkit20.top/`.
3. Copy the verification token.
4. Replace this line in [index.html](/Users/deng/Documents/Codex/2026-05-11-new-chat/index.html):

```html
<meta name="msvalidate.01" content="replace-with-bing-webmaster-tools-token" />
```

5. Redeploy the site.
6. Submit `https://jobkit20.top/sitemap.xml`.

## Important Note

The `keywords` meta tag is low-impact for Google rankings today, but it is harmless as supporting metadata and can still help with page organization and some secondary tools.

The most important ranking and indexing signals here are still:

- page titles
- unique descriptions
- clean canonical URLs
- internal links
- sitemap consistency
- mobile usability
- original useful content
