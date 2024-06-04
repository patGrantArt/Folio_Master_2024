//Folio Module for custom Scripts

//CALL FUNCTIONS using the syntax "folio.function(arg)"
//ACCESS OBJECTS using the syntax "folio.object.key" or "folio.object[KeyAsVar]"

//TABLE ID - this is a list for finding the airtable native table ID to avoid using 
//the table names like "stories" etc which are unstable. People can change those in 
//airtable but the ID's can not be changes

//MAKE SUMMARY - This function accepts "Master Data" object and strips out all of 
//the fields except for the unique id's and one identifying string such as "name" 
//or "title". This new is the global Var "summary" which is then served to the client


module.exports = {
    //list of table ID strings
    tableID : {
        stories: "tbl54wO3og2TZbNJg",
        interviews: "tblaleFNcp2WdGoUc",
        images: "tblYdnlOVBWdTk4MY",
        entities: "tblbODiVlwuGsxuJB",
        publications: "tblCpJYu0zyixee7m",
        places: "tbl7ulPNJbEO1fulZ",
        themes: "tbl2TwOfFcqo7rkvo"
    },
    //sortData recieves a "master Data" object and organises into a summary
    makeSummary: function(md){
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
        //sort publications info
        result.images = [];
        md.images.forEach(element => {
            //console.log(element);
            let thisEntry = new Object;
            thisEntry.id = element.fields.imageID;
            thisEntry.airtableID = element.id;
            //thisEntry.imageFile = element.fields.file
            result.images.push(thisEntry);
        });
        result.themes = [];
        md.themes.forEach(element => {
            //console.log(element);
            let thisEntry = new Object;
            thisEntry.id = element.fields.theme;
            thisEntry.airtableID = element.id;
            result.themes.push(thisEntry);
        });
        result.places = [];
        md.places.forEach(element => {
            //console.log(element);
            let thisEntry = new Object;
            thisEntry.id = element.fields.id;
            thisEntry.airtableID = element.id;
            thisEntry.place = element.fields.place;
            result.places.push(thisEntry);
        });
        console.log(`returning sorted data object`)
        return result    
    } 
}



