# Siddarth Santosh — Personal Website

Production-ready, accessible, multi-page website built with semantic HTML, modular CSS, and zero external runtime dependencies.

## Architecture & Directory Structure

```
d:\blog_website\
├── index.html                                # Homepage (hero, 3 color series grids, solid color blocks)
├── blog\
│     ├── index.html                          # Blog archive / series directory (supports future posts)
│     └── bringing-connecting-math-concepts.html # Bangalore project article with 4 real photos
├── about\
│     └── index.html                          # About page (bio, quick facts, contact CTA)
├── contact\
│     ├── index.html                          # Contact page with accessible serverless form
│     └── success.html                        # Progressive enhancement confirmation fallback
├── assets\
│     ├── css\
│     │     ├── styles.css                    # Design tokens, typography, layout, components, focus rings
│     │     └── responsive.css                # Breakpoints for laptop, tablet, and mobile
│     ├── js\
│     │     └── main.js                       # Lightweight form handling, spam honeypot, live status
│     ├── images\
│     │     └── blog\                         # High fidelity photos for blog articles
│     │           ├── hero-curriculum-handover.jpg
│     │           ├── center-welcome-bangalore.jpg
│     │           ├── unpacking-math-materials.jpg
│     │           └── classroom-learning-session.jpg
│     └── icons\
│           └── favicon.svg                   # Crisp SVG favicon matching design system
├── robots.txt                                # Disallow all web crawlers (unlisted site directive)
├── favicon.ico                               # Favicon fallback
└── README.md                                 # Technical documentation
```

---

## Design System & Principles

1. **Strict Design Identity**:
   - Typography: **Fraunces** (headings) and **Inter** (body text).
   - Color Palette: Cream (`#F7F5EF`), Ink (`#2B2A28`), Blue (`#4A7FA5`), Tan (`#A38B4A`), Clay (`#B9754B`).
2. **Homepage Card Rule**:
   - The colored rectangles shown on all homepage cards are **the final intentional design, NOT placeholders**.
   - Do **NOT** replace them with photos. Even after 100 future posts, homepage cards must remain solid color blocks.
   - Photos belong **only** inside blog articles.
3. **Blog Images**:
   - Images are framed in containers with `#DCE9F0` backgrounds, `border-radius: 10px`, and `object-fit: contain`.
   - Lazy-loading is active on off-screen images; the hero image uses eager loading with high fetch priority.

---

## Contact Form Setup

The contact form is configured to forward submissions to **`siddarthsantosh3@gmail.com`**.

### 1. Netlify Forms (Default & Recommended)
The site is built with native Netlify Forms attributes:
```html
<form id="contact-form" name="contact" method="POST" action="success.html" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact">
```
When deployed on Netlify:
1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Navigate to **Site configuration > Forms > Form notifications**.
3. Add a notification: **Email notification** &rarr; recipient: `siddarthsantosh3@gmail.com`.
4. Netlify will automatically notify you on every submission with spam filtering enabled.

### 2. Alternative Serverless Providers (Web3Forms / EmailJS)
If you deploy on GitHub Pages, Cloudflare Pages, or another static host:
- In `assets/js/main.js`, you can simply point the `fetch` endpoint to Web3Forms (`https://api.web3forms.com/submit`) with an access key or configure EmailJS.

---

## How to Add a New Blog Post (Future Expansion)

Adding a new post takes less than 2 minutes:

1. **Create the HTML post**:
   - Duplicate `blog/bringing-connecting-math-concepts.html` to a new file in `/blog/` (e.g. `blog/ensuring-strong-reading-curriculum.html`).
   - Update `<title>`, `<meta name="description">`, `<h1>`, and article paragraphs.
   - If using photos, place them in `assets/images/blog/` and wrap with `.story-photo-box`.

2. **Add to Homepage Card Grid**:
   - In `index.html`, locate the relevant series (`.series.blue`, `.series.tan`, or `.series.clay`).
   - Add or link the card:
     ```html
     <a href="blog/ensuring-strong-reading-curriculum.html" class="card">
       <div class="thumb" aria-hidden="true"></div>
       <p class="tag">Chapter two</p>
       <p class="title">Ensuring a strong reading curriculum fits the classroom it serves</p>
     </a>
     ```

3. **Add to Blog Archive**:
   - In `blog/index.html`, add the link under the corresponding series.

---

## Privacy Directives

As requested by the client, the site is designed to behave like an unlisted publication:
1. Every HTML `<head>` contains `<meta name="robots" content="noindex, nofollow">`.
2. `robots.txt` at the root disallows all search engine bots:
   ```txt
   User-agent: *
   Disallow: /
   ```

---

## Accessibility & Performance Features

- **Semantic HTML5**: Native `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<footer>`.
- **Keyboard Navigation**: `:focus-visible` ring on all interactive elements.
- **Skip Link**: Allows keyboard and screen reader users to jump straight to `#main-content`.
- **Labels & Forms**: Inputs include programmatic label associations, autocomplete attributes, and `aria-live="polite"` feedback regions.
- **Zero CLS (Cumulative Layout Shift)**: Real images have explicit `width` and `height` dimensions.
- **Zero Framework Overhead**: Under 15 KB of CSS, 2 KB of vanilla JS.
