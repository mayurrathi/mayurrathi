/* ════════════════════════════════════════════════════
   Blog Listing — JavaScript
   Fuse.js search, category filtering, dynamic grid
   ════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Particle Background (lighter version for blog) ──
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.2 + 0.05;
                this.hue = 165 + Math.random() * 30;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
                ctx.fill();
            }
        }

        resizeCanvas();
        const count = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
        window.addEventListener('resize', resizeCanvas);
    }

    // ── State ──
    let allPosts = [];
    let fuse = null;
    let activeCategory = 'all';

    // ── Load Posts ──
    async function loadPosts() {
        try {
            allPosts = await window.fetchAllBlogPosts('');

            // Initialize Fuse.js search
            fuse = new Fuse(allPosts, {
                keys: [
                    { name: 'title', weight: 3 },
                    { name: 'excerpt', weight: 2 },
                    { name: 'tags', weight: 1 },
                    { name: 'category', weight: 1 }
                ],
                threshold: 0.4,
                includeScore: true,
                ignoreLocation: true
            });

            // Build category filters
            buildCategoryFilters();

            // Render posts
            renderPosts(allPosts);

        } catch (err) {
            document.getElementById('blog-grid').innerHTML = '<p style="color:var(--text-secondary);">Failed to load posts.</p>';
        }
    }

    // ── Build Category Filters ──
    function buildCategoryFilters() {
        const categories = [...new Set(allPosts.map(p => p.category))];
        const container = document.getElementById('category-filters');
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.category = cat;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                activeCategory = cat;
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilters();
            });
            container.appendChild(btn);
        });

        // "All" button handler
        document.querySelector('.filter-btn[data-category="all"]').addEventListener('click', () => {
            activeCategory = 'all';
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
            applyFilters();
        });
    }

    // ── Render Posts ──
    function renderPosts(posts) {
        const grid = document.getElementById('blog-grid');
        const noResults = document.getElementById('no-results');

        if (posts.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        grid.innerHTML = posts.map(post => {
            const coverHtml = post.cover
                ? `<img src="${post.cover}" alt="${post.title}" class="blog-card-cover" loading="lazy" />`
                : '';

            const link = post.isExternal ? post.slug : `post.html?slug=${post.slug}`;
            const target = post.isExternal ? 'target="_blank" rel="noopener"' : '';

            return `
        <a href="${link}" ${target} class="blog-card">
          ${coverHtml}
          <span class="blog-card-category">${post.category}</span>
          <h2>${post.title}</h2>
          <p>${post.excerpt}</p>
          <div class="blog-card-tags">
            ${post.tags.map(t => `<span class="blog-card-tag">#${t}</span>`).join('')}
          </div>
          <div class="blog-card-footer">
            <span class="material-symbols-outlined">calendar_today</span>
            ${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            <span style="margin-left:auto;">${post.readTime}</span>
          </div>
        </a>
      `;
        }).join('');
    }

    // ── Apply Filters (search + category) ──
    function applyFilters() {
        const query = document.getElementById('search-input').value.trim();
        let results = allPosts;

        // Apply search
        if (query && fuse) {
            results = fuse.search(query).map(r => r.item);
        }

        // Apply category filter
        if (activeCategory !== 'all') {
            results = results.filter(p => p.category === activeCategory);
        }

        renderPosts(results);
    }

    // ── Search Input ──
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(applyFilters, 200);
        });

        // Keyboard shortcut ⌘K or Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            if (e.key === 'Escape') {
                searchInput.blur();
                searchInput.value = '';
                applyFilters();
            }
        });
    }

    // ── Init ──
    loadPosts();

})();
