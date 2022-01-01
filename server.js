//server end
"use strict"

var http = require("http");
var https = require("https");
var fs = require("fs")

var express = require("express");
var serveIndex = require("serve-index");

var log4js = require("log4js");
var sqlite3 = require("sqlite3");
var socketIo = require("socket.io")

var logger = log4js.getLogger();
logger.level = "info";


var app = express();
app.use(serveIndex("./www"));
app.use(express.static("./www"));


var httpServer = http.createServer(app)
    .listen(8888, "0.0.0.0");

var options = {
    key:fs.readFileSync("./cert/ssl.key"),
    cert:fs.readFileSync("./cert/ssl.crt"),
}

var httpsServer = https.createServer(options,app)
    .listen(443, "0.0.0.0");

var io = socketIo.listen(httpsServer);
//listen the message from front-end
io.sockets.on("connection",(socket)=>{
   logger.info("connect: ", socket.id);
   //Login...
   socket.on("login",(uname,pwd)=>{
       db.all("select * from users where name=? and pwd=?",
           [uname,pwd],(e,rows)=>{
                if(e){
                    handleErr(e);
                    socket.emit("servererr");
                }

                else
                    if(rows.length===1){
                        socket.emit("loginsuc",uname);
                    }else {
                        socket.emit("loginerr");
                    }
       });
   });
   //Register... if failed, send back to the client.
   socket.on("register", (uname,pwd)=>{
      logger.info("register:",uname,pwd);
      //Check if the User exists or not?
      db.all("select * from users where name=?",
          uname,(e,rows)=>{
            if(e){
                handleErr(e);
                socket.emit("servererr");
            } else{
                if(rows.length === 1){
                    //same name case report to the front
                    socket.emit("sameuser");
                }else {
                    //insert name and pwd
                    db.run("insert into users(name,pwd) values(?,?)",
                        [uname,pwd],(e)=>{
                            if(e){
                                handleErr(e);
                                socket.emit("servererr");
                            }else {
                                socket.emit("registersuc",uname);
                            }
                        });
                }
            }
          });

   });
   //Joining the text-based room..., (pre suffix 'text-chat')
   socket.on("cjoin",(room,uname)=>{
       socket.join(room);
       var myRoom = io.sockets.adapter.rooms[room];
       var users = Object.keys(myRoom.sockets).length;

       logger.info("Room: "+room+" has " + users +" people currently");
       logger.info("cjoin:",room,uname);
       socket.emit("cjoinsuc",room,uname);
       //show others except for yourself
       socket.to(room).emit("cotherjoined",room,uname);

   });

   socket.on("cmsg",(room,uname,msg)=>{
      //send msg to people in the room
       logger.info("cmsg:",room,uname,msg);
       io.in(room).emit("cgetmsg",uname,msg);
   });
   socket.on("cexit",(room,uname)=>{
       var myRoom = io.sockets.adapter.rooms[room];
       var users = Object.keys(myRoom.sockets).length;

      socket.leave(room);
      logger.info("cexit",users-1);
      socket.emit("cexited");
      socket.to(room).emit("cotherexited",uname);
   });
    //1v1 video call room
});

logger.info("Web service is ON!")

var db=null;

db = new sqlite3.Database("app.db",(e)=>{
   if(e)
       logger.info(e);
   else
       logger.info("Database app.db starts successfuly!");
});

db.serialize(()=>{
    var sql = "";
    //Sychronizely operate the database

    //Build excel
    db.run("create table if not exists users(id integer primary key autoincrement,"+
        "name char(50) unique,pwd char(200))",(e)=>{
        if(e)
            handleErr(e);
        else
            logger.info("Create Table Users successfully!")
    });
    //Insert information
    /*
    sql = "insert into users(name, pwd) values('TestUser', '00000000')";
    db.exec(sql, (e)=>{
        if(e)
            handleErr(e);
        else
            logger.info("Insert one information successfully!")
    });
    */


    //search user and pwd
    sql="select*from users";
    db.all(sql,(e,rows)=>{
        if(e)
            handleErr(e)
        else{
            logger.info("Current Clients: "+rows.length);
            /*
            logger.info(rows);
            logger.info(rows.length);
            logger.info(rows[0]);
            logger.info(rows[1]);
            logger.info(rows[1]["id"]);
            logger.info(rows[1]["name"]);
            logger.info(rows[1]["pwd"]);
            */

        }
    });
    //Close database
    //db.close()
});


function handleErr(e){
    logger.info(e);
}