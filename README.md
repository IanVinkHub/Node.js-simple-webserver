# Node.js simple webserver

A web server I created in node.js.

This is one of my first node.js applications so please give me tips and things that can be improved.

## Usage

Running the run.bat file will simply create a webserver on port 80, with the path for the files in /siteFiles. If you go in the directory this will try to acces a index.html or index.htm file in that order.

Run.bat launch line:

    `node webserver.js -port 80 -rpath /siteFiles -dirList true -startpage 2 index.html index.htm`
  
Default launch:

    `node webserver.js`
