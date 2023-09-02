
function logIn(){

  let nick = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  
  let id = 0;
  let isAdmin = 0
  let height;
  let weight;

  if(nick && password ){
    console.log("logging in...");
    fetch(`http://localhost:4000/login/${nick}/${password}`)
      .then(data=>data.json())
        .then(data=>{
          if(data.error){
            console.log("login failed");
            document.getElementById("login_fail").innerHTML = "bad username or password";
          } else {
          password = '';
          if(data.id == 0){
            console.log("login failed");
            document.getElementById("login_fail").innerHTML = "bad username or password";
          } else{
            
            id = data.data.id;
            isAdmin = data.data.isAdmin;
            height = data.data.height;
            weight = data.data.weight;
            Kcal = Math.floor(66.47 + 13.75 * weight + 5 * height - 6.75 * 30 + 1000);
            Prot = Math.floor(2 * weight);
            Fat = Math.floor((0.25 * Kcal) / 9);
            Carbo = Math.floor((Kcal - (Prot * 4) - (Fat * 9)) / 4);
            const currentDatetime = new Date();
            
            sessionStorage.setItem("userInfo",JSON.stringify({
              id,
              isAdmin,
              height,
              weight,
              nick,
              Kcal,
              Prot,
              Fat,
              Carbo,
              Date : currentDatetime,
            }))
            
            console.log(`logging in complete user id is ${id}`);
            window.location.href = "http://localhost:8000/php/main.php?page=main";
          }
        }
        })
          .catch(err => console.log(err));
  } else {
    console.log("pass or nick empty");
    
  }

}

function signUp(){

  let reg_nick = document.getElementById("reg_username").value;
  let password = document.getElementById("reg_password").value; 
  let reg_weight = document.getElementById("weight").value;
  let reg_password = document.getElementById("check_password").value;
  let reg_height = document.getElementById("height").value;

  
  if(reg_nick && password && reg_weight && reg_password && reg_height){
    if(reg_password == password){
      console.log("signing up...");
      fetch(`http://localhost:4000/signup/${reg_nick}/${password}/${reg_height}/${reg_weight}`)
        .then(data=>data.json())
          .then(data=>{
            
            if(data.error == false){
              console.log("registration complete please sign in.");
              document.getElementById("registration").innerHTML = "registration complete please sign in.";
            } else if(data.error == true){
              console.log("username inaccessible please select another nickname");
              document.getElementById("registration").innerHTML = "username inaccessible please select another nickname";
            } else{
              console.log("bad data");
              
              }
          })
            .catch(err => console.log(err));

    } else{
      console.log("check password incorrect");
    }
    
  } else {
    console.log("pass or nick empty");
    
  }
}