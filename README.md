# Node.js simple webserver

A web server I created in node.js.

This is one of my first node.js applications so please give me tips and things that can be improved.

## Usage

Running the run.bat file will simply create a webserver on port 80, with the path for the files in /siteFiles. If you go in the directory this will try to acces a index.html or index.htm file in that order.

Run.bat launch line:

    node webserver.js -port 80 -rpath /siteFiles -dirList true -startpage 2 index.html index.htm
  
Default launch:

    node webserver.js

Launch options:


    -port [Port number]
--Changes the port it will use


    -path [Path]
--Changes the path where the files to serve are located


    -rpath [Path]
--Changes the path where the files to server are located relatively to where it is launched


    -dirlist [true/false]
--Shows a list of all files in directory if no startpage found.

    -startpage [Number] [Path]*Number
--Searches for a page to look for in order if it is in a directory. The number is the amount of paths you want to look for.

# Example:
    -startpage 4 index.html index.htm main.hmtl main.htm
    
