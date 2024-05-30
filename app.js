console.log(`hello Will McLean`);

//set up express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('process');
require('dotenv').config();
//console.log(process.env);

//AIRTABLE CONFIG
const Airtable = require('airtable');
//I don't understand what this one line below does
const { all } = require('express/lib/application');
const KEY = process.env.PERSONAL_ACCESS_TOKEN;
const BASE_ID = process.env.AIRTABLEBASE;
const base = new Airtable({apiKey: KEY}).base(BASE_ID);

if(base){console.log('Airtable config success')}
console.log(base);

let masterDataSet = undefined;



async function getInterviews(){
    base('interviews').select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {
            console.log('Retrieved', record.get('name'));
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
    

}

getInterviews();




//server
app.listen(port, ()=> console.log(`server listening`));
app.use(express.static('public'));
