const express = require("express");
const path = require("path")
const fs = require("fs");
const cors = require('cors');

const app = express();

app.use(express.static("./app"));
app.use(express.json()); 
app.use(cors());

app.get("/get_saves", (req, res) => {
	fs.readFile(__dirname + '/' + 'saves.json', 'utf8', (err, data) => {
		res.end(data);
	});
});
app.post('/save', function (req, res) {
	
	fs.readFile(__dirname + '/' + 'saves.json', 'utf8', (err, data) => {
		let temp = JSON.parse(data);
		console.log(req.body)
		temp.push(req.body);
		fs.writeFileSync(path.join(__dirname, '/saves.json'), JSON.stringify(temp),(err2,data2)=>{

		});
	});
	
	return res.send("succesfull ");
});

    


app.listen(3000, () => {
	console.log("App started...");
});