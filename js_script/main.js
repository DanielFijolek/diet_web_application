let numberOfIng = 1
let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
let currentDate;

const userId = userInfo.id;

window.onload = function DateOnLoad(){
  
  currentDate = new Date(userInfo.Date);
  
  let midData1 =  currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + (currentDate.getDate()-2);
  let midData2 =  currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + (currentDate.getDate()-1);
  let midData3 =  currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + (currentDate.getDate());
  let midData4 =  currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + (currentDate.getDate()+1);
  let midData5 =  currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + (currentDate.getDate()+2);

  document.getElementById("dateButton1").innerHTML = midData1;
  document.getElementById("dateButton2").innerHTML = midData2;
  document.getElementById("dateButton3").innerHTML = midData3;
  document.getElementById("dateButton4").innerHTML = midData4;
  document.getElementById("dateButton5").innerHTML = midData5;

  currentDate = midData3;

  fetch(`http://localhost:4000/getMeal/${userId}/${currentDate}`)
  .then(data => data.json())
    .then(data =>{
      if(data.error == true){
        console.log(data.data);
        
      } else {
    
        
        data.data.forEach(element => {
          createElementMeal(element);
          
        });
        
      }
      
    }) 
      .then(
        fetch(`http://localhost:4000/getIngDetail/${userId}/${currentDate}`)
          .then(data => data.json())
            .then(data =>{
              if(data.error == true){
                console.log(data.data);
                
              } else {
            
                
                const mFat = JSON.parse(sessionStorage.getItem("userInfo")).Fat;
                const mCarbo = JSON.parse(sessionStorage.getItem("userInfo")).Carbo;
                const mProt = JSON.parse(sessionStorage.getItem("userInfo")).Prot;
                const mKcal = JSON.parse(sessionStorage.getItem("userInfo")).Kcal;

                document.getElementById("footProtName").innerHTML = "Protein: " + data.data[0].prot + "/" + mProt;
                document.getElementById("footFatName").innerHTML = "Fat: " + data.data[0].fat + "/" + mFat;
                document.getElementById("footCarboName").innerHTML = "Carbohydrates: " + data.data[0].carbo + "/" + mCarbo;
                document.getElementById("footKcalName").innerHTML = "Kcal: " + data.data[0].Kcal + "/" + mKcal;

                const pFat = 100 - (data.data[0].fat / mFat * 100) ;
                const pProt = 100 - (data.data[0].prot / mProt * 100);
                const pCarbo = 100 - (data.data[0].carbo / mCarbo * 100);
                const pKcal = 100 - (data.data[0].Kcal / mKcal * 100);

            
                
                document.getElementById("footProtBlank").style.width = pProt + "%";
                document.getElementById("footFatBlank").style.width = pFat + "%";
                document.getElementById("footCarboBlank").style.width = pCarbo + "%";
                document.getElementById("footKcalBlank").style.width = pKcal + "%";
    
              }
            })
              .catch(err => console.log(err))
      )
        .catch(err => console.log(err))

}

function goToDate(i){

  let value = new  Date(userInfo.Date);
  value.setDate(value.getDate() + i)
  userInfo.Date = value;
  sessionStorage.clear();
  sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  window.location.href = "http://localhost:8000/php/main.php?page=main";
  
}

function createElementMeal(element){
  
  let mealId = element.iduser_meal;
  let name = element.name;
  let Fat = element.sFat;
  let Prot = element.sProt;
  let Carbo = element.sCarbo;
  let Kcal = element.sKcal;

  let divIng = document.createElement("div");
  divIng.setAttribute("class","mealDiv");
  divIng.setAttribute("id","mealDiv" + mealId);
  let pos = document.getElementById("content");
  pos.appendChild(divIng);

  pos = document.getElementById("mealDiv" + mealId)
  
  createIngDetailDiv("mealName" + mealId, "Name: " + name, pos);
  createIngDetailDiv("sFat" + mealId, "Fat: " + Fat + "g", pos);
  createIngDetailDiv("sProt" + mealId, "Protein: " + Prot + "g", pos);
  createIngDetailDiv("sCarbo" + mealId,"Carbohydrate: " + Carbo + "g", pos);
  createIngDetailDiv("sKcal" + mealId, "Eneregy value: " + Kcal + "Kcal", pos);

  let inputIng = document.createElement("input");
  inputIng.setAttribute("class", "mealDel");
  inputIng.setAttribute("value", "Delete meal");
  inputIng.setAttribute("type", "submit")
  inputIng.setAttribute("onclick", "delMeal(" + mealId + ")")
  pos.appendChild(inputIng);

  }

function createIngDetailDiv(id,innerHTML,pos){
  let divIng = document.createElement("div");
  divIng.setAttribute("class","ingDetail");
  divIng.setAttribute("id", id);
  divIng.innerHTML = innerHTML;

  pos.appendChild(divIng);
}

function delMeal(mealId){

  fetch(`http://localhost:4000/delMeal/${mealId}`)
        .then(data => data.json())
          .then(data =>{

            if(data.error == true){

              console.log(data.data);
              
            } else {
          
              console.log(data.data);
              window.location.href = "http://localhost:8000/php/main.php?page=main";
              
            }
          })
        .catch(err => console.log(err))
}

function confirmMeal(){
  
  const mealName = document.getElementById("meal").value;

  console.log(mealName,userId,currentDate);
  let ingName;
  let ingProtein;
  let ingFat;
  let ingCarbo;
  let ingKcal;
  let mealId;

  fetch(`http://localhost:4000/meal/${mealName}/${userId}/${currentDate}`)
    .then(data => data.json())
      .then(data =>{
        if(data.error == true){
          console.log(data.data);
          
        } else {

          mealId = data.data;
          
        }

      })
      .then(() => {
        for(let i = 1; i <= numberOfIng; i++){

          ingName = document.getElementById("ingredient" + i).value;
          ingProtein = document.getElementById("ingredientProtein" + i).value;
          ingFat = document.getElementById("ingredientFat" + i).value;
          ingCarbo = document.getElementById("ingredientCarbohydrates" + i).value;
          ingKcal = document.getElementById("ingredientKcal" + i).value;
          console.log(i);
          
      
          fetch(`http://localhost:4000/ingredient/${mealId}/${ingName}/${ingKcal}/${ingProtein}/${ingCarbo}/${ingFat}`)
          .then(data => data.json())
            .then(data =>{
              if(data.error == true){
                console.log(data.data);
                

              } else {
      
                console.log(data.data);
                window.location.href = "http://localhost:8000/php/main.php?page=main";
              }
      
            })
              .catch(err => console.log(err))
          }
      })

      
        .catch(err => console.log(err))

  


}

function creatIngInput(id,placeholder,pos){

  let input = document.createElement("input");
  input.setAttribute("class","ingredientInput");
  input.setAttribute("id",id);
  input.setAttribute("type","text");
  input.setAttribute("value","");
  input.setAttribute("placeholder",placeholder);

  pos.appendChild(input);
}

function newIngredient(){
  let pos = document.getElementById("ingredientDiv"+numberOfIng);

  numberOfIng += 1;

  let ingDiv = document.createElement("div");
  ingDiv.setAttribute("class","ingredientDiv");
  ingDiv.setAttribute("id",'ingredientDiv'+numberOfIng);
  pos.parentNode.insertBefore(ingDiv,pos);

  pos = document.getElementById('ingredientDiv'+numberOfIng);

  ingDiv = document.createElement("div");
  ingDiv.setAttribute("class","ingredientName");
  ingDiv.innerHTML = "Ingredient:";
  pos.appendChild(ingDiv);



  creatIngInput('ingredient'+numberOfIng,'name',pos);
  creatIngInput('ingredientProtein'+numberOfIng,'Protein',pos);
  creatIngInput('ingredientFat'+numberOfIng,'Fat',pos);
  creatIngInput('ingredientCarbohydrates'+numberOfIng,'Carbohydrates',pos);
  creatIngInput('ingredientKcal'+numberOfIng,'Kcal',pos);

  input = document.createElement("input");
  input.setAttribute("class","ingredientDel");
  input.setAttribute("type","submit");
  input.setAttribute("value","Delete ingredient");
  input.setAttribute("onclick",'delIngredient()');

  pos.appendChild(input);


  

}
function logOut(){
    window.location.href = "http://localhost:8000/php/main.php?page=login";
  }
  function goToMain(){
    window.location.href = "http://localhost:8000/php/main.php?page=main";
  }
  function goToProfil(){
    window.location.href = "http://localhost:8000/php/main.php?page=profil";
  }