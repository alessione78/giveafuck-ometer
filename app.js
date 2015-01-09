var express = require('express');
var http = require('http');
var fs = require('fs');
var Twig = require('twig');


var app = express();

app.set('title', 'Give a Fuck o Meter');
app.set('port', '3000');
app.set('views', __dirname + '/app/views');
app.set('view engine', 'twig');

// dynamically include routes (Controller)
fs.readdirSync('./app/controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./app/controllers/' + file);
      route.controller(app);
  }
});

app.get('/', function(req, res){
  res.send('hello world');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
