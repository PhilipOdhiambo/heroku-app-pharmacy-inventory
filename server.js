const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// Host static files
app.use(express.static('public'));
app.use(express.json());

// Instantiate database connections
const connection = 'mongodb+srv://philip:godcop@philip1-syx4i.mongodb.net';
var database, inventoryColl, receiptColl, issueColl, stock_takeColl;
MongoClient.connect(connection,{useNewUrlParser: true, useUnifiedTopology: true}, (err,client) =>{
  if (err) throw err;
  database = client.db('bincard');
  inventoryColl = database.collection('inventory');
  receiptColl = database.collection('receipt');
  issueColl = database.collection('issue');
  stock_takeColl = database.collection('stock_take');
  console.log(`Connected to database..`);
});

//                   CRUD OPERATIONS               //

// inventory CRUD
// 1) Post a new Item

// 2a) get inventory list
app.get('/list/:item', (req, res) =>{
  var regex = new RegExp(req.params.item,'i');
  inventoryColl.find({Item_Name: regex}).toArray().then(response =>{
    res.json(response);
    });
});
// 2b) get inventory
app.get('/inventory', (req, res) => {
  inventoryColl.find().toArray().then(response => {
    res.json(response);
  });
});

// recipt CRUD
// 1) create receipt
app.post('/receipt', (req, res) => {
  receiptColl.insertMany(req.body);
  res.send('items posted..');
});
// 2a) read receipt
app.get('/receipt', (req, res) => {
  receiptColl.find().toArray().then(response => {
    res.json(response);
  });
});
// 2b) read receipt
app.get('/receipt/:Item_Code', (req, res) => {
  receiptColl.find({Item_Code: req.params.Item_Code}).toArray().then(response => {
    res.json(response);
  });
});
// 2c) read receipt aggregate
app.get('/receiptAggr', (req, res) => {
  receiptColl.aggregate([
    {$match: {}},
    {$group: {_id: "$Item_Code", Total: {$sum :"$Receipt_Qty"} }}
  ]).toArray().then(re => {
    res.json(re);
  });
});

// issue CRUD
// 1) create issue
app.post('/issue', (req, res) => {
  console.log(req.body)
  issueColl.insertMany(req.body);
  res.send('receive');
});

// 2a) read issue
app.get('/issue', (req, res) => {
  issueColl.find().toArray().then(response => {
    res.json(response);
  });
});
// 2b) read issue
app.get('/issue/:Item_Code', (req, res) => {
  issueColl.find({Item_Code: req.params.Item_Code}).toArray().then(response => {
    res.json(response);
  });
});
// 2c) read issue aggregate
app.get('/issueAggr', (req, res) => {
  issueColl.aggregate([
    {$match: {}},
    {$group: {_id: "$Item_Code", Total: {$sum :"$Issue_Qty"} }}
  ]).toArray().then(re => {
    res.json(re);
  });
});

// Fire Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
