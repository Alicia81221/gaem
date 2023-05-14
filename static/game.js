
  
  var sock = io();
  /*var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"users"
  });*/
  var user;
  /*con.connect(function(err) {
  
    con.query("SELECT * FROM catalog", function (err, result, fields) {
      if (err) throw err;
      catalog = result;
      //console.log(furniture);
    });
  });*/
  
  //sock.emit("new player",sock.id);
  var players = {};
  /*connection.on('connect', function(){
    var sessionID = connection.socket.sessionID;
    console.log("a client has connected with" + sessionID);
      players[sessionID] = new Penguin(300,300);
  });*/

  /*sock.on('connect', () => {
    console.log("new player client"+sock.id);
    players[sock.id] =new Penguin(300,300); // an alphanumeric id...
});*/

  document.addEventListener("click", function(event) {

    var movement = {
      x:  event.clientX - canvas.getBoundingClientRect().left,
      y: event.clientY - canvas.getBoundingClientRect().top,
      id: sock.id
    }
    //console.log("me moving");
    sock.emit('playerclicked',movement);
  });
  

  /*img.addEventListener('load', function() {
    console.log("loaded");
    img.src = "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, p.x, p.y);
    
  });*/
  var canvas = document.getElementById('canvas');
  var gamebroadcasts = document.getElementById('gamebroadcasts');
  var playerrooms = document.getElementById('playerrooms');
  var blueRoom = document.getElementById('blueroom');
  var whiteRoom = document.getElementById('whiteroom');
  blueRoom.onclick = function(){
    console.log("going to blue");
    sock.emit('changeroom',"blue");
  }
  whiteRoom.onclick = function(){
    sock.emit('changeroom',"white");


  }
  //var list = document.getElementById('resultsList');
  const myShop = document.getElementById('myShop');
  var coinCounter = document.getElementById('coincount');
  var speed = 30;
  canvas.width = 800;
  canvas.height = 600;
  var context = canvas.getContext('2d');
  context.fillStyle = "#ffffff";
  class Chatbox{
    constructor(peng,txt){
      this.peng = peng;
      this.txt = txt;
    }

  }
  class Penguin{
  
    constructor(xPos,yPos){
        this.newXPos;
        this.newYPos;
        this.msg = "";
        this.idString = "";
        this.timer = 0;
        this.xPos = xPos;
        this.yPos = yPos;
        this.spriteNum = 0;
        this.isChatting = false;
        this.sourceimg =  'static/img/pengdown1.png';
        this.coins = 500;
        this.room = "white";
        this.inventory = {};

    }
    makeChatbox(message){
        this.msg = message;
        this.isChatting = true;
        setTimeout(() => {     console.log("setTimeout function called");
        this.isChatting = false; }, 5000);

    }
    pythagoras(a,b){
      return Math.sqrt((a * a) + (b * b));
    }
    getDistribution(a,b){
        
      var distance = this.pythagoras(a,b);
      //console.log("distance"+distance);
      var steps = Math.ceil(distance / speed);
      var whole = a + b;
      var xUnits = Math.ceil((a / whole) * speed);
      var yUnits = Math.ceil((b / whole) * speed);
      return [xUnits,yUnits,steps];
    
    }

    
  
    animatePlayer(dist,up,right,direction){
        
        this.timer++;
  
  
        if (this.spriteNum < 3)
            {
                this.spriteNum++;
            }
            else
            {
                this.spriteNum = 1;
            }
        this.xPos = right ? this.xPos + dist[0] : this.xPos - dist[0];
        this.yPos = up ? this.yPos - dist[1] : this.yPos + dist[1];
        
  
    
  
          switch (direction){
        case "up":
            this.sourceimg =  `static/img/pengup${this.spriteNum}.png`;
            break;
        case "down":
            this.sourceimg =  `static/img/pengdown${this.spriteNum}.png`;
            break;
        case "right":
            this.sourceimg =  `static/img/pengright${this.spriteNum}.png`;
            break;
        case "left":
            this.sourceimg =  `static/img/pengleft${this.spriteNum}.png`;
            break;
    }
    //imageObj.src = `img/peng${direction}${spriteNum}.png`;
    /*context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    console.log("sprite:"+this.sprite.src + " x:" + this.xPos + " y:" + this.yPos);
    context.drawImage(this.sprite, this.xPos, this.yPos);*/
  }
    prepareAnimation(){
      //console.log("newxpos"+this.newXPos);
      //console.log("newypos"+this.newYPos);

    var xDiff = Math.abs(this.xPos - this.newXPos); 
    var yDiff = Math.abs(this.yPos - this.newYPos); 
    var right = this.newXPos > this.xPos ? true : false;
    var up = this.newYPos < this.yPos ? true : false;
    var direction;
    if (xDiff > yDiff){
        direction = right ? "right" : "left";
    }
    else{
        direction = up ? "up" : "down";
    }
  
   // console.log("xDIff"+xDiff);
   // console.log("yDiff"+yDiff);
    var distribution = this.getDistribution(xDiff,yDiff);
   // console.log("distribution"+distribution[2]);
    var interval = setInterval(() => {
        this.animatePlayer(distribution,up, right, direction);
        if (this.timer > distribution[2]) {
            this.timer = 0;
            clearInterval(interval);
        } 
    }, 75);
  
  }
  
  
  
  
  
  }
  
function addAccount(){
  const usernameinput = document.getElementById('usernameinput').value;
  const passwordinput = document.getElementById('passwordinput').value;
  var info = {
    usernameinput: usernameinput,
    passwordinput: passwordinput
  }
  sock.emit("retrieveplayer",info);
  
}
  
  const inputField = document.getElementById("textmessage");

   //Do something


// Connect to the socket.io server

    // Send the message when the user hits the "Enter" key
    inputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const message = inputField.value;
        console.log(message);
        let wanteditems = [];
        let offereditems = [];
        Object.keys(players).forEach((player) => {
          if (message == `/trade ${player}`){

            gamebroadcasts.insertAdjacentHTML('beforebegin',`<li>${player}'s items:</li>`);
            gamebroadcasts.insertAdjacentHTML('beforebegin', "<li><div id='tradeeitems' style='background-color:blue'></div></li>");
            Object.keys(players[player].inventory).forEach((itemname) => {
              const tradeeitems = document.getElementById('tradeeitems');
              const btn = document.createElement("button");
              btn.classList = 'offeredbuttons';
              btn.innerHTML = itemname;
              tradeeitems.appendChild(btn);
              btn.addEventListener("click", function(event){
                console.log("fdsfsfs");
                wanteditems.push(itemname);
            });
            }); 

            gamebroadcasts.insertAdjacentHTML('beforebegin',`<li>$your items:</li>`);
            gamebroadcasts.insertAdjacentHTML('beforebegin', "<li><div id='youritems' style='background-color:red'></div></li>");
            Object.keys(players[sock.id].inventory).forEach((itemname) => {
              const youritems = document.getElementById('youritems');
              const btn = document.createElement("button");
              btn.classList = 'wantedbuttons';
              btn.innerHTML = itemname;
              youritems.appendChild(btn);
              btn.addEventListener("click", function(event){
                console.log("jkdhksdjf");

                offereditems.push(itemname);
            });
                
              
            }); 
 
            gamebroadcasts.insertAdjacentHTML('beforebegin',"<li><button id='sendtrade'>Send trade</button></li>");
            const tradeBtn = document.getElementById("sendtrade");
            tradeBtn.onclick = function(){
              var tradeinfo = {
                trader: players[sock.id],
                tradee: players[player],
                wanted: wanteditems,
                offered: offereditems
              }
              console.log("offering"+tradeinfo.offered[0]);
              sock.emit("trade",tradeinfo);

            }
          }
          
        });
        
        sock.emit("message", message);
        inputField.value = "";

      }
    });
    sock.on('sendtrade',function (data){
      if (data.tradee.idString == players[sock.id].idString){
        console.log("testing"+players[data.trader.idString].idString);
        gamebroadcasts.innerHTML += `<li>${data.trader.idString} wants to trade their`;
        console.log("offered"+data.offered);
        data.offered.forEach((itemname) => {
            console.log("trader trades"+itemname);
            gamebroadcasts.innerHTML += ` ${itemname},`;
        }); 
        gamebroadcasts.innerHTML += " for your ";
        data.wanted.forEach((itemname) => {
          console.log("trader wants"+itemname);
          gamebroadcasts.innerHTML += ` ${itemname},`;
      }); 
      gamebroadcasts.innerHTML += "</li><li>Do you accept?</li><li><div id='tradechoice'></div></li>";
      const tradechoice = document.getElementById('tradechoice');
      const btnYes = document.createElement("button");
      btnYes.innerHTML = "yes";
      tradechoice.appendChild(btnYes);
      btnYes.onclick = function(){
        data.wanted.forEach((givenitem) => {
         
        Object.keys(players[data.trader.idString].inventory).forEach((inventorykey) =>{
              console.log("traderinventory"+inventorykey);
          });
          Object.keys(players[sock.id].inventory).forEach((inventorykey) =>{
            console.log("myinventory"+inventorykey);
          });
        
          players[data.trader.idString].inventory[givenitem] = JSON.parse(JSON.stringify(players[sock.id].inventory[givenitem]));
          delete players[sock.id].inventory[givenitem];

        });
        data.offered.forEach((gottenitem) =>{
          players[sock.id].inventory[gottenitem] = JSON.parse(JSON.stringify(players[data.trader.idString].inventory[gottenitem]));
          delete players[data.trader.idString].inventory[gottenitem];
        });
        var agents = {
          p1: players[sock.id],
          p2: data.tradee
        }
        sock.emit("tradefinished",agents);
      }
      const btnNo = document.createElement("button");
      btnNo.innerHTML = "no";
      tradechoice.appendChild(btnNo);
      btnNo.onclick = function(){
        sock.emit("tradefinished",null);

      }
      }
    });
    
  
  /*sock.on('state', function(players) {
    console.log(players);
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'green';
    for (var id in players) {
      var player = players[id];
      context.beginPath();
      context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
      context.fill();
    }
  });*/
  let catalog = {};
  sock.on('result', function(data){
    console.log("result gotten");
    /*for (let i = 0; i < data.length; i++) {
      //list.innerHTML += `<li>${data[i]}</li>`;
    }*/
    });
    sock.on("readcatalog", function(data){
      console.log("read catalog");
      for (let i = 0; i < data.length; i++) {
        const shopOption = document.createElement("button");
        shopOption.innerHTML = `Buy ${data[i].name}`;
        shopOption.id = data[i].name;
        shopOption.classList.add('item');
        shopOption[i.toString()] = data[i];
        shopOption.onclick = function(){
          
          sock.emit("addtoinventory",data[i]);
        }
        myShop.appendChild(shopOption);
    }
  });
   
 
  sock.on('createplayer', function(data){
    /*console.log("newplayer"+sock.id);
    sock.emit('new player',sock.id);*/

      sock.emit("new player",data);

    

  });

  sock.on('playermoved', function(data){
    
    //console.log("playerclickedidstring"+data.id);
    //console.log("letimer" + players[data.id].timer);
    if (players[data.id].timer == 0){
      //console.log(data.idString + " moving");
      players[data.id].newXPos = data.x;
      players[data.id].newYPos = data.y;
     // console.log("mvoement x " + data.x + " movement y" + data.y);
     // console.log("player" + players[data.id].idString + " in room"+players[data.id].room);
      players[data.id].prepareAnimation();
    }


  });
  sock.on('sentmessage', function(data){
    players[data.idString].msg = data.msg;
    console.log(data.idString + " " + data.msg);
    players[data.idString].makeChatbox(data.msg);
  });



  sock.on('inventoryadded',function(data){
    players[data.idString].inventory = data.inventory;
    players[data.idString].coins = data.coins;
    console.log("inventoryinfo" + data.inventory);

    
    coinCounter.innerText = data.coins;

  });



 


  sock.on('roomchanged', function(data){
    players[data.idString].room = data.room;

  });
  sock.on('state', function(ids) {
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    //console.log("howmanyids"+Object.keys(ids).length);
    //console.log("idslength"+Object.keys(ids).length);
    for (let i = 0;i<Object.keys(ids).length;i++) {
      //console.log("fullid"+ids[Object.keys(ids)[i]]);
      //var idString = ids[Object.keys(ids)[i]].idString;
      var idString = Object.keys(ids)[i];
      //console.log(idString + " " + i);
      if (players[idString] == null){
        console.log("creating new");
        players[idString] = new Penguin(300,300);
        players[idString].idString = idString;
        var homeButton = document.createElement("button");
        homeButton.innerHTML = `Go to ${idString}`;
        homeButton.onclick = function(){
          sock.emit('changeroom', idString);

        //console.log("newuserid"+players[idString].idString);
        //createNewButton(players[idString],idString);*/
        
      }
      playerrooms.appendChild(homeButton);
      //console.log(idString + " is in  room" + players[idString].room);
      //console.log(idString + "is in " + players[idString].room);

      /*if (players[sock.id] != null){
        //console.log(players[idString].idString +  " is in room " + players[idString].room + "and you are in room" + players[sock.id].room);

      }*/
    }
    if (players[sock.id] != null && (players[idString].room == players[sock.id].room)){
      var player = players[idString];
      //console.log("reading"+id);
        var sprite = new Image();
        sprite.src = player.sourceimg;
        context.drawImage(sprite, player.xPos, player.yPos);
        //console.log("drawing" + " " + player.xPos + " " + player.yPos)
        if (player.isChatting){
          var originalFillStyle = context.fillStyle;
          context.fillStyle = "#000000";
          context.fillText(player.msg, player.xPos, player.yPos - 40);
          context.fillStyle = originalFillStyle;
        }

    }
  
  }
      //console.log("sockid"+sock.id + " players:"+idString);
     
    
  
});


