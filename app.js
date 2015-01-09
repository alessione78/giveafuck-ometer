var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var twig = require('twig');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var microphone = require('microphone');

var app = express();

app.set('title', 'Give a Fuck o Meter');
app.set('port', '3000');
app.set('views', __dirname + '/app/views');
app.set('view engine', 'twig');

app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// dynamically include routes (Controller)
fs.readdirSync('./app/controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./app/controllers/' + file);
      route.controller(app);
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
