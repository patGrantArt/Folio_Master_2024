console.log(`hello Will McLean`);

//set up express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('process');
require('dotenv').config();
//console.log(process.env);

//airtable config
//const KEY = process.env.PRIVATE_KEY
//const BASE_ID = process.env.AIRTABLEBASE


app.listen(port, ()=> console.log(`server listening`));
app.use(express.static('public'));
