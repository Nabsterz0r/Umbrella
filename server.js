const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { Url } = require('./db');

const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}

function addHeaders (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
}

app.use(ignoreFavicon);
app.use(addHeaders);
app.use(express.json())

app.use('/public', express.static(__dirname + '/public'))
app.use('/node_modules', express.static(__dirname + '/node_modules'))

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/api/getShortUrl', urlencodedParser, function(req, res) {
	if (!req.body) return res.sendStatus(400)
	let desireUrl = req.body.desireUrl;
	let newUrl = req.body.url;

	request
	  .get(newUrl)
	  .on('response', function(response) {
	  	console.log(response.statusCode)
	  	if (response.statusCode >= 200 && response.statusCode <=299) {

	  		if (desireUrl) {
				Url.findOrCreate({
					where: {shortUrl: desireUrl},
					defaults: {url: newUrl,
								shortUrl: desireUrl}
					})
					.then( result => {
						let url = result[0]
						let created = result[1]
						if (created) {
							console.log(desireUrl + 'This short url was successfully created')
							res.json({url: desireUrl})
						} else {
							console.log('This short url already in use :(')
							res.json({error: 'This short url already in use :('})
						}
					})
					.catch( err => console.log(err) )
				} else {
					let shortUrl = Math.random().toString(36).substring(2, 15);
					Url.create({
						url: newUrl,
						shortUrl: shortUrl,
					}).then( url => res.json( {url: url.shortUrl} ))
				}

	  	}
	  })
	  .on('error', function(err) {
	  	console.log('ERROR!', err)
	    return res.json({error: 'This url is not valid'})
	  })
});

app.get('/:shortUrl', function(req, res) {
	Url.findOne({
		where: { shortUrl: req.params.shortUrl },
		attributes: ['id', 'url', 'shortUrl']
	})
	.then(url => res.render('redirect', {url: url.url}) )
	.catch( err => res.json({error: 'This short url not in base :('}));
});

app.listen(3005);