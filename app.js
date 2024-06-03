console.log(`hello Will McLean`);

//globals
let summaryJSON;

//list of table ID strings
// const tableIDLookup = {
//     stories: "",
//     interviews: 

// } 

//modules setup
const express = require('express');
const app = express();
const fs = require('fs');
require('process');
require('dotenv').config();
const Airtable = require('airtable');

//custom library if we need it
const folio = require('./folioLib.js');

//set up ports and env
const port = process.env.PORT || 3000;

//file paths
const homeDirectory = process.cwd();
const summaryFP = homeDirectory+"/public/summary.json";


//AIRTABLE CONFIG
const { all } = require('express/lib/application');
const { folioLib } = require('./folioLib');
const send = require('send');
const KEY = process.env.PERSONAL_ACCESS_TOKEN;
const BASE_ID = process.env.AIRTABLEBASE;
const base = new Airtable({apiKey: KEY}).base(BASE_ID);
if(base){console.log('Airtable config success')};





async function goGetFromAirtable(){
    console.log(`getting DATA from airtable`)
    // pull data from the long form cards page
    const InterviewData = await base('tblaleFNcp2WdGoUc')
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    })
    // Pull data from the entities sheet
    const storiesData = await base("tbl54wO3og2TZbNJg")
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
    // Pull data from the long form page
    const entitiesData = await base('tblbODiVlwuGsxuJB')
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
    //pull data from the publications page
    const publicationData = await base('tblCpJYu0zyixee7m')
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });

    //assemble the data into a coherent object
    let result = new Object;
    result.timeStamp = `last update from Airtable made at ${new Date}`;
    result.interviews = InterviewData;
    result.stories = storiesData;
    result.entities = entitiesData;
    result.publications = publicationData;
    return result;
}


function sortData(md){
    console.log(`sorting data`);
    let result = new Object;
    result.timeStamp = md.timeStamp; 

    //sort interview
    result.interviews = [];
    interviewArray = md.interviews;
    interviewArray.forEach(element => {
        let thisEntry = new Object;
        thisEntry.id = element.fields.id;
        thisEntry.airtableID = element.id;
        thisEntry.name = element.fields.name;
        result.interviews.push(thisEntry);
    });
    //sort story info
    result.stories = [];
    md.stories.forEach(element => {
        let thisEntry = new Object;
        thisEntry.id = element.fields.id;
        thisEntry.airtableID = element.id;
        thisEntry.name = element.fields.title;
        result.stories.push(thisEntry);
    });

    //sort entity info
    result.entities = [];
    md.entities.forEach(element => {
        let thisEntry = new Object;
        thisEntry.id = element.fields.id;
        thisEntry.airtableID = element.id;
        thisEntry.name = element.fields.name;
        result.entities.push(thisEntry);
    });

    //sort publications info
    result.publications = [];
    md.publications.forEach(element => {
        let thisEntry = new Object;
        thisEntry.id = element.fields.id;
        thisEntry.airtableID = element.id;
        thisEntry.title = element.fields.title;
        thisEntry.author = element.fields.author;
        result.publications.push(thisEntry);
    });
    console.log(`returning sorted data object`)
    return result    
}




async function refreshFromAirtable(){
    console.log(`===== making data request to airtable `)
    masterDataSet = await goGetFromAirtable();
    console.log(`====== SUCCESS - sorting data`);
    sortedDataSet = await sortData(masterDataSet);
    //console.log(sortedDataSet)
    console.log(`====== SUCCESS - handling datastream`)
    summaryJSON = await JSON.stringify(sortedDataSet);
    console.log(`====== SUCCESS - saving to local file`)

    fs.writeFile(summaryFP, summaryJSON, function(err) {
    if (err) {
	    console.error(err);
        return err
    }});
    console.log(`====== Up to Date Data Pulled and saved`)
    // return masterDataSet.timeStamp;
};



//function calls
refreshFromAirtable()


//server
app.listen(port, ()=> console.log(`server listening`));
app.use(express.static('public'));

//requests
app.get('/summary', (req, res) => {
    console.log(`summary data request made`);
    res.sendFile(summaryFP, function (err) {
        if (err) {
            console.log(err);            
        } else {
            console.log('==== success: Data Sent');
        }
    });
});




app.get('/record/:id', (req, res) => {
    console.log('pulling record', req.params);

    base('stories').find(req.params.id, function(err, record) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('record retrieved from airtable:', record.fields.id);
        let json = JSON.stringify(record);
        console.log('sending json');
        res.send(json);
    });
});



