let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.background = "transparent";

let errorMsg=document.createElement("div");
    //errorMsg.style.position = "absolute";
    errorMsg.style.left = "0px";
    errorMsg.style.top = "0px";
    errorMsg.style.width = "100%";
    errorMsg.style.height = "100%";
    errorMsg.style.background = "transparent";
    errorMsg.classList.add("errorMsg");
    errorMsg.innerHTML=`<code>No luck here :( Try again maybe...</code>`;

//export default errorMsg;
export default div;