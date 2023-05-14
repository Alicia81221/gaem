var sock = io();
    

const usernameinput = document.getElementById('usernameinput').value;
    const passwordinput = document.getElementById('passwordinput').value;
    var inputinfo = {
      usernameinput: usernameinput,
      passwordinput: passwordinput
    }
    sock.emit("retrieveplayer",inputinfo);
     

