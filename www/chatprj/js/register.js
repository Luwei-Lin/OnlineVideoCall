"use strict";

var iptUname = document.querySelector("input#username");
var iptPasswd = document.querySelector("input#passpwd");
var iptPPasswd = document.querySelector("input#ppasspwd");
var btnRegister = document.querySelector("button#register");
var btnReturn = document.querySelector("button#return");

var socket = null;
function register(){
    if(iptUname.value === "" || iptPasswd.value ==="" || iptPPasswd.value ===""
    || iptPPasswd.value != iptPasswd.value){
        alert("Please check Username valid \n Two Password should be the same.");
        return;
    }
    //alert("Sending your data to the server...");
    var uname = iptUname.value;
    var pwd = iptPasswd.value;
    socket.emit("register",uname,pwd);
}

function start(){
    socket = io.connect();
    socket.on("sameuser",()=>{
       alert("This User already exits.");
    });
    socket.on("servererr",()=>{
       alert("Server Error! Please re-try");
    });
    socket.on("registersuc",(uname)=>{
       alert("Congratulation! "+uname+" register successfully!\n"
           +"Returning the login page...");
       goBack();
    });
}
function goBack(){
    history.back();
}
start();
btnRegister.onclick = register;
btnReturn.onclick = goBack;