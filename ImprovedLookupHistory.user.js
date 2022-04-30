// ==UserScript==
// @name         Improved Lookup History
// @namespace    https://github.com/whz1995/AftLite-NA/
// @version      1.0
// @description  Highlightes all the actions except PACK with different colors to provide better view of tracking units. Provides a button to hide all PACK action.Supports barcode/UPC tracking.
// @author       wuhongz@
// @match        https://aftlite-na.amazon.com/labor_tracking/lookup_history*
// @match        http://aftlite-na.amazon.com/labor_tracking/lookup_history*
// @grant        none
// ==/UserScript==

(function() {
    document.getElementsByTagName("title")[0].innerHTML = "Lookup History";
    const lookupForm = document.getElementsByTagName("table")[1];
    sessionStorage.isObpsButtonClicked;
    highlightAction();
    createObpsButton();
    createUpcCheck();

    function highlightAction(){
        const actionTable = document.getElementsByTagName("tbody")[2];
        const actionRowLength = actionTable.rows.length;
        function addRowAttribute(action,tool,row){
            switch(action){
                case "pack":
                    if(tool === "pack"){
                        actionTable.rows[row].setAttribute("class","packPack");
                    }
                    else if(tool === "pack_problem"){
                        actionTable.rows[row].style.backgroundColor = "lightpink";
                    }
                    break;
                case "receive":
                    actionTable.rows[row].style.backgroundColor = "lightgreen";
                    break;
                case "stow":
                    actionTable.rows[row].style.backgroundColor = "lightgreen";
                    break;
                case "stow_move":
                    actionTable.rows[row].style.backgroundColor = "lightgreen";
                    break;
                case "transform":
                    actionTable.rows[row].style.backgroundColor = "lightgreen";
                    break;
                case "adjust":
                    if(tool === "pack" || tool === "removal"){
                        actionTable.rows[row].style.backgroundColor = "LightSalmon";
                    }
                    else{
                        actionTable.rows[row].style.backgroundColor = "lightblue";
                    }
                    break;
                case "skip":
                    actionTable.rows[row].style.backgroundColor = "LightSalmon";
                    break;
                case "inventory":
                    actionTable.rows[row].style.backgroundColor = "lightblue";
                    break;
                case "update expiry":
                    actionTable.rows[row].style.backgroundColor = "lightblue";
                    break;
                case "removal":
                    actionTable.rows[row].style.backgroundColor = "lightblue";
                    break;
                case "damage":
                    actionTable.rows[row].style.backgroundColor = "LightSalmon";
                    break;
                case "dispose":
                    actionTable.rows[row].style.backgroundColor = "LightSalmon";
                    break;
                case "bulk_move":
                    actionTable.rows[row].style.backgroundColor = "LightSalmon";
                    break;
                case "unpack":
                    actionTable.rows[row].style.backgroundColor = "LightSalmon";
                    break;
                default:
                    break;
            }
        }
        function highlightRows(){
            for(let row = 1; row < actionRowLength; row++){
                let action = actionTable.rows[row].cells[1].innerHTML;
                let tool = actionTable.rows[row].cells[2].innerHTML;
                addRowAttribute(action,tool,row);
            }
        }
        highlightRows();
    }

    function createElement(tag,attrs,styles){
        let newElement;
        if(tag === "svg" || tag === "g" || tag === "rect"){
            //codes for future barcode generator support
        }
        else{
            newElement = document.createElement(tag);
            for(let attrsKey in attrs){
                newElement.setAttribute(attrsKey,attrs[attrsKey]);
            }
            for(let stylesKey in styles){
                newElement.style[stylesKey] = styles[stylesKey];
            }
        }
        return newElement;
    }

    function createObpsButton(){
        function initializeObpsButton(){
            if(sessionStorage.isObpsButtonClicked == 1){
                updateObpsButton("On");
                displayPackAction("Hide");
            }
            else{
                updateObpsButton("Off");
            }
        }

        function updateObpsButton(status){
            switch(status){
                case "On":
                    obpsButton.innerHTML = "OBPS Mode:ON";
                    obpsButton.style.backgroundColor = "lightgreen";
                    break;
                case "Off":
                    obpsButton.innerHTML = "OBPS Mode:OFF";
                    obpsButton.style.backgroundColor = "LightSalmon";
                    break;
                default:
                    break;
            }
        }

        function displayPackAction(status){
            let length = document.getElementsByClassName("packPack").length;
            switch(status){
                case "Hide":
                    for(let i = 0; i<length; i++){
                        document.getElementsByClassName("packPack")[i].style.display = "none";
                    }
                    break;
                case "Display":
                    for(let i = 0; i<length; i++){
                        document.getElementsByClassName("packPack")[i].style.display = "table-row";
                    }
                    break;
                default:
                    break;
            }
        }

        function clickObpsButton(){
            if(sessionStorage.isObpsButtonClicked != 1){
                displayPackAction("Hide");
                updateObpsButton("On");
                sessionStorage.isObpsButtonClicked = 1;
            }else{
                displayPackAction("Display");
                updateObpsButton("Off");
                sessionStorage.isObpsButtonClicked = 0;
            }
        }

        const obpsDiv =createElement("div",null,{margin:"auto",width:"125px"});
        lookupForm.after(obpsDiv);
        const obpsButton = createElement("button",null,{borderRadius:"2px",borderWidth:"1px"});
        obpsDiv.append(obpsButton);
        obpsButton.addEventListener("click",clickObpsButton);
        initializeObpsButton();
    }

    function createUpcCheck() {
        function getASIN(upc){
            const upcPage = new XMLHttpRequest();
            upcPage.open("POST", "/inventory/view_catalog_data_for_asin");
            upcPage.responseType = "document";
            upcPage.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            upcPage.onloadend = function() {
                let asin;
                if(this.responseXML.getElementsByTagName("h2")[0].innerText.split(" ")[0] !== "No"){
                    asin = this.responseXML.getElementsByTagName("h2")[0].innerText.split(/[\n ]/g)[4];
                }
                else{
                    asin = "Wrong UPC";
                }
                document.getElementsByName("asin")[0].value = asin;
            }
            upcPage.send("asin="+upc);
        }

        function createBarCodeForm(){
            const submitButton = document.querySelector("input[type=submit]");
            const upcTr = createElement("tr");
            const upcTdText = createElement("td");
            upcTdText.innerText = "UPC/Barcode:";
            const upcTdForm = createElement("td");
            const upcTdOR = createElement("td");
            const upcSpectator= createElement("strong");
            upcSpectator.innerHTML = "-- OR --";
            const upcInput = createElement("input",{type:"text",name:"upc"});
            document.getElementsByTagName("table")[1].rows[4].after(upcTr);
            upcTr.append(upcTdText);
            upcTr.append(upcTdForm);
            upcTr.append(upcTdOR);
            upcTdForm.append(upcInput);
            upcTdOR.append(upcSpectator);
            upcInput.addEventListener('keydown', function(event){
                if(event.key == "Enter"){
                    event.preventDefault();
                    getASIN(upcInput.value);
                    clearOtherFields("asin");
                    //submitButton.click();
                }
            });
        }

        function clearOtherFields(name){
            for(let i = 0; i < fieldsLength; i++){
                if(fields[i].name !== name){
                    fields[i].value = "";
                }
            }
        }

        function fixOtherFields(){
            for(let i = 0; i < fieldsLength; i++){
                if(fields[i].name !== "upc"){
                    fields[i].addEventListener('keydown', function(event){
                        if(event.key == "Enter"){
                            event.preventDefault();
                            clearOtherFields(fields[i].name);
                            document.querySelector("input[type=submit]").click();
                        }
                    });
                }
            }
        }
        createBarCodeForm();
        const fields = document.querySelectorAll("input[type=text]");
        const fieldsLength = document.querySelectorAll("input[type=text]").length;
        fixOtherFields();
    }
})();
