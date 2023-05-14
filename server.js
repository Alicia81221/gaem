// Dependencies.
var express = require('express');
var http = require('http');
const fs = require('fs');


var path = require('path');
var socketIO = require('socket.io');

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"users"
});
let myResult;
let catalog;

var firstAdd = true;
/*con.connect(function(err) {
 
  /*con.query("SELECT * FROM useraccounts", function (err, result, fields) {
    if (err) throw err;
    myResult = result;
    console.log(myResult);
  });


  
  })*/



var app = express();
for (let j = 0; j < 4; j++) {
  let direction;
  switch (j) {
    case 0:
      direction = "up";
      break;
    case 1:
      direction = "down";
      break;
    case 2:
      direction = "left";
      break;
    case 3:
      direction = "right";
      break;
  }
  for (let i = 1; i < 4; i++) {
    app.get(`/static/img/peng${direction}${i}.png`, function(req, res) {
      fs.readFile(__dirname + `/static/img/peng${direction}${i}.png`, function(err, data) {
        if (err) {
          res.status(404).send('Image not found');
          
        } else {
          res.sendFile(__dirname + `/static/img/peng${direction}${i}.png`);
        }
      });
    });
  }
}
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.get('/register', function(req, res) {
  res.sendFile(__dirname + '/register.html');
});

// Routing
app.get('/', function(request, response) {
  
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
  
});



function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}


function getBitCount(n) {
  var tmp = n;
  var count = 0;
  while (tmp > 0) {
    tmp = tmp & (tmp - 1);
    count++;
  }
  return count;
}


var ids = {};
io.on('connection', function(socket) {
  con.connect(function(err) {
  
    con.query("SELECT * FROM catalog", function (err, result, fields) {
      if (err) throw err;
      catalog = result;
      socket.emit("readcatalog",catalog);
      //console.log(furniture);
    });
  });
  socket.on("retrieveplayer", function(data){
    con.connect(function(err) {
     
    
      con.query(`SELECT * FROM useraccounts WHERE username = '${data.usernameinput} AND password = '${data.passwordinput}'`, function (err, result, fields) {
        if (err) throw err;
        socket.emit("new player",result[0]);
      });
    });
  });
  //ocket.emit("createplayer",user);
  socket.on('new player', function(data) {
   
    
    /*con.connect(function(err) {
      con.query(`INSERT INTO useraccounts (idstring,inventory) VALUES('${data}',JSON_OBJECT(${(
        Object.keys(tempvar)
          .map(key => `JSON_KEYS(JSON_EXTRACT('${JSON.stringify(tempvar)}', '$.${key}'))[0], JSON_EXTRACT('${JSON.stringify(tempvar)}', '$.${key}')`)
          .join(', ')
      )}))`, function (err, result, fields) {
        if (err) throw err;

        
      });*/
    
      /*con.query(`SELECT * FROM useraccounts WHERE idstring = '${data}'`, function (err, result, fields) {
        if (err) throw err;
        console.log("resultlength"+result.length);
        playerlol = result[0].idstring;
        console.log("playerlol"+playerlol);
        playerinventory = JSON.parse(result[0].inventory);
        //console.log("playerwardrobe" + playerWardrobe);
        console.log("homeinfo"+playerinventory);*/
        var info = {
          x:300,
          y:300,
          username: data.userinfo.username,
          msg: "burger",
          idString: data.sockid,
          inventory: JSON.parse(data.userinfo.inventory),
          coins: data.coins,
          room: "white",
          timer: 0,
        }
        ids[data.sockid] = info;
      
        
      });

      
     
 
    
  socket.on('makeaccount', function(data){
    con.connect(function(err) {
      con.query(`INSERT INTO useraccounts (username,inventory,password,coins) VALUES('${data.usernameinput}',JSON_OBJECT(${(
        Object.keys(tempvar)
          .map(key => `JSON_KEYS(JSON_EXTRACT('${JSON.stringify(tempvar)}', '$.${key}'))[0], JSON_EXTRACT('${JSON.stringify(tempvar)}', '$.${key}')`)
          .join(', ')
      )}),'${data.passwordinput}',0)`, function (err, result, fields) {
        if (err) throw err;

        
      });
    });
  });
  

  socket.on('playerclicked', function(data) {
    /*console.log(socket.id);
    var id = ids[socket.id];*/
    console.log("dataid"+data.id);
    var player = ids[data.id]
    player.x= data.x;
    player.y =  data.y;
    console.log("player" + player.idString + " is in room " + player.room)
    io.sockets.emit('playermoved',data);
    
  });

  socket.on("changeroom", function(data){
    ids[socket.id].room = data;
    io.sockets.emit("roomchanged",ids[socket.id]);
  });
  socket.on("message", function(data){
    console.log(
      
    );
   console.log(data);
    var id = ids[socket.id];
    id.msg = data;
    io.sockets.emit('sentmessage',id);
  });
  socket.on("trade", function(data){
      io.sockets.emit("sendtrade",data);
  });
  
  socket.on("tradefinished", function(data){
      if (data != null){
        ids[data.p1.idString] = data.p1;
        ids[data.p2.idString] = data.p2;
      }
  });
  socket.on("addtoinventory",function(data){
    var id = ids[socket.id];
    id.coins -= data.price;
   

    
    
      
    

    if (data.itemtype == 1){
      var position = {
        x: 0,
        y: 0
      };
      var furnitureinfo = {
        position: position,
        n: 1,
        furniture: true
      };
      id.inventory[data.name] = furnitureinfo;

    }
    else{
      var garmentinfo = {
        n: 1,
        furniture: false
      }
      id.inventory[data.name] = garmentinfo;
    }
  
    console.log("stringified"+JSON.stringify(id.inventory));
  
    console.log("inventorygotten"+id.inventory);
    //console.log(id.wardrobe.toString(2));
    //con.connect(function(err) {
          
     
      con.query(`UPDATE useraccounts SET inventory='${JSON.stringify(id.inventory)}' WHERE idstring = '${id.idString}'`, function (err, result) {
        if (err) throw err;   
        console.log("updating"+id.inventory);   
      });
     
    
    
    io.sockets.emit("inventoryadded",id);
  });
  setInterval(function() {
    /*for (let i = 0; i< Object.keys(ids).length;i++){
      console.log(ids[Object.keys(ids)[i]].idString + "is in room" +  ids[Object.keys(ids)[i]].room);
    }*/
    io.sockets.emit('state', ids);
  }, 60);
  
});

