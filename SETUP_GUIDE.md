# Blog Setup Guide

## ✅ What's Been Completed

1. **Quartz Installation** - Blog framework is set up
2. **Custom Theme** - Your color scheme (orange, blue, gray, black) is configured
3. **Content Structure** - Posts, pages, assets folders are ready
4. **Sample Content** - Welcome post and About page created
5. **Git Repository** - Initialized and first commit made

## 🚀 Next Steps

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `sammi-blog` (or your preferred name)
3. **Do not** initialize with README, .gitignore, or license
4. Copy the repository URL

### Step 2: Connect to GitHub

```bash
cd ~/Desktop/projects/sammi-blog
git remote add origin https://github.com/YOUR_USERNAME/sammi-blog.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Set Up Vercel Deployment

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your `sammi-blog` GitHub repository
4. Configure build settings:
   - **Build Command**: `npx quartz build`
   - **Output Directory**: `public`
   - **Install Command**: `npm install`
5. Click "Deploy"

Your blog will be live in ~2 minutes!

### Step 4: Set Up Obsidian

1. Open Obsidian
2. Click "Open folder as vault"
3. Select `/Users/sammi/Desktop/projects/sammi-blog`
4. Install the "Obsidian Git" plugin:
   - Settings → Community plugins → Browse
   - Search for "Obsidian Git"
   - Install and enable

### Step 5: Configure Obsidian Git Plugin

1. Open plugin settings for "Obsidian Git"
2. Configure:
   - **Vault backup interval (minutes)**: `5`
   - **Commit message**: `Auto-sync: {{date}}`
   - **Pull updates on startup**: `Enabled`
   - **Auto pull interval (minutes)**: `5`
   - **Auto push**: `Enabled`

### Step 6: Update Configuration

Edit `quartz.config.ts` and update:
```typescript
baseUrl: "your-blog.vercel.app", // Your actual Vercel URL
```

Edit `quartz.layout.ts` and update social links in the footer.

## 📝 Writing Your First Post

1. Open Obsidian (vault at `~/Desktop/projects/sammi-blog`)
2. Go to `content/posts/`
3. Create a new file: `YYYY-MM-DD-your-post-title.md`
4. Use this template:

```markdown
---
title: "Your Post Title"
date: 2024-11-06
tags: ["tag1", "tag2"]
categories: ["Category Name"]
draft: false
description: "Brief description for SEO"
---

# Your Post Title

Your content here...
```

5. Save the file
6. Obsidian Git will auto-commit in 5 minutes
7. Your live site will update automatically!

## 🎨 Customization

### Changing Colors

Edit `quartz.config.ts` in the `theme.colors` section.

### Adding Social Links

Edit `quartz.layout.ts` in the `footer` component.

### Customizing Layout

Edit `quartz.layout.ts` to add/remove components from sidebar and content areas.

## 🔄 CRUD Workflow

### Create
- Create new `.md` file in `content/posts/`
- Auto-syncs to GitHub → Vercel builds → Live

### Update
- Edit any `.md` file
- Auto-syncs to GitHub → Vercel builds → Live

### Delete
- Delete `.md` file
- Auto-syncs to GitHub → Vercel builds → Live

## 🧪 Local Testing

```bash
# Start development server
npx quartz build --serve

# Open browser to http://localhost:8080
```

## 📚 Useful Commands

```bash
# Build site
npx quartz build

# Build and serve locally
npx quartz build --serve

# Check git status
git status

# Manual commit
git add .
git commit -m "Your message"
git push
```

## 🐛 Troubleshooting

### Build Fails
- Check for invalid frontmatter in posts
- Ensure all required fields are present
- Look at Vercel build logs for details

### Posts Not Showing
- Check `draft: false` in frontmatter
- Ensure file is in `content/posts/` directory
- Verify git push completed successfully

### Images Not Loading
- Place images in `content/assets/images/`
- Reference as `![alt text](../assets/images/filename.png)`
- Rebuild site after adding images

## 📖 Resources

- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Obsidian Help](https://help.obsidian.md/)
- [Vercel Documentation](https://vercel.com/docs)

## 🎉 You're All Set!

Your blog is ready to go. Just complete the GitHub and Vercel setup, and you'll have a fully automated blogging workflow!
