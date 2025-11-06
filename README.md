# Sammi's Blog

A personal blog built with Quartz and Obsidian, deployed on Vercel.

## Tech Stack

- **Quartz v4** - Static site generator optimized for Obsidian
- **Obsidian** - Content creation and management
- **Vercel** - Hosting and deployment
- **Git** - Version control and auto-sync

## Color Scheme

- Light Gray: `#F5F5F5`
- Vibrant Orange: `#FF6B35`
- Deep Blue: `#4A5568`
- Black: `#000000`

## Project Structure

```
sammi-blog/
├── content/
│   ├── posts/          # Blog posts
│   ├── assets/         # Images and media
│   ├── pages/          # Static pages
│   └── templates/      # Post templates
├── quartz/             # Quartz framework
└── public/             # Built site (generated)
```

## Local Development

```bash
# Install dependencies
npm install

# Build and serve locally
npx quartz build --serve

# Build for production
npx quartz build
```

## Writing Workflow

1. Open this directory as an Obsidian vault
2. Create new posts in `content/posts/`
3. Use frontmatter for metadata:
   ```yaml
   ---
   title: "Post Title"
   date: YYYY-MM-DD
   tags: ["tag1", "tag2"]
   categories: ["Category"]
   draft: false
   ---
   ```
4. Save and commit changes
5. Push to GitHub
6. Vercel auto-deploys

## Deployment

This blog is configured to deploy automatically to Vercel when changes are pushed to the main branch.

---

Built with [Quartz v4](https://quartz.jzhao.xyz/)
