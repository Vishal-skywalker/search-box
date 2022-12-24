// const http = require('http');
const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const cors = require('cors');
// const page = require('D:/SearchBox/index.html');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
// res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// res.setHeader('Access-Control-Allow-Credentials', true);
// run().then(d => {
//   res.end(JSON.stringify(d));
// })
//   res.end('OK');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
// app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('D:/SearchBox/index.html');
});

app.get('/cities', function (req, res) {
  console.log(req.query);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if ('q' in req.query) {
    const searchValue = req.query.q;
    if (searchValue) {
      run(searchValue).then(d => {
        res.end(JSON.stringify(d));
      });
    }
    else{
      res.end('Required query parameter missing "q"');
    }
  }
  else{
    res.end('Required query parameter missing "q"');
  }
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})



const uri =
  "mongodb+srv://vishal-mongodb:admin@vishalmongodb.pmys27z.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run(searchValue) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Establish and verify connection
    const db = await client.db("vishalDB");
    // console.log("Connected successfully to server");
    // console.log(db.listCollections());
    const citiesDB = db.collection('cities');
    console.log('----------------------------------------------------');
    // console.log(await citiesDB.find({name : 'Kolkata'}).toArray());
    return await citiesDB.find({ name: new RegExp(searchValue, 'ig') }).toArray();

  } catch (err) {
    console.log('------------------ERROR--------------');
    console.log('Error-------', err);
  } finally {
    // Ensures that the client will close when you finish/error
    console.log('------------------EXIT--------------');
    await client.close();
  }
}