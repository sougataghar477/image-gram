 
const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.DB_URL);
client.connect();
let db = client.db("plantgram");
module.exports = db;