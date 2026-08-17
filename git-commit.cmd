@echo off
cd /d "%~dp0"

echo === git status ===
git status

echo === adding all files ===
git add -A

echo === committing ===
git commit -m "Resolve merge conflicts and update BG5FNH site"

echo === push ===
git push

pause
