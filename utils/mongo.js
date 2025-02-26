 
const {MongoClient} = require('mongodb');
const client = new MongoClient("mongodb+srv://sougataghar47:sitonmeloba69@cluster0.fllgfxo.mongodb.net/plantgram?retryWrites=true&w=majority&appName=Cluster0");
client.connect();
let db = client.db("plantgram");
module.exports = db;