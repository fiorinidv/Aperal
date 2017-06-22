var express     = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

var saveStore;

app.get('/', function(req, res) {
  res.render("index", {store: saveStore});
});

app.get('/saveApp', function(req, res) {
  saveStore = req.query.storeState;
  res.render("index", {store: saveStore});
});

app.get('/game', function(req, res) {
 res.render("index", {store: saveStore});
});

app.get('/end', function(req, res) {
 res.render("index", {store: saveStore});
});




app.listen(80, function () {
  console.log("Server listening on port 80");
});