@ECHO OFF
color 0e
title node JS script
echo Starting
echo ------------------------------
color 0a
node main.js -port 80 -rpath /siteFiles -dirList true -startpage 2 index.html index.php
color 08
echo ------------------------------
pause