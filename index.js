require('dotenv').config();
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const mysql=require("mysql2");
const path=require("path");
const session=require("express-session");
const pool=mysql.createPool({
    connectionLimit:2,
    host:process.env.HOST,
    user:process.env.MYSQL_USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}).promise();   //.promise() allows us to use promises




//MIDDLEWARES

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret:"bahubali",
  saveUninitialized:false,
  resave:false,
  cookie:{httpOnly:false},
}));

app.use((req,res,next)=>
{
  if((req.url==="/" || req.url=="/index.html") && typeof req.session.authenticated==='undefined')
  {
       res.redirect("/login")   ;
  }
  else if((req.url==="/achievement.html" || req.url==="/aboutus.html") && typeof req.session.authenticated==='undefined')
  {
       res.status(404).sendFile("404.html",{root:__dirname})
  }
  else
   next();
})

app.use(express.static(path.join(__dirname)));






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
  console.log(result[0].length);
  req.session["authenticated"]="yes";
    if(result[0].length===0)
       res.redirect("/login");
    else
        res.redirect("/");

  }
  catch(err)
  {
 
   res.redirect("/login");
  }

});

app.use((req, res, next) => {
  res.status(404).sendFile("404.html",{root:__dirname})
});

app.listen(8000,(error)=>
{
    console.log("Server running");
})