// ==UserScript==
// @name         Labor Track Helper
// @namespace    https://aftlite-na.amazon.com/
// @version      0.9
// @description  Labor track users automaticlly with set interval(Not yet implemented), one-click labor tracking, show lastest labor track time.
// @author       whz1995
// @match        https://aftlite-na.amazon.com/*
// @match        http://aftlite-na.amazon.com/*
// @updateURL    https://github.com/whz1995/AftLite-NA/raw/main/LaborTrackHelper.js
// @updateURL    https://github.com/whz1995/AftLite-NA/raw/main/LaborTrackHelper.js
// @grant        none
// ==/UserScript==

(function() {
    let Action_Lock = false;
    let Name = document.getElementsByName("name")[0];
    let Code = document.getElementsByName("code")[0];
    let Current_User = document.getElementsByClassName("wms-welcome")[0].innerText.split(" ")[2].replace(/[().]/g,"");
    let LT_button = '';
    let New_Line = document.createElement("br");
    sessionStorage.AutoLaborTrackFlag;

    let OB_button = document.createElement("button");
    OB_button.innerHTML = "OBindirect";
    OB_button.onclick = function(){
        LaborTrack("OBindirect");
    }

    let IB_button = document.createElement("button");
    IB_button.innerHTML = "IBindirect";
    IB_button.onclick = function(){
        LaborTrack("IBindirect");
    }

    let ICQA_button = document.createElement("button");
    ICQA_button.innerHTML = "ICQAindirect";
    ICQA_button.onclick = function(){
        LaborTrack("ICQAindirect");
    }

    let SPEC_button = document.createElement("button");
    SPEC_button.innerHTML = "SPECindirect";
    SPEC_button.onclick = function(){
        LaborTrack("SPECindirect");
    }

    let BRK_button = document.createElement("button");
    BRK_button.innerHTML = "BRK";
    BRK_button.setAttribute("style", "background-color:#FFBC72");
    BRK_button.onclick = function(){
        LaborTrack("BRK");
    }

    let EOS_button = document.createElement("button");
    EOS_button.innerHTML = "EOS";
    EOS_button.setAttribute("style", "background-color:#FA6158");
    EOS_button.onclick = function(){
        LaborTrack("EOS");
    }

    function ShowTimes(){
        if(document.getElementsByClassName("Positive")[0] != undefined && document.getElementsByClassName("Positive")[0].innerText.split(" ")[4] == "logged"){
            const date = new Date();
            let Times = date.toTimeString().split(" ")[0];
            let New_Message = document.getElementsByClassName("Positive")[0].innerText.replace(".","") + " at " + Times + ".";
            document.getElementsByClassName("Positive")[0].innerText = New_Message;
        }
    }

    function LaborTrack(LT_button){
        if(!Action_Lock){
            Action_Lock = true;
            if(Name.value !== '') {
                Code.value = LT_button;
            }else{
                Name.value = Current_User;
                Code.value = LT_button;
            }
        }
        return;
    }

    ShowTimes();
    document.getElementsByTagName("form")[0].append(New_Line);
    document.getElementsByTagName("form")[0].append(OB_button);
    document.getElementsByTagName("form")[0].append(ICQA_button);
    document.getElementsByTagName("form")[0].append(IB_button);
    document.getElementsByTagName("form")[0].append(SPEC_button);
    document.getElementsByTagName("form")[0].append(BRK_button);
    document.getElementsByTagName("form")[0].append(EOS_button);
})();
