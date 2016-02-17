var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/webNote',{user:'yuxi',pass:'yuxi1505'});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));