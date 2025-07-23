# How to Find Replit Terminal (Shell)

## Finding the Terminal

**Look for the "Shell" tab:**
- On the right side of your Replit screen
- It's usually next to "Console" 
- Click on "Shell" to open the terminal

**If you don't see Shell tab:**
- Look for a `>_` icon (terminal symbol)
- Or press `Ctrl + Shift + S` (keyboard shortcut)
- Or click the "+" button to add a new Shell tab

## Running the Git Commands

Once you have the Shell open, copy and paste these commands one by one:

```bash
git add .
```
Press Enter, wait for it to complete, then:

```bash
git commit -m "Android podcast app with GitHub Actions build"
```
Press Enter, wait for it to complete, then:

```bash
git branch -M main
```
Press Enter, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```
(Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details)

Press Enter, then finally:

```bash
git push -u origin main
```

## What You'll See

- The Shell will show progress as files upload
- You might be asked for GitHub username/password
- Once complete, your project will be on GitHub
- GitHub Actions will automatically start building your APK

That's it! The Shell is just Replit's name for the terminal.