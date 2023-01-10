let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.background = "transparent";

let errorMsg=document.createElement("div");
    errorMsg.classList.add("errorMsg");
    errorMsg.innerHTML=`<code>No luck here :( Try again maybe...</code>`;
    //document.body.appendChild(errorMsg);

let items=[];
let flag=0;
let noteIDs=[];

setInterval(deleteNote,100);
setInterval(restoreNotes,100);
setInterval(updateNote,100);
setTimeout(fadeError, 800);

function fadeError() {
    $('.alert-danger').fadeOut('fast');
}

function waitforSave(){
    return new Promise((resolve, reject) => {
        document.addEventListener('click', function(e)
        {
            if(e.target && (e.target.id== 'save' || e.target.className== 'blocker' || e.target.id== 'close' ))
            {
                resolve("save has been clicked or box has been exited");
            }
        });    
    })
}

document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("saveNote").onclick=addNote;
    document.getElementById("search").onclick=searchNotes;
})


document.addEventListener('click', function(e)
{
    if(e.target && (e.target.className== 'blocker' || e.target.id== 'close' )){
        console.log("closing now");
        //works
        document.body.removeChild(div);
    }
});

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector)) {
            return resolve(document.querySelectorAll(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelectorAll(selector)) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function deleteNote(){
    waitForElm("#task").then((elm)=>{
        elm.forEach(function(item){
            item.querySelector(".delete").onclick=function(){
            //server side
            let data = new FormData();
            data.append("noteID", item.querySelector("#noteID").innerHTML);
            fetch("/deleteNote", {
                "method": "DELETE",
                "body": data,
            }).then((response)=>{
                return response.json();
            }).then((response)=>{
                console.log(`Delete status: ${response["status"]}`);
            });
            //client side
            this.classList.add("deleted");
            console.log("closed once");
            this.parentNode.remove();
        }});
    });
}

function searchNotes(){
        let searchString=document.getElementById("i1").value;
        console.log(`inside searchNotes, searchString ${searchString}`);
        waitForElm("#task").then((elm)=>{
             let shown=false;
             elm.forEach(function(item) {
                if (!(item.querySelector(".taskname").textContent.includes(searchString) || item.querySelector("#noteTitle").textContent.includes(searchString))){
                    console.log("string was not found");
                    items.push(item);
                    item.style.display="none";
                }else{
                    shown=true;
                    console.log("string was found");
                }});
            if(!shown){
                document.querySelector(".tasks").appendChild(errorMsg);
            }
        });
        console.log(`items length=${items.length}`);
        //if(!items.length) alert("Couldn't find what you're looking for...");
}

function restoreNotes(){
    if(!document.getElementById("i1").value)
    {
        $(".errorMsg").remove();
        items.forEach((item)=>{item.style.display="block";});
        items=[];
    }
}

function updateNote(){
    waitForElm(".taskname").then((elm)=>{
        elm.forEach(function(e1){
            e1.addEventListener('click',function(){
                console.log("clicked once");
                //let el=e1.querySelector('.taskname');
                div.innerHTML=
                `<div class="blocker"></div>
                <div id="box">
                    <div id="buttonbar">
                        <button id="close" type="button">X</button>
                        <button id="save" type="button" >Save</button>
                    </div>              
                    <div id="textbody" >
                    <textarea name="t1" id="textbox" cols="30" rows="10" placeholder="Type something...">${e1.innerHTML}</textarea>
                    </div>
                </div>`;
                document.body.appendChild(div);
                document.querySelector("#save").onclick=()=>{
                    let newText=document.getElementById("textbox").value;
                    if(newText.length){
                        let noteID=document.querySelector("#noteID").innerHTML;
                        let data = new FormData();
                        data.append("noteID",noteID);
                        data.append("body",newText);
                        fetch("/addNote", {
                            "method": "PUT",
                            "body": data,
                        }).then((response)=>{
                            return response.json();
                        }).then((response)=>{
                            console.log(`Update status: ${response["status"]}, new Body: ${response["noteBody"]} for noteID: ${noteID}`);
                        });     
                        e1.innerHTML = newText;
                        div.classList.add("deleted");
                }
                }
            });
        });
    })
}

function addNote() 
{

    if(document.querySelector('#textadder').value.length == 0)
    {
        alert("At least add something!");
    }
    else
    {
        noteTitle=document.querySelector("#texttitle").value;
        noteBody=document.querySelector("#textadder").value;
        //server side rendering
            let noteID;
            let data = new FormData();
            data.append("title", noteTitle);
            data.append("body",noteBody);
            fetch("/addNote", {
                "method": "POST",
                "body": data,
            }).then((response)=>{
                return response.json();
            }).then((response)=>{
                noteTitle=response["note_title"];
                noteBody=response["note_body"];
                noteID=response["note_id"];
            });
        //client side rendering
        $(".errorMsg").remove();
        if(!noteTitle) document.querySelector("#texttitle").value="Untitled";
        document.querySelector('.tasks').innerHTML += `
            <div id="task">
                <p id="noteTitle">${noteTitle}</p>
                <textarea readonly class="taskname">${noteBody}</textarea>
                <div id="noteID" style="display:none;">${noteID}</div>
                <button class="delete">
                <span class="material-icons md-20" style="font-size:15px;">delete</span>
                </button>
            </div>
        `;
    }
}
//currently creating and destroying the div for window
//create ONCE then toggle classes

