require('dotenv').config( );
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const ConnectToDb = require('./Db/ConnectToDb');
const MONGODB_URI = process.env.MONGODB_URI;
const app = express ( );

app.use(express.json());
app.use(cors( ));
app.use(routes);
ConnectToDb(MONGODB_URI||"mongodb://localhost:27017/Pdev");

app.listen(3000, ( ) => {
    console.log('server is running');
})