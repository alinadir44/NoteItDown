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

setTimeout(function() {
    $('.alert-danger').fadeOut('fast');
}, 1000);

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
let items=[];
let flag=0;
function searchNotes(){
        let searchString=document.getElementById("i1").value;
        console.log(`inside searchNotes, searchString ${searchString}`);
        waitForElm("#task").then((elm)=>{
             let shown=false;
             elm.forEach(function(item) {
                if (!item.querySelector(".taskname").textContent.includes(searchString)){
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

setInterval(function(){
    if(!document.getElementById("i1").value)
    {
        waitForElm(".errorMsg").then((elm)=>{
            document.querySelector(".tasks").removeChild(elm[0]);
        });
        items.forEach((item)=>{item.style.display="block";});
        items=[];
    }
},1);

document.getElementById("add").onclick=f1;
document.getElementById("search").onclick=searchNotes;

function f1() 
{

    if(document.querySelector('#task1 textarea').value.length == 0)
    {
        alert("Please Enter a Task!");
    }
    else
    {
        waitForElm(".errorMsg").then((elm)=>{
            document.querySelector(".tasks").removeChild(elm[0]);
        });
        document.querySelector('.tasks').innerHTML += `
            <div id="task">
                <textarea readonly class="taskname">${document.querySelector("#task1 textarea").value}</textarea>
                <button class="delete">
                <span class="material-icons md-20" style="font-size:15px;">delete</span>
                </button>
            </div>
        `;

        let current_tasks = document.querySelectorAll(".delete");
        for(let i=0; i<current_tasks.length; i++){
            current_tasks[i].onclick = function()
            {
                this.classList.add("deleted");
                console.log("closed once");
                this.parentNode.remove();
            }
        }

        document.querySelectorAll(".taskname").forEach(function(e1){
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
                waitforSave().then((response)=>{
                    console.log(`${response}, just now`);
                    if(document.getElementById("textbox").value.length) 
                    e1.innerHTML = document.getElementById("textbox").value;
                });
            });
        });
       
    }
}
//currently creating and destroying the div for window
//create ONCE then toggle classes

