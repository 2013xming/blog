var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/webNote',{user:'****',pass:'*****'});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
