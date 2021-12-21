// ==UserScript==
// @name         Labor Track Helper
// @namespace    https://github.com/whz1995/AftLite-NA/
// @version      1.2
// @description  Labor track users automaticlly every 5 minutes with set code, one-click labor tracking, show lastest labor track time.
// @author       wuhongz@
// @match        https://aftlite-na.amazon.com/indirect_action/signin_indirect_action*
// @match        http://aftlite-na.amazon.com/indirect_action/signin_indirect_action*
// @updateURL    https://github.com/whz1995/AftLite-NA/raw/main/LaborTrackHelper.user.js
// @downloadURL  https://github.com/whz1995/AftLite-NA/raw/main/LaborTrackHelper.user.js
// @grant        none
// ==/UserScript==

(function() {
    let Action_Lock = false;
    const Current_User = document.getElementsByClassName("wms-welcome")[0].innerText.split(" ")[2].replace(/[().]/g,"");
    const Form = document.getElementsByTagName("form")[0];
    sessionStorage.AutoLaborTrackFlag;
    sessionStorage.AutoLaborTrackCode;
    let Labor_Track_Msg = document.getElementsByClassName("Positive")[0];
    let Msg_Exist_Flag = false;
    let Auto_LT_Timer;

    ShowTimes();
    Form.append(document.createElement("br"));
    Form.append(document.createElement("br"));
    CreateLtButton("OBindirect");
    CreateLtButton("ICQAindirect");
    CreateLtButton("IBindirect");
    CreateLtButton("SPECindirect");
    CreateLtButton("BRK","#FFBC72");
    CreateLtButton("EOS","#FA6158");
    const Auto_LT_button = document.createElement("button");
    Form.after(Auto_LT_button);
    AutoLtInitialize();
    Auto_LT_button.before(document.createElement("br"));
    Auto_LT_button.addEventListener("click",AutoLtClick);


    function LaborTrackMsgVerify(){
        let LT_Msg_Verify = false;
        let User_Verify = false;
        let Last_LT_Code = "";
        if(Labor_Track_Msg !== undefined && Labor_Track_Msg.innerText.split(" ")[4] == "logged"){
            LT_Msg_Verify = true;
            if(Labor_Track_Msg.innerText.split(" ")[1].replace(/[\[\]]/g,"") == Current_User){
                User_Verify = true;
                Last_LT_Code = Labor_Track_Msg.innerText.split(" ")[6].replace(/[\[\]]/g,"");
            }
        }
        const LT_Info = [LT_Msg_Verify, User_Verify, Last_LT_Code];
        return LT_Info;
    }

    function CreateLtButton(LT_Code,Color){
        const New_button = document.createElement("button");
        New_button.innerHTML = LT_Code;
        if(Color != null){
            New_button.setAttribute("style", "background-color:" + Color);
        }
        Form.append(New_button);
        New_button.addEventListener("click",function(){LaborTrack(LT_Code)});
    }

    function AutoLtInitialize(){
        if(sessionStorage.AutoLaborTrackFlag == 1){
            AutoLtButtonUpdate("Success");
            AutoLtAction("Start",sessionStorage.AutoLaborTrackCode);
        }
        else{
            AutoLtButtonUpdate("Off");
        }
    }

    function AutoLtButtonUpdate(Status){
        let Message = "";
        let Color = "";
        switch(Status){
            case "Success":
                Message = `User [${Current_User}] will be logged into [${LaborTrackMsgVerify()[2]}] every 5 minute.`;
                Color = "green";
                Auto_LT_button.innerHTML = "Auto Labor Track:ON";
                Auto_LT_button.setAttribute("style", "background-color:green");
                break
            case "Fail_No_LT":
                Message = `You need to labor track first!`;
                Color = "orange";
                Auto_LT_button.innerHTML = "Auto Labor Track:OFF";
                Auto_LT_button.setAttribute("style", "background-color:red");
                break;
            case "Fail_Wrong_User":
                Message = `Wrong user was labor tracked! You need to labor track yourself!`;
                Color = "orange";
                Auto_LT_button.innerHTML = "Auto Labor Track:OFF";
                Auto_LT_button.setAttribute("style", "background-color:red");
                break;
            case "Off":
                Message = `Auto labor track is off! Don't forget to labor track yourself!`;
                Color = "red";
                Auto_LT_button.innerHTML = "Auto Labor Track:OFF";
                Auto_LT_button.setAttribute("style", "background-color:red");
                break;
            default:
                break;
        }
        if(Message != ""){
            if(!Msg_Exist_Flag){
                Msg_Exist_Flag = true;
                const Text = document.createElement("h2");
                Text.setAttribute("class","Auto_LT_Msg")
                Text.innerText = Message;
                Text.setAttribute("style", "color:" + Color);
                Auto_LT_button.after(Text);
            }
            else{
                let Current_Msg = document.getElementsByClassName("Auto_LT_Msg")[0];
                Current_Msg.innerText = Message;
                Current_Msg.setAttribute("style", "color:" + Color);
            }
        }
    }

    function AutoLtClick(){
        if(sessionStorage.AutoLaborTrackFlag == 1){
            sessionStorage.AutoLaborTrackFlag = 0;
            sessionStorage.AutoLaborTrackCode = "";
            AutoLtButtonUpdate("Off");
            AutoLtAction("Stop");
        }
        else{
            if(LaborTrackMsgVerify()[1] == true){
                sessionStorage.AutoLaborTrackFlag = 1;
                sessionStorage.AutoLaborTrackCode = LaborTrackMsgVerify()[2];
                AutoLtButtonUpdate("Success");
                AutoLtAction("Start",LaborTrackMsgVerify()[2]);
            }
            else if(LaborTrackMsgVerify()[0] == false){
                sessionStorage.AutoLaborTrackFlag = 0;
                AutoLtButtonUpdate("Fail_No_LT");
            }
            else if(LaborTrackMsgVerify()[1] == false){
                sessionStorage.AutoLaborTrackFlag = 0;
                AutoLtButtonUpdate("Fail_Wrong_User");
            }
        }
    }

    function AutoLtAction(Action,Code){
        switch(Action){
            case "Start":
                Auto_LT_Timer = setTimeout(function(){LaborTrack(Code,true)},300000);
                break;
            case "Stop":
                clearTimeout(Auto_LT_Timer);
                break;
            default:
                break;
        }
    }

    function ShowTimes(){
        if(LaborTrackMsgVerify()[0]){
            const date = new Date();
            const Times = date.toTimeString().split(" ")[0];
            let New_Message = `${Labor_Track_Msg.innerText.replace(".","")} at ${Times}.`;
            Labor_Track_Msg.innerText = New_Message;
        }
    }

    function LaborTrack(LT_button,isClick){
        const Name = document.getElementsByName("name")[0];
        const Code = document.getElementsByName("code")[0];
        if(!Action_Lock){
            Action_Lock = true;
            if(Name.value !== '') {
                Code.value = LT_button;
            }else{
                Name.value = Current_User;
                Code.value = LT_button;
            }
        }
        if(isClick){
            const Submit_Button = document.getElementsByName("commit")[0];
            Submit_Button.click();
        }
    }

})();
