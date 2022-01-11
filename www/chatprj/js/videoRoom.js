"use strict";

var url = location.href;
var uname = url.split("?")[1].split("=")[1];

var hWelcome = document.querySelector("h1#welcome");
hWelcome.textContent = "Welcome to enter '1 to 1' video chatting room: "+uname;
var iptRoom = document.querySelector("input#room");
var btnEnter = document.querySelector("button#enterRoom");
var btnExit = document.querySelector("button#exitRoom");
var btnSendMsg = document.querySelector("button#sendMsg");
var localVideo = document.querySelector("video#localVideo");
var remoteVideo = document.querySelector("video#remoteVideo");

var room = null;
var socket = null;
var localStream = null;
var remoteStream = null;
var pc = null;

var state = "init";

function start(){
    var constraints = {
        video:true,
        audio:false
    };
    //open camera and read
    navigator.mediaDevices.getUserMedia(constraints)
        .then(getStream)
        .catch(handleErr);
    conn();

}
function createPeerConnection(){
    if(!pc){
        var config = {
            "iceServers":[{
                "urls":"turn:47.254.90.250:3478",
                "username":"luwei",
                "credential":"123456"
            }]
        };
        pc = new RTCPeerConnection(config);
        //listen candidates...
        pc.onicecandidate =(e)=>{
            if(e.candidate){
                console.log("Candidate:",e.candidate);
                sendMessage({
                    type:"candidate",
                    label:e.candidate.sdpMLineIndex,
                    id:e.candidate.sdpMid,
                    candidate:e.candidate.candidate
                });
            }
        }

        pc.ontrack = (e)=>{
            remoteStream = e.streams[0];
            remoteVideo.srcObject = e.streams[0];
        }
        //add local stream to stream
        if(localStream){
            localStream.getTracks().forEach((track)=>{
                pc.addTrack(track,localStream);
            });
        }
    }
}
//get media description
function getOffer(desc){
    pc.setLocalDescription(desc)
        .catch(handleErr);
    sendMessage(desc);
}
function negotiate(){
    if(state==="joined_conn"){
        if(pc){
            var options={
                offerToReceiveAudio:false,
                offerToReceiveVideo:true
            }
            pc.createOffer(options)
                .then(getOffer)
                .catch(handleErr);
        }
    }
}
function conn(){
    socket = io.connect();
    //Joining... room
    socket.on("vjoined", (room)=>{
        alert("Join the room: "+room+" successfully!");
        iptRoom.disabled=true;
        btnEnter.disabled=true;
        btnExit.disabled=false;
        createPeerConnection();
        state = "joined";
        console.log("vjoined: ", state);
    });

    //media negotiation
    socket.on("votherjoined",(room,uname)=>{
        alert(uname + " joins into the room.");
        if(state==="joined_unbind"){
            createPeerConnection();
        }
        state = "joined_conn";
        //Media Negotiation....
        negotiate();
        console.log("votherjoined: ",state);
    });

    socket.on("vfull", (room)=>{
        alert("Sorry "+ room +" is full!");
        state = "leaved";
        console.log("vfull: ", state);
    });


    //Exiting... Message
    socket.on("vexited",(room)=>{
        alert("Exiting the room "+room);
        btnEnter.disabled=false;
        btnExit.disabled=true;
        iptRoom.disabled=false;
        state = "leaved";
        console.log("vexited: ",state);
    });
    socket.on("votherexited", (room, uname)=>{
        alert(uname+" exited the room "+ room);
        state = "joined_unbind";
        closePeerConnection();
        console.log("votherexited:", state);
    });

    socket.on("vgetdata",(room, data)=>{
       console.log(data);
       if(!data) return;
       if (data.type ==="candidate"){
           console.log("get candidate");
           pc.addIceCandidate({
               sdpMLineIndex:data.label,
               candidate:data.candidate
           }).catch(handleErr);
       }else if(data.type==="offer"){
           pc.setRemoteDescription(new RTCSessionDescription(data))
               .catch(handleErr);
           pc.createAnswer()
               .then(getAnswer)
               .catch(handleErr);
       }else if(data.type==="answer"){
           pc.setRemoteDescription(new RTCSessionDescription(data))
               .catch(handleErr);
       }else{
           console.log("err message");
       }
    });

}
function closePeerConnection(){
    console.log("close PeerConnection");
    if(pc){
        pc.close();
        pc=null;
    }
}
function getAnswer(desc){
    pc.setLocalDescription(desc)
        .catch(handleErr);
    sendMessage(desc);
}
function sendMessage(data){
    if(socket){
        socket.emit("vdata",room,data);
    }
}

function getStream(stream){
    localStream = stream;
    localVideo.srcObject=stream;
}

function handleErr(err){
    console.log(err);
}
start();

function enterRoom(){
    if(iptRoom.value==="") {
        alert("Please enter the room number");
        return;
    }
    room = iptRoom.value;
    socket.emit("vjoin",room,uname);
}
function exitRoom(){
    socket.emit("vexit",room,uname);
    closePeerConnection();
}

function send(){
    sendMessage({
        "type":"Personal Info",
        "name":uname,
        "age":25
    });
}
btnEnter.onclick = enterRoom;
btnExit.onclick = exitRoom;
btnSendMsg.onclick = send;