const mongoose = require('mongoose');
const mongoUrl = 'mongodb://localhost:27017/hotels'
//set up mongoose connection
mongoose.connect(mongoUrl,{
    useNewUrlParser : true,
    useUnifiedTopology : true
})
const db = mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to mongo db');
})
db.on('error',()=>{
    console.log('Error in connection');
})

db.on('disconnected',()=>{
    console.log('Disconnected from mongo db');
})

module.exports = db;