
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Person = require('./models/Person');
passport.use(new LocalStrategy(async (USERNAME , PASSWORD ,done)=>{
    try{
        // console.log("Receive credential : " , USERNAME , PASSWORD);
        const user = await Person.findOne({username:USERNAME});
        if(!user){
            return done(null , false , {message : "Incorrect username : "});
        }
        // const isPassWord = user.password ==PASSWORD ? true : false;
        const isPassWord = await user.comparePassword(PASSWORD);
        if(isPassWord){
            return done(null,user);
        }
        else{
            return done(null , false  ,{message : "Incorrect password : "});
        }
    }catch(err){
        return done(err);
    }
}));

module.exports = passport;