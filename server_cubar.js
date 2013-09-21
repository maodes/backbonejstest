var express = require('express'),
	app = express();
var db = require('./lib/db');

var contactSchema = mongoose.Schema({
	name : String,
	number : String,
	username : String
})


var db=mongoose.model('contacts', contactSchema);
mongoose.connect('mongodb://localhost/contacts');

db=Model.db.collection('contacts');

var cors= function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
	app.use(express.bodyParser());
	app.use(cors);

});

function addContacts(req, res){
	db.findOne({username : req.username}, function(err, doc){
		if(doc){
			res.end('username exists');
		}
		else{
			db.insert({'name' : req.name, 'number' : req.number, 'username' : req.username}, function(err){
				if(err) console.log(err);
			});
		}

	})
}

function getContacts(req, res){
	db.find(function(err, docs){
		console.log(docs);
		res.send(200, docs);
	})
}

function editContacts(req, res){
	var id = req.params.id;
	db.update({_id : id} , {name : req.name, number : req.number, username: req.username}, function(err){
		if(err) console.log(err);
	})
}

function deleteContacts(req, res){
	var id = req.params.id;
	db.remove({_id : id}, 1, function(err){
		if(err) console.log(err);
	});
}

app.post('/contacts',addContacts);
app.put('/contacts/:id', editContacts);
app.delete('/contacts/:id', deleteContacts);
app.get('/contacts', getContacts)
app.listen(9090, function () {
	console.log('App listening on localhost:9090');
});