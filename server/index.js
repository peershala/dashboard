const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
const session=require('express-session');
const mysql=require('mysql2');
const path = require('path');
const cors=require('cors')
require('dotenv').config({path:'.././.env'});


app.use(express.static(path.join(__dirname, '../client')))
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(session({secret:'asecret' }));

app.use((req,res,next)=>{
    console.log(req.body,req.sessionID);
    next();
})

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
app.get("/",(req,res)=>
{

  res.sendFile('register.html',{root:__dirname+'/../client'});

});


app.get("/login",(req,res)=>
{
  res.sendFile('login.html',{root:__dirname+'/../client'});
});


app.get("/register",(req,res)=>
{
    res.sendFile('register.html',{root:__dirname+'/../client'});
});


app.get("/aboutus",(req,res)=>
{
    res.sendFile('aboutus.html',{root:__dirname+'/../client'});
});

app.get("/achievement",(req,res)=>
{
      res.sendFile('achievement.html',{root:__dirname+'/../client'});
});

app.post('/register',async(req,res)=>{

    const {username,password}=req.body;
    const hash=await bcrypt.hash(password,12);

    const query2="SELECT id from auth where user_name=?"//change the table name,column name as per requirement

    db.query(query2,username,(err,result)=>{
        if(err)
        {
            console.log(err);
            res.send(err);
            // return err;
        }
        if(result.length!=0)
        {
            console.log('Username already exists');
            res.redirect('/register');
        }
        else{
            const values=[username,hash];

            const query="INSERT INTO auth(`user_name`,`user_password`) values (?,?)"//change the table name,column name as per requirement
            db.query(query,values,(err,result)=>{
                if(err)
                {
                    console.log(err);
                    res.redirect('/register')
                }
                console.log('Account created for ',username);
                res.redirect('/login')
            })
        }
    })
})


app.post('/login',async(req,res)=>{
    const {username,password}=req.body;

    const query2="SELECT id,user_password from auth where user_name=?"//change the table name,column name as per requirement

    db.query(query2,username,async (err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/login');
            // res.sendStatus(404);
        }

        if(result.length==0)
        {
            console.log('WRONG USERNAME OR PASSWORD');
            res.redirect('/login')
        }
        else{
            var userId=result[0].id || 0;
            var passwordhash=result[0].user_password || "";
                const validuser=await bcrypt.compare(password,passwordhash);
                if(validuser)
                {
                    req.session.user_id=userId;
                    console.log('innn valid');
                    res.redirect('/dashboard')
                }
                else{
                    console.log('WRONG USERNAME OR PASSWORD');
                    res.redirect('/login')
                }
            }
        }
    )
});

app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    console.log('LOGGED OUT SUCCESSFULLY');
    res.redirect('/login');
})

app.get('/dashboard',(req,res)=>{
    console.log('asking permision..');
    if(!req.session.user_id){
        console.log('NOT LOGGED IN');
        res.redirect('/login');
    }
    else{

        res.sendFile('dashboard.html',{root:__dirname+'/../client/'})
    }
})

app.get('*',(req,res)=>{
    res.redirect('/login');
})

app.listen(8880,()=>{
    console.log('SESSION HEARING..');
})