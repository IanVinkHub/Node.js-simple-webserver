//require api's
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// maps file extention to MIME types
const mimeType = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
	'.doc': 'application/msword',
	'.eot': 'appliaction/vnd.ms-fontobject',
	'.ttf': 'aplication/font-sfnt'
};


//Set temp args
console.log('Arguments');
let portTemp = 80;
let siteDirTemp = __dirname + '/site/';
let dirListTemp = 'false';
let startPageTemp = [ 'index.html' ];

//Loops to check for arguments
for(var i = 0; i < process.argv.length; i++) {
	switch(process.argv[i].toLowerCase()) {
		//Edit port
		case '-port':
			console.log(i + ': ' + process.argv[i++] + ' ' + process.argv[i]);
			portTemp = process.argv[i];
			break;
		//Edit site files path
		case '-path':
			console.log(i + ': ' + process.argv[i++] + ' ' + process.argv[i]);
			siteDirTemp = process.argv[i];
			break;
		//Edit site files path relative
		case '-rpath':
			console.log(i + ': ' + process.argv[i++] + ' ' + process.argv[i]);
			siteDirTemp = __dirname + process.argv[i];
			break;
		//Edit if you want to show the dirlist if its a directory
		case '-dirlist':
			console.log(i + ': ' + process.argv[i++] + ' ' + process.argv[i]);
			dirListTemp = process.argv[i];
			break;
		//Edit the array of startpages
		case '-startpage':
			startPageTemp = [];
			let logstartPage = i + ': ' + process.argv[i++] + ' ' + process.argv[i];
			//Loop trough all items
			for(var x = 0; x < parseInt(process.argv[i]); x++) {
				startPageTemp.push(process.argv[i + x + 1]);
				logstartPage += ' ' + process.argv[i + x + 1];
			}
			//Adds amount to i and prints the log
			i += parseInt(process.argv[i]);
			console.log(logstartPage);
			break;
		default:
			console.log(i + ': ' + process.argv[i]);
	}
}

//Binds arguments
console.log('\nBinding Arguments');
const port = portTemp;
const siteDir = siteDirTemp;
const dirList = dirListTemp
const startPage = startPageTemp
console.log('Arguments bind');

//Creates website dir if not exists
fs.open(siteDir, 'r', (err,fd) => {
	if(err) {
		console.log('\nCreating website dir')
		fs.mkdirSync(siteDir)
	}
});

console.log('\nStarting Server\n------------------------------');

//------------REQUEST HANDLER------------
const requestHandler = (request, response) => { 
	//Logs request
	console.log('Request url: ' + request.url);

	var pathname = siteDir + url.parse(request.url).pathname;
	console.log('PATHNAME: '  + pathname);

	//tries opening file/dir as read only
	fs.open(pathname, 'r', (err, fd) => {
		//Check for errors
		if(err) {
			console.log('Error: ' + err)
			response.statusCode = 404;
			response.end('Error 404, File does not exist: ' + err);
		} else {
			//If no error check if it is a directory
			if( fs.statSync(pathname).isDirectory() ) {
				//Set startpageLoaded false for dirlist
				let startpageLoaded = false;
				//Check if startpage set
				if(startPage.length > 0) {
					//Loop through all the startpages
					for(var pages = 0; pages < startPage.length; pages++) {
						let tempPathName = path.normalize(pathname + '/' + startPage[pages]);
						try {
							//check if checking file is a file
							if( fs.statSync(tempPathName).isFile() ){
								pages = startPage.length;
								startpageLoaded = true;
								fs.readFile(tempPathName, (err, data) => {
									//Check for errors
									if(err) {
										response.statusCode = 500;
										response.end('Error getting the file: ' + err);
									//If no errors serve file with correct mimetype if found
									} else {
										let ext = path.parse(tempPathName).ext;
										response.setHeader('content-type', mimeType[ext] || 'text/plain');
										response.end(data);
									}
								});
							}
						}catch(err){
							//Print error if it is not exists error
							if(err.code != 'ENOENT') {
								console.log("Error: ", err);
							}
						}
					}
				}
				//Check if startpageLoaded false and dirlist enabled
				if (startpageLoaded == false && dirList == 'true') {
					//Create dirlist
					let html = '<html><body>'
					//Add all elements
					fs.readdirSync(pathname).forEach( File => {
						if( fs.statSync(pathname+'/'+File).isDirectory() ){
							html += '<br><a href="'+File+'/">'+File+'</a>';
						} else {
							html += '<br><a href="'+File+'">'+File+'</a>';
						}
					})
					html += '</body></html>'
					response.end(html);
				} else if(startpageLoaded == false){
					response.statusCode = 404;
					response.end('Error 404, File does not exist: ' + err);
				}
			//If no directory check if it is a file
			} else if( fs.statSync(pathname).isFile() ){
				//Readfile
				fs.readFile(pathname, (err, data) => {
					//Check for errors
					if(err) {
						response.statusCode = 500;
						response.end('Error getting the file: ' + err);
					//If no errors serve file with correct mimetype if found
					} else {
						let ext = path.parse(pathname).ext;
						response.setHeader('content-type', mimeType[ext] || 'text/plain');
						response.end(data);
					}
				});
			}
		}
	});
}
//-----------REQUEST HANDLER END-----------


//Create server
const server = http.createServer(requestHandler)

//Let the server listen
server.listen(parseInt(port), (err) => {  
	//Check if there is a error
	if (err) {
		console.log('Error: ', err);
		return;
	}

	console.log('Server is listening on ' + port);
});
