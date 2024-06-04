console.log(`hello Will!`);


//DEPENDENCIES
//          - express
//          - fs
//          - env
//          - process
//          - airtable
//          - folioLib (custom)

//ENV Variables can be found in the miro document supplied by Gabe. You will need:
//          - airtable base ID
//          - airtable Personal Access Token

// FUNCTION - REFRESH FROM AIRTABLE 
//          - Calls goGetFromAirtable() and retrieves ALL of the data from the base
//          - sorts the data into a simple summary of records
//          - converts summary ot JSON
//          - saves file to the public folder (path is variable summaryFP)
//          * This is all very slow and could benefit from optimisation

//FUNCTION - GO GET FROM AIRTABLE 
//          - makes seven sequential requests from 7 different tables
//          - sorts all into a single object called master Data Set
//          * again, seven requests and a lot of repeated code, this could be optmised

//ROUTING - GET REQUEST HANDLING
//          - /summary - serves the summaryJSON to the client
//          - /:record/:table - retrieves the relavent "record" from the relavent "table" 
//            on the airtable api and serves it to the client.
//          * These both seem relatively fast


//globals
let summaryJSON;
let masterDataSet;

//modules setup
const express = require('express');
const app = express();
const fs = require('fs');
require('process');
require('dotenv').config();
const Airtable = require('airtable');

//custom library
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


async function refreshFromAirtable(){
    console.log(`===== making request to airtable `)
    masterDataSet = await goGetFromAirtable();
    console.log(`====== SUCCESS - creating a summary`);
    sortedDataSet = await folio.makeSummary(masterDataSet);
    console.log(`====== SUCCESS - preparing datastream`)
    summaryJSON = await JSON.stringify(sortedDataSet);
    console.log(`====== SUCCESS - saving summary to local file`)
    fs.writeFile(summaryFP, summaryJSON, function(err) {
    if (err) {
	    console.error(err);
        return err
    }});
    console.log(`====== SUCCES - summary of Airtable Base Pulled and saved`)
};

//A series of requests from airtable tables. Could use a refactor and optimisation. 
async function goGetFromAirtable(){
    console.log(`getting DATA from airtable`)
    // pull data from the interviews table
    const InterviewData = await base(folio.tableID.interviews)
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    })
    // Pull data from the stories sheet
    const storiesData = await base(folio.tableID.stories)
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
    // Pull data from the entities page
    const entitiesData = await base(folio.tableID.entities)
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
    //pull data from the publications page
    const publicationData = await base(folio.tableID.publications)
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
     //pull data from the images page
    const imagesData = await base(folio.tableID.images)
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
    //pull data from the places table
    const placesData = await base(folio.tableID.places)
    .select({view: "Grid view"})
    .all()
    .then(records => {
        return records
    }).catch(err => {
        console.error(err)
    });
    //pull data from the themes table
    const themesData = await base(folio.tableID.themes)
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
    result.images = imagesData;
    result.places = placesData;
    result.themes = themesData;
    return result;
}

//function calls
refreshFromAirtable()

//server
app.listen(port, ()=> console.log(`server listening`));

//serve up public folder on page load
app.use(express.static('public'));

//request for summary from client
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

//request for record from client
app.get('/record/:id/:type', (req, res) => {
    const recordID = req.params.id
    const table = folio.tableID[req.params.type];
    base(table).find(recordID, function(err, record) {
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





