console.log("What up, Will!?!");

let summary;


async function init(){
    console.log('initialising');
    summary = await getData("summary")
}

async function getData(instruction){
    console.log(`==== getData() is called with "${instruction}" argument`)
    let route = "/"+instruction;
    myResponse = await fetch(route);
    //console.log(myResponse)
    data = await myResponse.json();
    publishSummary(data); 
};

async function getRecord(string){
    console.log(`==== going to airtable to get the record: "${string}" ===== `);
    let route = "/record/"+string;
    let myResponse = await fetch(route);
    console.log(myResponse)
    let recordData = await myResponse.json();
    console.log("SUCCESS!");
    console.log(recordData);
}

function publishSummary(object){
    console.log(`publishing summary`);
    console.log(object);
    document.body.appendChild(header("INTERVIEWS TABLE"))
    document.body.appendChild(container("interviewBox"))
    object.interviews.forEach(element => {
        console.log(element.id);
        document.getElementById("interviewBox").appendChild(record(element.id+" -- "+element.name, element.airtableID));
    });

    document.body.appendChild(header("STORIES TABLE"));
    document.body.appendChild(container("storyBox"))
    object.stories.forEach(element => {
        console.log(element.id);
        document.getElementById("storyBox").appendChild(record(element.id+" -- "+element.name, element.airtableID));
    });

    document.body.appendChild(header("ENTITIES TABLE"));
    document.body.appendChild(container("entitiesBox"))
    console.log(object.entities);
    object.entities.forEach(element => {
        console.log(element.id);
        document.getElementById("entitiesBox").appendChild(record(element.id+" -- "+element.name, element.airtableID));
    });

    document.body.appendChild(header("PUBLICATIONS TABLE"));
    document.body.appendChild(container("publicationsBox"))
    console.log(object.publications);
    object.publications.forEach(element => {
        console.log(element.id);
        document.getElementById("publicationsBox").appendChild(record(element.id+" -- "+element.title+" by "+element.author, element.airtableID));
    });

}


//html element generators
function header(string){
    let elem = document.createElement('h1');
    elem.class = "heading"
    elem.innerText = string;
    return elem
}
function container(string){
    let elem = document.createElement('div');
    elem.id = string;
    elem.style.backgroundColor = "grey";
    elem.style.display = "flex";
    elem.style.width = "1200px";
    elem.style.display = "grid";
    elem.style.gridTemplateColumns = "repeat(8, 120px)";
    elem.style.justifyContent = "center";
    return elem
}
function record(label, airtableID){
    let elem = document.createElement('div');
    elem.class = "record";
    elem.dataset.airtableID = airtableID;
    elem.innerText = label;
    elem.style.height = "40px";
    elem.style.cursor = "pointer";
    elem.style.margin = "5px";
    elem.style.padding = "5px";
    elem.style.borderRadius = "3px";
    elem.style.backgroundColor = "white";
    elem.addEventListener("click", recordClick)
    return elem
}
function recordClick(e){
    console.log(e.target.innerText);
    console.log(e.target.dataset.airtableID)
    getRecord(e.target.dataset.airtableID)
}


//function calls
init();