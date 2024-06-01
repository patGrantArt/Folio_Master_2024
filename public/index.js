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

function publishSummary(object){
    console.log(`publishing summary`);
    console.log(object);
    document.body.appendChild(header("INTERVIEWS TABLE"))
    document.body.appendChild(container("interviewBox"))
    object.interviews.forEach(element => {
        console.log(element.id);
        document.getElementById("interviewBox").appendChild(record(element.id+" -- "+element.name));
    });
    document.body.appendChild(header("STORIES TABLE"));
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
    return elem
}
function record(string){
    let elem = document.createElement('div');
    elem.class = "record";
    elem.innerText = string;
    elem.style.height = "25px";
    elem.style.cursor = "pointer";
    elem.style.margin = "5px";
    elem.style.padding = "5px";
    elem.style.borderRadius = "3px";
    elem.style.backgroundColor = "white";
    return elem
}


//function calls
init();