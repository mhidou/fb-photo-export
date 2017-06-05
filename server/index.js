'use strict';

var app = require('./app');

var PORT = process.env.NODE_ENV === 'production' ? 3000 : 9000;

// We asume that the process is run from project root folder
if (process.env.NODE_ENV === 'production' && !fs.existsSync('./build/')) {
	console.error('You need to build the react app first, run `npm run build` then `npm run serve`')
    process.exit(process.exitCode);
}

app.listen(PORT, function () {
	  console.info('App listening on port ' + PORT);
	  if (process.env.NODE_ENV === 'production') {
		  console.info('Open your browser at http://localhost:' + PORT);
	  }
});
