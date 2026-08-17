@echo off
cd /d "%~dp0"

echo === updating remote URL ===
git remote set-url origin https://github.com/BG5FNH/BG5FNH.github.io.git

echo === untracking .idea (local files stay on disk) ===
git rm -r --cached .idea >nul 2>&1

echo === adding all changes ===
git add -A

echo === checking changes ===
git diff --cached --quiet
if errorlevel 1 (
  echo === committing ===
  git commit -m "Update BG5FNH site"
) else (
  echo Nothing to commit.
)

echo === pushing ===
git push

pause
