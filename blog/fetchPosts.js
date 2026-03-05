/**
 * Utility to fetch and merge blog posts from Medium RSS and local LinkedIn JSON.
 * Normalizes the schema so it works seamlessly with the existing blog grid and post viewer.
 */

async function fetchAllBlogPosts(basePath = '') {
    const mediumUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@mayurrathi';
    const linkedinUrl = basePath + 'posts/linkedin-posts.json';

    let allPosts = [];

    // 1. Fetch Medium
    try {
        const mediumRes = await fetch(mediumUrl);
        const mediumData = await mediumRes.json();
        if (mediumData.status === 'ok' && mediumData.items) {
            const mediumPosts = mediumData.items.map(item => {
                // Approximate read time based on content length
                const contentText = item.content.replace(/<[^>]+>/g, '');
                const wordCount = contentText.split(/\s+/).length;
                const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

                // Extract first image if exists, else generic cover
                let cover = '';
                const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                    cover = imgMatch[1];
                } else {
                    cover = item.thumbnail;
                }

                // Medium sends categories as array, use first or default
                const category = (item.categories && item.categories.length > 0)
                    ? item.categories[0].charAt(0).toUpperCase() + item.categories[0].slice(1)
                    : 'Tech';

                return {
                    title: item.title,
                    slug: item.link,
                    excerpt: item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
                    date: item.pubDate,
                    category: category,
                    readTime: readTime,
                    tags: item.categories || [],
                    cover: cover,
                    isExternal: true // Flag to open in new tab instead of local post.html
                };
            });
            allPosts = allPosts.concat(mediumPosts);
        }
    } catch (e) {
        console.error("Failed to fetch Medium posts:", e);
    }

    // 2. Fetch LinkedIn (local JSON)
    try {
        const liRes = await fetch(linkedinUrl);
        if (liRes.ok) {
            const liData = await liRes.json();
            const liPosts = liData.map(item => ({
                ...item,
                isExternal: true // LinkedIn posts always go to LinkedIn directly
            }));
            allPosts = allPosts.concat(liPosts);
        }
    } catch (e) {
        console.error("Failed to fetch LinkedIn posts:", e);
    }

    // 3. Sort descending by date
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return allPosts;
}

window.fetchAllBlogPosts = fetchAllBlogPosts;
