let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

window.onload = function loadPage(){

  document.getElementById("nick").value = `${userInfo.nick}`;
  document.getElementById("height").value = `${userInfo.height}cm`;
  document.getElementById("weight").value = `${userInfo.weight}kg`;

}


function addToSessionStorageObject(key, value) {

  userInfo[key] = value;
  sessionStorage.clear();
  sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

  

};

function logOut(){
  window.location.href = "http://localhost:8000/php/main.php?page=login";
}
function goToMain(){
  window.location.href = "http://localhost:8000/php/main.php?page=main";
}
function goToProfil(){
  window.location.href = "http://localhost:8000/php/main.php?page=profil";
}

function updateProfilNick(id){

  console.log(document.getElementById(`${id}`).value);
  
  const change = document.getElementById(`${id}`).value;
  
  const userId = userInfo.id;

  fetch(`http://localhost:4000/changeProfilNick/${change}/${userId}`)
    .then(data=>data.json())
      .then(data =>{
        if(data.error){
          console.log(data.data);
          return false;
          
        } else{
          console.log(data.data);
          addToSessionStorageObject("nick",change);
          window.location.href = "http://localhost:8000/php/main.php?page=profil";
          
        }
      })
        .catch(err => console.log(err));
}
function updateProfilHeight(id){

  console.log(document.getElementById(`${id}`).value);
  
  let change = document.getElementById(`${id}`).value;

  const userId = userInfo.id;

  fetch(`http://localhost:4000/changeProfilHeight/${change}/${userId}`)
  .then(data=>data.json())
      .then(data =>{
        if(data.error){
          console.log(data.data);
          return false;
          
        } else{
          console.log(data.data);
          change = parseInt(change,10);
          addToSessionStorageObject("height",change);
          window.location.href = "http://localhost:8000/php/main.php?page=profil";

        }
      })
        .catch(err => console.log(err));
}
function updateProfilWeight(id){

  console.log(document.getElementById(`${id}`).value);
  
  let change = document.getElementById(`${id}`).value;

  const userId = userInfo.id;

  fetch(`http://localhost:4000/changeProfilWeight/${change}/${userId}`)
  .then(data=>data.json())
      .then(data =>{
        if(data.error){
          console.log(data.data);
          return false;
          
        } else{
          console.log(data.data);
        }
      })
        .catch(err => console.log(err));
}