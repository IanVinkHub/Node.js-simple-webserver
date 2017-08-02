@ECHO OFF
color 0e
title node JS script
echo Starting
echo ------------------------------
color 0a
node webserver.js -port 80 -rpath /siteFiles -dirList true -startpage 2 index.html index.htm
color 08
echo ------------------------------
pause
