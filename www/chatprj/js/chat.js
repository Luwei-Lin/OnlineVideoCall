"use strict";

//path
var url = location.href;
//get the username
var uname = url.split("?")[1].split("=")[1];
var hWelcome = document.querySelector("h1#welcome");

hWelcome.textContent = "Welcome to Chat Room: " + uname +"!";

var txtMsgList = document.querySelector("textarea#msgList");
var iptMsg = document.querySelector("input#msg");
var btnSend = document.querySelector("button#send");
var btnExit = document.querySelector("button#exit");
var btnVideoRoom = document.querySelector("button#videoRoom");

var room = "defaultRoom";
var socket = null;
function start(){
    socket = io.connect();
    socket.emit("cjoin",room,uname);
    socket.on("cjoinsuc",(room,uname)=>{
        if(room === "defaultRoom"){
            room="Clients Room";
        }
        txtMsgList.value="Congratulation! "+uname+" enters "+room+"!\n";
    });
    socket.on("cotherjoined",(room,name)=>{
        if(name === uname){
            window.location.href = "index.html?forcedExit=1";
            return;
        }
        if(room === "defaultRoom"){
            room="Clients Room";
        }
        txtMsgList.value += "Welcome "+name+" enters "+room+".\n";
    });
    socket.on("cgetmsg",(uname,msg)=>{
       txtMsgList.value += uname +" : " + msg +"\n";
    });
    socket.on("cotherexited",(uname)=>{
        txtMsgList.value +=  uname+" left.\n";
    });
}

start();

function sendMsg(){
    if(iptMsg.value === ""){
        return;
    }
    var msg = iptMsg.value;
    socket.emit("cmsg",room,uname,msg);
    iptMsg.value='';

}
function exit(){
    socket.emit("cexit",room,uname);
    socket.on("cexited",()=>{
        history.back();
    });
}

function gotoVideoRoom(){
    window.location.href = "videoRoom.html?uname="+uname;
}
btnSend.onclick = sendMsg;
btnExit.onclick = exit;
btnVideoRoom.onclick = gotoVideoRoom;