const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

function fsTest(file) {
	return new Promise(r => fs.access(file, fs.constants.F_OK, e => r(!e)));
}

function fsStat(file) {
	return new Promise(r => fs.stat(file, (e, s) => r(e ? null : s)));
}

http.createServer(async (req, res) => {
	const file = path.join('./res/', req.url).split('\\').join('/');
	if (file[file.length - 1] !== '/' && await fsTest(file)) {
		const head = {
			'Content-Type': mime.getType(file),
		};

		const stat = await fsStat(file);
		if (stat !== null) head['Content-Length'] = stat.size;

		res.writeHead(200, head);
		fs.createReadStream(file).pipe(res);
	} else {
		res.writeHead(404);
		res.end('404');
	}
}).listen(8000);
