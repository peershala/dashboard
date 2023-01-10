require('dotenv').config();
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const mysql=require("mysql2");

const pool=mysql.createPool({
    connectionLimit:2,
    host:process.env.HOST,
    user:process.env.MYSQL_USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}).promise();   //.promise() allows us to use promises




//MIDDLEWARES
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));


//REQUEST HANDLERS

app.get("/",(req,res)=>
{
    res.sendFile("index.html",{root:__dirname});
});


//home page routes

app.get("/login",(req,res)=>
{
  res.sendFile("login.html",{root:__dirname});
});


app.get("/register",(req,res)=>
{
      res.sendFile("register.html",{root:__dirname});
});

app.get("/aboutus",(req,res)=>
{
      res.sendFile("aboutus.html",{root:__dirname});
});

app.get("/achievement",(req,res)=>
{
      res.sendFile("achievement.html",{root:__dirname});
});

app.post("/api/register",async (req,res)=>
{
  try{
  var result=await pool.query("insert into users(first_name,last_name,email,password) values(?,?,?,?)",[req.body.firstName,req.body.lastName,req.body.email,req.body.password]);
  res.redirect("/login");
  }
  catch(err)
  {
    console.log(err);
    res.redirect("/register");
  }
     
});


app.post("/api/login",async (req,res)=>
{
  try{

  var result=await pool.query("select * from users where email=? and password=?",[req.body.email,req.body.password]);
    if(result[0].length==0)
       res.redirect("/login");
    else
        res.redirect("/");

  }
  catch(err)
  {
  //  console.log(err);
   res.redirect("/login");
  }

});



app.listen(8000,(error)=>
{
    if(error)
    //  console.log(error);
    console.log("Server running")
})