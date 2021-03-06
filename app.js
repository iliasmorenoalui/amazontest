var http = require('http');
var mongoose = require('mongoose');
var express = require('express');

var app = express();
var db;

var config = {
  "USER": "",
  "PASS": "",
  "HOST": "ec2-52-28-60-229.eu-central-1.compute.amazonaws.com",
  "PORT": "27017",
  "DATABASE" : "test"
};

var standardGreeting = 'Hello World!';

var greetingSchema = mongoose.Schema({ sentence: String });
var Greeting= mongoose.model('Greeting', greetingSchema);

db = mongoose.connect('mongodb://localhost:27017/test');

mongoose.connection.once('open', function() {
  var greeting;
  Greeting.find( function(err, greetings){
    if( !greetings ){
      greeting = new Greeting({ sentence: standardGreeting });
      greeting.save();
    }
  });
});

app.get('/', function(req, res) {
  Greeting.findOne(function (err, greeting) {
    res.send(greeting.sentence);
  });
});

app.use( function(err, req, res, next) {
  if (req.xhr) {
    res.send(500, 'Something went wrong!');
  } else {
    next(err);
  }
});

console.log('starting Express (NodeJS) Web server');
app.listen(8080);
console.log('Webserverlistening on port 8080');
