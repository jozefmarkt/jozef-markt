@echo off
cd /d "%~dp0"
npx json-server --watch db.json --port 5174 