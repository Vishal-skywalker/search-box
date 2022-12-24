const data = require('./cities.json');
const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb+srv://vishal-mongodb:admin@vishalmongodb.pmys27z.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Establish and verify connection
    // const db = await client.db("vishalDB");
    const dbAdmin = client.db("vishalDB").admin();
    const dbs = await dbAdmin.listDatabases();
    // console.log(dbs.databases);
    dbs.databases.forEach(async el => {
      if (el.name.includes('sample_')) {
        console.log(el);
        const db = client.db(el.name);
        await db.dropDatabase();
      }
    });
    // // console.log("Connected successfully to server");
    // // console.log(db.listCollections());
    // const citiesDB =  db.collection('cities');
    // console.log('----------------------------------------------------');
    // // console.log(await citiesDB.find({name : 'Kolkata'}).toArray());
    // // return await citiesDB.find({name : 'Kolkata'}).toArray()
    // console.log(typeof data);
    // let cities = data;
    // cities.forEach(el => {
    //     el._id = el.id;
    //     delete el.id;
    // });
    // console.log(cities);
    // await citiesDB.insertMany(cities);
    console.log('Success');
    
  } catch (err) {
    console.log('------------------ERROR--------------');
    console.log('Error-------', err);
  } finally {
    // Ensures that the client will close when you finish/error
    console.log('------------------EXIT--------------');
    // await client.close();
  }
}
run().catch(console.dir);


