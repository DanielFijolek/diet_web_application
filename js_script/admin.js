window.onload = function(){

  const userInfo= JSON.parse(sessionStorage.getItem("userInfo"));

  
  if(userInfo){

    const isAdmin = userInfo.isAdmin;

    if(isAdmin == 0){

      window.location.href = "http://localhost:8000/php/main.php?page=main";
      
    } else {
    
      fetch(`http://localhost:4000/getUsers`)
        .then(data => data.json())
          .then(data =>{
            if(data.error == true){

              console.log(data.data);

            } else {


              
              data.data.forEach(user =>{
              
                createElementUser(user)

              })

            }
          })

    }
    
  } else {

    window.location.href = "http://localhost:8000/php/main.php?page=main";

  }

}

function createElementUser(user){

  const userId = user.idlogin_data
  const userNick = user.nick_name;
  const isAdmin = user.is_admin
  let pos = document.getElementById("content");
  createDiv("user" + userId,"user","",pos);

  pos = document.getElementById("user" + userId);
  createDiv("userData" + userId,"userData","",pos);

  pos = document.getElementById("userData" + userId);
  createDiv("userContentN" + userId,"userContent","Nick name: " + userNick,pos);
  createDiv("userContentA" + userId,"userContent","isAdmin: " + isAdmin,pos);
  createInput("Del pushElements","giveAdmin","giveAdmin(" + userId + ")",pos);
  createInput("Del","Delete User","delUser(" + userId + ")",pos);

  fetch(`http://localhost:4000/getAllUserMeal/${userId}`)
    .then(data => data.json())
        .then(data =>{
          if(data.error == true){

            console.log(data.data);
            
          } else {
            
            data.data.forEach(element => {


              
              createElementMeal(element,userId);
              
            });
            
          }
          
        }) 
          .catch(err => console.log(err))
        
    

}

function createElementMeal(element,userId){
  
  let mealId = element.iduser_meal;
  let name = element.name;
  let Fat = element.sFat;
  let Prot = element.sProt;
  let Carbo = element.sCarbo;
  let Kcal = element.sKcal;

  
  let divIng = document.createElement("div");
  divIng.setAttribute("class","mealDiv");
  divIng.setAttribute("id","mealDiv" + mealId);
  let pos = document.getElementById("user" + userId);
  pos.appendChild(divIng);

  pos = document.getElementById("mealDiv" + mealId);
  
  createDiv("mealName" + mealId,"ingDetail", "Name: " + name, pos);
  createDiv("sFat" + mealId,"ingDetail", "Fat: " + Fat + "g", pos);
  createDiv("sProt" + mealId,"ingDetail", "Protein: " + Prot + "g", pos);
  createDiv("sCarbo" + mealId,"ingDetail","Carbohydrate: " + Carbo + "g", pos);
  createDiv("sKcal" + mealId, "ingDetail","Eneregy value: " + Kcal + "Kcal", pos);
  createInput("Del pushElements","Delete meal","delMeal(" + mealId + ")",pos);

  }

function createDiv(id,className,innerHTML,pos){
  
  let divIng = document.createElement("div");
  divIng.setAttribute("class",className);
  divIng.setAttribute("id", id);
  divIng.innerHTML = innerHTML;

  pos.appendChild(divIng);
}

function createInput(className,value,onclick,pos){
  let inputIng = document.createElement("input");
  inputIng.setAttribute("class", className);
  inputIng.setAttribute("value", value);
  inputIng.setAttribute("type", "submit");
  inputIng.setAttribute("onclick", onclick);
  pos.appendChild(inputIng);
}

function delMeal(mealId){

  fetch(`http://localhost:4000/delMeal/${mealId}`)
        .then(data => data.json())
          .then(data =>{

            if(data.error == true){

              console.log(data.data);
              
            } else {
          
              window.location.href = "http://localhost:8000/php/main.php?page=admin";
              
            }
          })
        .catch(err => console.log(err))
}

function giveAdmin(id){

  const userId = id;

  fetch(`http://localhost:4000/giveAdmin/${userId}`)
    .then(data=>data.json())
      .then(data =>{
        if(data.error){

          console.log(data.data);
          return false;
          
        } else{
    
          window.location.href = "http://localhost:8000/php/main.php?page=admin";

        }
      })
        .catch(err => console.log(err));
}

function delUser(userId){

  const id = userId
  console.log(id);
  

  fetch(`http://localhost:4000/getMealsId/${id}`)

    .then(data=>data.json())
      .then(data =>{
        if(data.error){

          console.log("error: " + data.data);
          return false;
          
        } else{
          
          data.data.forEach(mealId => {

            delMeal(mealId);
            
          });
          

        }
      })
        .then(

          fetch(`http://localhost:4000/delUser/${id}`)
            .then(data=>data.json())
              .then(data =>{
                if(data.error){
                  console.log("error: " + data.data);
                  return false;
                  
                } else{
                  console.log(data.data);
                  window.location.href = "http://localhost:8000/php/main.php?page=admin";

                }
              })
                .catch(err => console.log(err))
          )
      .catch(err => console.log(err));
}