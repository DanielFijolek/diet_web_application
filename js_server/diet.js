let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let sha = require("js-sha512");

let connection = mysql.createConnection({
	host        : "localhost",
  user        : "root",
  password    : "Admin123",
  database    : "diet_db",
  auth_plugin : "mysql_native_password"
});
//--------mysql-----------


const login_ask = `SELECT 
  idlogin_data,nick_name,high,weight,is_admin 
  FROM user_data WHERE nick_name = ? AND password = ?;`

const sign_up_ask = `INSERT INTO user_data (nick_name,password,high,weight,is_admin)
  VALUES (?,?,?,?,0);`

const updateProfilNick = `UPDATE user_data SET nick_name = ? WHERE idlogin_data = ?;`;

const updateProfilHeight = `UPDATE user_data SET high = ? WHERE idlogin_data = ?;`;

const updateProfilWeight = `UPDATE user_data SET weight = ? WHERE idlogin_data = ?;`;

const giveAdmin = `UPDATE user_data SET is_admin = 1 WHERE idlogin_data = ?;`;

const insertMeal = `INSERT INTO user_meal (name,date,user_data_idlogin_data)
  VALUE (?,?,?);`;

const inserIngredient =`INSERT INTO ingredients (
  ingredient_name,fat,protein,carbohydrates,Kcal,user_meal_iduser_meal) 
  VALUE (?,?,?,?,?,?);`;

const selectMeal =`SELECT um.name, um.iduser_meal, SUM(i.fat) AS sFat, 
SUM(i.protein) AS sProt, SUM(i.carbohydrates) AS sCarbo, SUM(i.Kcal) AS sKcal
FROM ingredients i JOIN user_meal um ON i.user_meal_iduser_meal = um.iduser_meal
WHERE um.date = ? AND um.user_data_idlogin_data = ?
GROUP BY um.name, um.iduser_meal;`;

const getSumFromDay = `SELECT SUM(i.fat) AS fat, SUM(i.protein) AS prot,
  SUM(i.carbohydrates) AS carbo, SUM(i.Kcal) AS Kcal
  FROM ingredients i JOIN user_meal um ON i.user_meal_iduser_meal = um.iduser_meal  
  WHERE um.date = ? AND um.user_data_idlogin_data = ?;`;

const delIngredients = `DELETE FROM ingredients WHERE user_meal_iduser_meal = ?; `;

const delMeal = `DELETE FROM user_meal WHERE iduser_meal = ?;`;

const delUser = `DELETE FROM user_data WHERE idlogin_data = ?;`;

const selectUsers = `SELECT idlogin_data, nick_name, is_admin FROM user_data;`;

const selectAllUserMeal =`SELECT um.name, um.iduser_meal, SUM(i.fat) AS sFat, 
SUM(i.protein) AS sProt, SUM(i.carbohydrates) AS sCarbo, SUM(i.Kcal) AS sKcal
FROM ingredients i JOIN user_meal um ON i.user_meal_iduser_meal = um.iduser_meal
WHERE um.user_data_idlogin_data = ?
GROUP BY um.name, um.iduser_meal;`;

const selectMealId = `SELECT iduser_meal FROM user_meal WHERE user_data_idlogin_data = ?;`
//--------------------------

console.log("Starting server...");

let app = express();

//------ app.use------
app.use(bodyParser.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


//------functions------

app.get("/delUser/:id", async(req,res) =>{
  const id = req.params.id;
  connection.query(delUser,[id], function(err,result){
    if(err){

      const data = "faild delete user";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      res.send({ error: false, data : result});

    }
  })
})

app.get("/getMealsId/:id", async(req,res) =>{

  const id = req.params.id;

  connection.query(selectMealId,[id], function(err,result){
    if(err){

      const data = "faild to insert meal";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      res.send({ error: false, data : result});

    }
  })
})

app.get("/giveAdmin/:id", async(req,res)=>{
  const id = req.params.id;
  connection.query(giveAdmin,[id], function(err,result){
    if(err){

      const data = "faild to insert meal";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      res.send({ error: false, data : result});

    }
  })
})

app.get("/getAllUserMeal/:userId", async(req,res) =>{

  const userId = Number(req.params.userId);

  connection.query(selectAllUserMeal,[userId], function(err,result){
    if(err){

      const data = "faild to insert meal";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      res.send({ error: false, data : result});

    }

  })
})

app.get("/getUsers", async(req,res)=>{

  connection.query(selectUsers, function(err,result){
    if(err){

      const data = "faild to select users";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      const data = result;

      
      res.send({ error: false, data : data});

    }
  })
})

app.get("/delMeal/:mealId", async(req,res) =>{

  const mealId = req.params.mealId;
  connection.query(delIngredients,[mealId], function(err,result){
    if(err){

      console.log(err);
      
      const data = "faild to delete meal";
      res.send({ error: true, data: data });

    } else {
      connection.query(delMeal,[mealId], function(err,result){
        if(err){

          console.log(err);
          
          const data = "faild to delete meal";
          res.send({ error: true, data: data });

        } else {
          
          const data = "succes to delete meal";
          res.send({ error: false, data: data });

        }
      })
    }
  })
})

app.get(
  "/ingredient/:mealId/:ingName/:ingKcal/:ingProtein/:ingCarbo/:ingFat",
  async(req,res) =>{
    
    let ingName = req.params.ingName;
    let ingProtein = req.params.ingProtein;
    let ingFat = req.params.ingFat;
    let ingCarbo = req.params.ingCarbo;
    let ingKcal = req.params.ingKcal;
    let mealId = req.params.mealId;

    connection.query(
      inserIngredient,
      [ingName,ingFat,ingProtein,ingCarbo,ingKcal,mealId], 
      function(err,result){
        if(err){
          const data = "faild to insert meal";
          console.log(err);
          res.send({ error: true, data: data });
          
        } else {
          
          const data = "insert complete";
          res.send({ error: false, data : data});
    
        }
    })
  })

app.get("/meal/:mealName/:userId/:date", async(req,res) =>{

  const userId = Number(req.params.userId);
  const date = req.params.date;
  const name = req.params.mealName;

  connection.query(insertMeal,[name,date,userId], function(err,result){
    if(err){
      const data = "faild to insert meal";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      const data = result.insertId;

      res.send({ error: false, data : data});

    }
  })
})

app.get("/getMeal/:userId/:date", async(req,res) =>{

  const userId = Number(req.params.userId);
  const date = req.params.date;

  connection.query(selectMeal,[date,userId], function(err,result){
    if(err){
      const data = "faild to insert meal";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      res.send({ error: false, data : result});

    }
  })
})

app.get("/getIngDetail/:userId/:date", async(req,res) =>{

  const userId = Number(req.params.userId);
  const date = req.params.date;

  connection.query(getSumFromDay,[date,userId], function(err,result){
    if(err){
      const data = "faild to insert meal";
      console.log(err);
      res.send({ error: true, data: data });
      
    } else {
      
      res.send({ error: false, data : result});

    }
  })
})

app.get("/changeProfilNick/:change/:userId", async(req,res) => {

  const change = req.params.change;
  const userId = Number(req.params.userId);

  connection.query(updateProfilNick,[change,userId],function(err,result){
  if (err) {
    let data = "faild to update data" ;
    console.log(err);
    res.send({ error: true, data: data });
  
  } else {
    let data = "update complete";
    console.log(data);
    res.send({ error: false, data: data });
    }
  })
})
app.get("/changeProfilHeight/:change/:userId", async(req,res) => {

  const change = parseInt(req.params.change,10);
  const userId = Number(req.params.userId);

  connection.query(updateProfilHeight,[change,userId],function(err,result){
  if (err) {
    let data = "faild to update data" ;
    console.log(err);
    res.send({ error: true, data: data });
  
  } else {
    let data = "update complete";
    console.log(data);
    res.send({ error: false, data: data });
    }
  })
})

app.get("/changeProfilWeight/:change/:userId", async(req,res) => {

  const change = parseInt(req.params.change,10);
  const userId = Number(req.params.userId);

  connection.query(updateProfilWeight,[change,userId],function(err,result){
  if (err) {
    let data = "faild to update data" ;
    console.log(err);
    res.send({ error: true, data: data });
  
  } else {
    let data = "update complete";
    console.log(data);
    res.send({ error: false, data: data });
    }
  })
})


app.get("/login/:log/:pass", async (req, res) => {

  let log = req.params.log;
  let pass = sha(req.params.pass);
  

  if(log && pass){
    connection.query(login_ask,[log,pass],function(err,result,fields){
      if(err) {
        let data = "faild to insert data" ;
        res.send({ error: true, id: 0 });
      }
      if(result.length > 0){

        console.log("logging in complete");
        const isAdmin = result[0].is_admin;
        const id = result[0].idlogin_data;
        const height = result[0].high;
        const weight = result[0].weight;
        const nick = result[0].nick_name;
        
        let data = {id: id,isAdmin:isAdmin, 
          height, weight, nick};
          
        console.log(data);
        
        res.json({ error: false, data: data });

      } else {
        console.log("incorrect data");
        let id = 0;
        res.send({ error: false, id: id });
      }

    }) 
  } else {

    console.log("no pass or log");
    res.send({ error: false, data: { to_log : false, id : 0 } });
  }
  
})

app.get("/signup/:log/:pass/:high/:weight", async (req, res) => {

  let log = req.params.log;
  let pass = sha(req.params.pass);
  let high = req.params.high;
  let weight = req.params.weight;

  console.log("signing up");
  
  connection.query(sign_up_ask,[log,pass,high,weight],function(err,result){
    if (err) {
      let data = "faild to insert data" ;
      res.send({ error: true, data: data });
    
    } else {
      let data = "sign up";
      console.log(result);
      res.send({ error: false, data: data });
      }
  })
})

app.listen(4000, () => {
  console.log("Server is listening on port: 4000");
});