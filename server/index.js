const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
const session=require('express-session');
const mysql=require('mysql2');
var path = require('path');
require('dotenv').config({path:'.././.env'});


app.use(express.static(path.join(__dirname, '../')))

app.use(express.urlencoded({extended:true}))
app.use(session({secret:'asecret' }));

// console.log(process.env.HOST,process.env.MYSQL_USER,process.env.PASSWORD,process.env.DATABASE);
const db = mysql.createConnection({
    // host:process.env.HOST,
    // user:process.env.MYSQL_USER,
    // password:process.env.PASSWORD,
    // database:process.env.DATABASE
    host:'localhost',
    user:'root',
    password:'rootpass',
    database:'toptrove'
})//fill it up

db.connect(function(err) {
if (err) {
    return console.error('error: ' + err.message);
}
console.log('Connected to the MySQL server.');
})


//home page routes
// app.get("/",(req,res)=>
// {
//     // path.join(__dirname, '/index.html')
// //   res.sendFile("../login.html",{root:__dirname});
// //   res.sendFile(__dirname+'/../index.html');
// //   res.sendFile(path.resolve('../index.html'));
//   res.sendFile('register.html');

// });


app.get("/login",(req,res)=>
{
  res.sendFile('login.html',{root:__dirname+'/../'});
});


app.get("/register",(req,res)=>
{
    //   res.sendFile("../register.html",{root:__dirname});
      res.sendFile('register.html',{root:__dirname+'/../'});
});


app.get("/aboutus",(req,res)=>
{
    res.sendFile('aboutus.html',{root:__dirname+'/../'});
});

app.get("/achievement",(req,res)=>
{
      res.sendFile('achievement.html',{root:__dirname+'/../'});
});

app.post('/register',async(req,res)=>{

    const {username,password}=req.body;
    const hash=await bcrypt.hash(password,12);

    const values=[username,hash];
    const query="INSERT INTO auth(`user_name`,`user_password`) values (?,?)"//change the table name,column name as per requirement
    db.query(query,values,(err,result)=>{
        if(err)
        {
            console.log(err);
            res.send(err);
        }
        console.log('insert result:',result);
    })


    const query2="SELECT id from auth where user_name=?"//change the table name,column name as per requirement

    db.query(query2,username,(err,result)=>{
        if(err)
        {
            console.log(err);
            res.send(err);
            // return err;
        }
        // req.session.user_id=result[0].id;
        // return result[0].id;
    })
    req.session.user_id=1;
    // console.log('reg:',req.session.user_id);
    res.sendStatus(200);
})


app.post('/login',async(req,res)=>{
    const {username,password}=req.body;

    const query2="SELECT id,user_password from auth where user_name=?"//change the table name,column name as per requirement

    db.query(query2,username,async (err,result)=>{
        if(err)
        {
            console.log(err);
            res.sendStatus(404);
        }


        var userId=result[0].id || 0;
        var passwordhash=result[0].user_password || "";

        if(!userId){
            res.send('WRONG USERNAME OR PASSWORD');
        }
        else{
            const validuser=await bcrypt.compare(password,passwordhash);
            if(validuser)
            {
                req.session.user_id=userId;
                // res.redirect('/secret');
                res.sendStatus(200);
            }
            else{
                res.sendStatus(400);
                // res.send('WRONG USERNAME OR PASSWORD');
            }
        }
    })


})

app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    // res.redirect('/login');
    res.sendStatus(200);
})

app.get('/dashboard',(req,res)=>{
    console.log("dash",req.session.user_id);
    if(!req.session.user_id){
        res.sendStatus(400);
    }
    else{

        // res.sendStatus(200);
    }
})

app.listen(8888,()=>{
    console.log('SESSION HEARING..');
})