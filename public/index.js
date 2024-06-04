console.log("What up, Will!?!");

let summary;


async function init(){
    console.log('initialising');
    document.body.appendChild(recordContainer());
    summary = await getData("summary")
}

async function getData(instruction){
    console.log(`==== getData() is called with "${instruction}" argument`)
    let route = "/"+instruction;
    myResponse = await fetch(route);
    data = await myResponse.json();
    console.log(`SUCCESS!`)
    publishSummary(data); 
};

async function getRecord(idString, typeString){
    console.log(`==== going to airtable to get the record: "${idString} with the type ${typeString}" ===== `);
    document.getElementById("recordContainer").style.visibility = "visible";
    document.getElementById('recordContentContainer').innerText = "";
    let route = `/record/${idString}/${typeString}`;
    let myResponse = await fetch(route);
    //console.log(myResponse)
    let jsonData = await myResponse;
    let recordObj = await jsonData.json();
    console.log("SUCCESS!");
    publishSingleRecord(recordObj);
}


function publishSingleRecord(object){   
    let rc = document.getElementById("recordContentContainer");
    //console.log(object);
    for(const key in object.fields){
        rc.appendChild(line(`---- KEY: ${key} -----------------------------`));
        rc.appendChild(line(object.fields[key]));
    }
}

function publishSummary(object){
    console.log(`publishing summary`);
    //console.log(object);
    document.body.appendChild(header("INTERVIEWS TABLE"))
    document.body.appendChild(container("interviewBox", 'interviews'))
    object.interviews.forEach(element => {
        document.getElementById("interviewBox").appendChild(record(element.id+" -- "+element.name, element.airtableID));
    });

    document.body.appendChild(header("STORIES TABLE"));
    document.body.appendChild(container("storyBox", 'stories'));
    object.stories.forEach(element => {
        document.getElementById("storyBox").appendChild(record(element.id+" -- "+element.name, element.airtableID));
    });

    document.body.appendChild(header("IMAGES TABLE"));
    document.body.appendChild(container("imageBox", 'images'));
    object.images.forEach(element => {
        document.getElementById("imageBox").appendChild(record(element.id, element.airtableID));
    });


    document.body.appendChild(header("ENTITIES TABLE"));
    document.body.appendChild(container("entitiesBox", 'entities'))
    object.entities.forEach(element => {
        document.getElementById("entitiesBox").appendChild(record(element.id+" -- "+element.name, element.airtableID));
    });

    document.body.appendChild(header("PUBLICATIONS TABLE"));
    document.body.appendChild(container("publicationsBox", 'publications'))
    object.publications.forEach(element => {
        document.getElementById("publicationsBox").appendChild(record(element.id+" -- "+element.title+" by "+element.author, element.airtableID));
    });
    document.body.appendChild(header("PLACES TABLE"));
    document.body.appendChild(container("placeBox", 'places'));
    object.places.forEach(element => {
        document.getElementById("placeBox").appendChild(record(element.id+" -- "+element.place, element.airtableID));
    });
    document.body.appendChild(header("THEMES TABLE"));
    document.body.appendChild(container("themeBox", 'themes'));
    object.themes.forEach(element => {
        document.getElementById("themeBox").appendChild(record(element.id, element.airtableID));
    });
    

}


//HTML ELEMENT GENERATION
function header(string){
    let elem = document.createElement('h1');
    elem.class = "heading"
    elem.innerText = string;
    return elem
}
function container(string, type){
    let elem = document.createElement('div');
    elem.id = string;
    elem.dataset.type = type;
    elem.style.backgroundColor = "grey";
    elem.style.display = "flex";
    elem.style.width = "1200px";
    elem.style.display = "grid";
    elem.style.gridTemplateColumns = "repeat(8, 120px)";
    elem.style.justifyContent = "center";
    return elem
}
function recordContainer(){
    let elem = document.createElement('div');
    elem.id = "recordContainer";
    elem.style.backgroundColor = "yellow";
    elem.style.position = "fixed";
    elem.style.width = "70vw";
    elem.style.top = "100px";
    elem.style.left = "15vw";
    elem.style.padding = "50px";
    elem.style.visibility = "hidden";
    elem.innerText = "Wait a moment for the server to respond";
    let closeButton = document.createElement("button")
    closeButton.innerText = "close";
    closeButton.addEventListener('click', closeRecord);
    elem.appendChild(closeButton);
    let rcc = document.createElement('div');
    rcc.id = "recordContentContainer"
    elem.appendChild(rcc);
    return elem;
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
function line(string){
    let elem = document.createElement("p");
    elem.innerText = string;
    return elem;
}

//EVENT HANDLING
function recordClick(e){
    let requestID = e.target.dataset.airtableID
    let requestType = e.target.parentElement.dataset.type;
    getRecord(requestID, requestType);
}
function closeRecord(){
    console.log(`closing record`);
    document.getElementById('recordContainer').style.visibility = "hidden";

}

//function calls
init();