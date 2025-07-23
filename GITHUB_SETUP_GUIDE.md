# How to Push Your Project to GitHub

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the green "New" button (or go to github.com/new)
3. Repository name: `podcast-android-app` (or any name you prefer)
4. Make it **Public** (required for free GitHub Actions)
5. **DO NOT** check "Add a README file" - your project already has files
6. Click "Create repository"

## Step 2: Push Your Project

GitHub will show you commands. Use these **exact commands** in your Replit terminal:

### Initialize Git (if not already done):
```bash
git init
git add .
git commit -m "Android podcast app ready for build"
```

### Connect to GitHub and Push:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Replace `YOUR_USERNAME` and `YOUR_REPO_NAME`** with your actual GitHub username and repository name.

## Step 3: Watch the Build

1. Go to your GitHub repository
2. Click the "Actions" tab
3. You should see "Build Android APK" running
4. Wait 5-10 minutes for completion
5. Download your APK from the "Artifacts" section

## Example Commands

If your GitHub username is `john` and repository is `podcast-app`:

```bash
git init
git add .
git commit -m "Android podcast app ready for build"
git branch -M main
git remote add origin https://github.com/john/podcast-app.git
git push -u origin main
```

## Troubleshooting

**If you get authentication errors:**
- Use GitHub's personal access token instead of password
- Or use GitHub Desktop app for easier setup

**If git is not initialized:**
- The `git init` command will set it up

That's it! Once pushed, GitHub Actions will automatically build your APK.