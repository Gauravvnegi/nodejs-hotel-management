const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtAuthMiddleware = (req,res,next) => {
    //checking if request header has authorization or not
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ error: "Unauthorized: Authorization header missing" });
    }
    //extracting token from req header
    const token  = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({error:"Unauthorized"});
    }
    // Bearer: This is a type of authentication scheme used to indicate that the token provided is a JWT (or another type of access token).
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({error:"Invalid token"});
    }
}

const generateToken = (userData) => {
    // 
    return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn:"1h"});
}
module.exports = { jwtAuthMiddleware, generateToken };