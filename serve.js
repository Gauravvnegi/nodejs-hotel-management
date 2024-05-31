const express = require('express');
const db = require('./db')
const Person = require('./models/Person');
// const MenuItem = require('./models/MenuItem');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


const app = express();
//body parser
const bodyParse = require('body-parser');
app.use(bodyParse.json());//req.body



//middleWare
app.use((req,res,next)=>{
    console.log(`${new Date()}  requested mode to : ${req.originalUrl}`)
    next();
})

//Initialization passport route
app.use(passport.initialize());


passport.use(new LocalStrategy(async (USERNAME , PASSWORD ,done)=>{
    try{
        console.log("Receive credential : " , USERNAME , PASSWORD);
        const user = await Person.findOne({username:USERNAME});
        if(!user){
            return done(null , false , {message : "Incorrect username : "});
        }
        const isPassWord = user.password ==PASSWORD ? true : false;
        if(isPassWord){
            return done(null,user);
        }
        else{
            return done(null , false  ,{message : "Incorrect password : "});
        }
    }catch(Err){
        return done(err);
    }
}));

app.get('/',passport.authenticate('local',{session:false}), function(req,res){
    res.send("Hello, world!");
})

//Routes


const personRoutes = require('./router/personRoutes')
const menuRoutes = require('./router/menuRoutes')

//Router using
app.use('/person',personRoutes)
app.use('/menu',menuRoutes);



app.listen(3000 , ()=>{
    console.log("Connected to server on port 3000")
})




//save is not longer takes callback
// app.post('/person',(req,res)=>{
//     const data = req.body; //assuming the rq body containts the person data
//     const newPerson = new Person()

//     //save the new person to the database
//     newPerson.save((error, person)=>{
//         if(error){
//             console.log('eror saving person :')
//             res.staus(500).json({eror:'Internal Server Error'});
//         }
//         else{
//             res.status(200).json({eror:'Success'});
//         }      
//     })
// })