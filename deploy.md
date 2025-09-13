# 🚀 Deployment Guide for RFP Tracker

## Quick Deploy Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repo
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Option 2: Netlify
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist` folder to deploy
4. Add environment variables in Site Settings

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run `npm run deploy`

## Environment Variables Needed
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Build Command
```bash
npm run build
```

## Output Directory
`dist/`

## Your app will be live at:
- Vercel: `https://your-project-name.vercel.app`
- Netlify: `https://random-name.netlify.app`
- GitHub Pages: `https://yourusername.github.io/your-repo-name`
