document.querySelector("#add").onclick=f1;
let div = document.createElement("div");
                div.style.position = "absolute";
                div.style.left = "0px";
                div.style.top = "0px";
                div.style.width = "100%";
                div.style.height = "100%";
                div.style.background = "transparent";
//${popuptask[i].innerHTML}
function waitforSave(){
    return new Promise((resolve, reject) => {
        document.addEventListener('click', function(e)
        {
            if(e.target && (e.target.id== 'save' || e.target.className== 'blocker' || e.target.id== 'close' ))
            {
                resolve("save has been clicked or box has been exited");
            //if(document.getElementById("textbox")){
            //let str1=document.getElementById("textbox").value;
            //e1.innerHTML=str1;
            }
        });    
    })
}

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

document.addEventListener('click', function(e)
{
    if(e.target && (e.target.className== 'blocker' || e.target.id== 'close' )){
        console.log("closing now");
        //works
        document.body.removeChild(div);
    }
});

async function isEmpty(){ 
    const elm = await waitForElm(".taskname");
    return (elm[0].textContent.length==0);
}

function searchNotes(searchString="none"){
    if(!isEmpty())
    {
        console.log("clicked");
        document.querySelectorAll(".taskname").forEach(function(item) {
            if (!item.textContent.includes(searchString))
            item.style.display="none";
        }
        )
    }
}

function Search(str1){
    console.log("search button clicked!");
    if(isEmpty()){
        console.log("clicked");
        waitForElm(".taskname").then((elm)=>{
            elm.forEach((item)=>{
                if (!item.textContent.includes(str1))
                item.style.display="none"; 
            })
        })
    }
}

function f1() 
{

    if(document.querySelector('#task1 textarea').value.length == 0)
    {
        alert("Please Enter a Task!");
    }
    else
    {
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

