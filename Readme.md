#Tips before starting the server
run this in command line: 
                        cd server
                        npm init -y
                        npm i
                        npm i bcrypt express cors dotenv express-session mysql2 path

#to run the server:
cd server
node index.js or nodemon index.js



#things to note for developers:
1.While registering the user the first name and last name is not stored in database, just username and password is used.
Developers could further enchance by adding  this username and password to database and use it.
2.In further development when a user adds new route ex: dashboard2.html in one of existing pages, it cannot navigate to the new page
that is 'dashboard2.html', since there is only navigation which has end points in node js .
So therefore add an endpoint in node js  using express js, to get this html file rendered for a particular route,
ex:

in html:

    <a href="/dashboard2">
    <span>NEW DASHBOARD</span>
    </a>


in node js add this route :

    app.get("/dashboard2",(req,res)=>
    {
        res.sendFile('dashboard2.html',{root:__dirname+'/../client/pages'});
    });
.