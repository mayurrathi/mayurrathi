const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'blog', 'posts');
const OUTPUT_FILE = path.join(POSTS_DIR, 'posts.json');

// Regex to extract YAML frontmatter
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n/;

function parseFrontmatter(content) {
    const match = content.match(FRONTMATTER_REGEX);
    if (!match) return null;

    const yamlBlock = match[1];
    const data = {};
    const lines = yamlBlock.split('\n');
    
    let currentKey = null;
    let isList = false;

    for (let line of lines) {
        if (!line.trim()) continue;

        // Check if it's a list item
        if (line.trim().startsWith('- ')) {
            if (currentKey && isList) {
                const value = line.replace('-', '').trim().replace(/^['"]|['"]$/g, '');
                data[currentKey].push(value);
            }
            continue;
        }

        // Check for key-value pair
        const separatorIdx = line.indexOf(':');
        if (separatorIdx !== -1) {
            const key = line.substring(0, separatorIdx).trim();
            let value = line.substring(separatorIdx + 1).trim();

            if (!value) {
                // It's the start of a list
                currentKey = key;
                data[key] = [];
                isList = true;
            } else {
                currentKey = null;
                isList = false;
                // Strip quotes
                value = value.replace(/^['"]|['"]$/g, '');
                data[key] = value;
            }
        }
    }
    
    return data;
}

function generatePostsJson() {
    console.log(`Scanning for Markdown files in ${POSTS_DIR}...`);
    
    if (!fs.existsSync(POSTS_DIR)) {
        console.error(`Error: Directory ${POSTS_DIR} does not exist.`);
        process.exit(1);
    }

    const files = fs.readdirSync(POSTS_DIR);
    const posts = [];

    // First load the existing posts.json to retain posts that don't have a markdown file yet
    // or if we want to fallback to existing data
    let existingPosts = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingPosts = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
        } catch (e) {
            console.error('Failed to parse existing posts.json', e);
        }
    }

    // Map existing posts by slug for easy lookup
    const existingPostsMap = new Map(existingPosts.map(p => [p.slug, p]));

    for (const file of files) {
        if (file.endsWith('.md')) {
            const filePath = path.join(POSTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const slug = file.replace('.md', '');
            
            const frontmatter = parseFrontmatter(content);
            
            if (frontmatter) {
                // Found frontmatter, use it
                posts.push({
                    slug: frontmatter.slug || slug,
                    title: frontmatter.title || slug,
                    excerpt: frontmatter.excerpt || "",
                    category: frontmatter.category || "Article",
                    tags: frontmatter.tags || [],
                    date: frontmatter.date || new Date().toISOString().split('T')[0],
                    readTime: frontmatter.readTime || "5 min read",
                    author: frontmatter.author || "Mayur Rathi",
                    cover: frontmatter.cover || ""
                });
            } else {
                // If no frontmatter (like older posts), see if we have it in existing posts.json
                console.log(`No frontmatter found in ${file}, using existing metadata if available.`);
                if (existingPostsMap.has(slug)) {
                    posts.push(existingPostsMap.get(slug));
                } else {
                    // Fallback basic metadata
                    posts.push({
                        slug: slug,
                        title: slug.replace(/-/g, ' '),
                        excerpt: "",
                        category: "Article",
                        tags: [],
                        date: new Date().toISOString().split('T')[0],
                        readTime: "5 min read",
                        author: "Mayur Rathi",
                        cover: ""
                    });
                }
            }
        }
    }

    // Sort descending by date
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 4));
    console.log(`Successfully generated ${OUTPUT_FILE} with ${posts.length} posts.`);
}

generatePostsJson();
