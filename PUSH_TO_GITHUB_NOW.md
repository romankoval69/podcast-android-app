# Push Your Project to GitHub - Step by Step

## Step 1: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `podcast-android-app` (or any name you like)
3. **Make it Public** (required for free GitHub Actions)
4. **Don't check any boxes** - your project already has files
5. **Click "Create repository"**

## Step 2: Find the Shell in Replit

Look for the **"Shell"** tab:
- Usually on the right side of your screen
- Next to "Console" tab
- Has a `>_` icon
- If you don't see it, press `Ctrl + Shift + S`

## Step 3: Run These Commands in Shell

Copy and paste these commands **one at a time** in the Shell:

```bash
git add .
```
Wait for it to finish, then:

```bash
git commit -m "Android podcast app with GitHub Actions"
```
Wait for it to finish, then:

```bash
git branch -M main
```
Then (replace YOUR_USERNAME and YOUR_REPO_NAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```
Finally:

```bash
git push -u origin main
```

## Step 4: Get Your APK

After pushing:
1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Wait 5-10 minutes for build to complete
4. Click on the completed build
5. Scroll down to **"Artifacts"** section
6. Download your APK file

## Example Commands

If your GitHub username is `alex` and repo is `podcast-app`:

```bash
git add .
git commit -m "Android podcast app with GitHub Actions"
git branch -M main
git remote add origin https://github.com/alex/podcast-app.git
git push -u origin main
```

**Ignore the workflow error** - it's not needed. Your app will build perfectly on GitHub!