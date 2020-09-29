const express = require('express');

const bodyParser = require('body-parser');
const password = 'gkvU6SAKHBvoKY7V';
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://organicUser:gkvU6SAKHBvoKY7V@cluster0.1hh0e.mongodb.net/organicDb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
})

const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
client.connect(err => {
  const productCollection = client.db("organicDb").collection("products");
  
 app.get("/products",(req,res) => {
  productCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents);
  })
 })
  //insert
  app.post("/addProduct",(req,res) =>{
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log("data added successfully");
      res.redirect('/');
    })
  })
  //update
  app.get('/product/:id',(req,res) => {
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents) =>{
      res.send(documents[0]);
    })
    
  })
  app.patch('/update/:id',(req,res) => {
    console.log(req.body.price);
    productCollection.updateOne({_id: ObjectId(req.params.id)},{
      $set:{price: req.body.price,quantity: req.body.quantity},
    })
    .then((result) =>{
      res.send(result.modifiedCount > 0)
    })
  })

//delete
  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })
});


app.listen(3000)