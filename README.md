# Mayur Rathi - Personal Portfolio

This repository contains the source code for the personal portfolio website hosted at `mayur.bhopal.dev`. The site is a modern, single-page application (SPA) with an integrated Markdown-based blog.

## Site Structure

The application is built using standard HTML, CSS, and Vanilla JavaScript with a custom-engineered markdown blog parser.

### Core Files
* `index.html`: The main landing page. Contains all the primary sections including Hero, About, Experience, Community, Projects, Publications, In the News, Talks, and Skills.
* `styles.css`: The global stylesheet containing the design system tokens, responsive grid layouts, animations, dark/light mode (`data-theme`), and the new side-panel navigation styles.
* `script.js`: Handles interactivity, including the slide-in side panel menu `side-panel`, scroll-spy for the floating navigation, custom cursor, theme toggling, and intersection observers for scroll animations.
* `sitemap.xml`: XML sitemap for search engine crawlers, linking the homepage and all blog posts.

### Blog System (`/blog`)
The blog system is statically hosted on GitHub Pages but dynamically renders `.md` files in the browser using JavaScript.
* `blog/index.html`: The main blog listing page with topic filters.
* `blog/post.html`: The template page that loads requested blog content based on the `?slug=` URL parameter.
* `blog/blog.css` & `blog/blog.js`: Specific styling and logic for the blog interface.
* `blog/fetchPosts.js`: Global utility logic that parses the JSON post list.
* `blog/posts/`: Directory containing all the actual raw Markdown (`.md`) files.
* `blog/posts/posts.json`: The central registry mapping slugs to metadata (date, title, tags, read time).

## Navigation Architecture

As of the recent overhaul, the site features:
1. **Floating Bottom Nav (`.floating-nav`)**: A context-aware sticky bar containing quick shortcuts to Home, About, Experience, Community, Blog, and Contact.
2. **Slide-In Side Panel (`.side-panel`)**: A glassmorphism menu sliding in from the right, organized into "Navigate", "Content", and "Connect" sections.
3. **Social Icon Rows (`.social-row`)**: Consistent circular icons pointing to external networks (LinkedIn, Twitter, GitHub, etc.) located in the hero section, the side panel, and the footer.

---

## 🚀 Future Implementations Pending

The recent structural overhaul established the framework for several new content areas. The following tasks are pending final implementation:

### 1. Replace Placeholder Content
Three new sections were added to `index.html` with placeholder text and structural cards. You must update these with your real achievements:
- [ ] **Projects Section (`#projects`)**: Update the title, description, and link (`href="#"`) for your side-projects, apps, or tools.
- [ ] **Publications Section (`#publications`)**: Replace the placeholder title, journal names, and dates for your featured articles or papers.
- [ ] **In the News Section (`#news`)**: Update media mentions, outlet names, and feature dates.

### 2. Connect Social Links
- [ ] Verify that all social row links point to the correct handles (currently pointing to generic or guessed handles like `twitter.com/mayurrathi`). This needs to be checked in 3 places (Hero, Side Panel, Footer).

### 3. Dynamic External Blog Integration (Medium/LinkedIn)
- [ ] Currently, the blog system only renders internal Markdown files via `posts.json`. Future enhancements involve implementing a hybrid fetching strategy to pull posts concurrently from a Medium RSS feed and a LinkedIn JSON export into `fetchPosts.js`.

### 4. Blog Assets Optimization
- [ ] Consider adding a GitHub Action to automatically optimize/compress images placed in `blog/images/` and convert them to `.webp` for ideal mobile performance, as recommended during the SEO audit. 

---
_Crafted for high performance, accessibility, and modern aesthetics._
