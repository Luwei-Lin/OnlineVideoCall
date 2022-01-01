"use strict"; //Strict Grammar Check
//Client end
var url = location.href;
var urlArr = url.split("?");
if (urlArr.length===2){
    if(urlArr[1].split("=")[1]=="1"){
        alert("Your account has already logged in somewhere else!");
    }
}

var iptUser = document.querySelector("input#username");
var iptUPass = document.querySelector("input#password");
var btnReg = document.querySelector("button#register");
var btnLog = document.querySelector("button#login");

var socket = null;
function login(){
    if (iptUser.value === "" || iptUPass.value ===""){
        alert("Please enter Username and Password!");
        return;
    }
    var uname = iptUser.value;
    var pwd = iptUPass.value;

    socket.emit("login",uname,pwd);
}
// once the web starts, server will receive connection in socket.io
function start(){
    socket = io.connect();
    //Listen all status from server
    socket.on("loginsuc",(uname)=>{
       alert("Login Successfully!"+uname);
       //turn to page
        //URL pass variables "s?wd=sth"
       window.location.href = "chat.html?uname="+uname;
    });
    //The "loginsuc" and "loginerr" are labels send to the back so be careful "typo"
    socket.on("loginerr",()=>{
       alert("Username or Password mismatch");
    });
    socket.on("servererr",()=>{
        alert("Server Error, please retry or contact the admin.")
    });
}

start();
//Register new user
function register(){
    //turn to page
    window.location.href = "register.html";
}

btnLog.onclick = login;
btnReg.onclick = register;
