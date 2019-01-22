const express = require ('express');
const app = express();

const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.listen(8000, () =>{
	console.log('Server started 8000')
});

// insert
app.route('/api/users').post((req,res) => {
	res.status(201).send(req.body);
});

// update
app.route('/api/users/:name').put((req,res) =>{
	res.status(200).send(req.body);
})

// delete
app.route('/api/users/:name').delete((req,res) =>{
	res.status(200).send(req.body);
})