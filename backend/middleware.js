const { decode } = require("punycode");
const {JWT_SECRET} =require("./config")

const jwt = require("jsonwebtoken")


const authrization = (req,res,next)=>{

    const authheader = req.headers.authorization;

    

    if(!authheader || !authheader.startsWith("Bearer"))
    {
        return res.status(403).json({"msg":"not a authrize user"});

    }

    const token = authheader.split(' ')[1];

    // console.log(authheader);
   

    // verify token

    try{
        const decodeusertoken=  jwt.verify(token,JWT_SECRET);

        // console.log(decodeusertoken)

        req.userId= decodeusertoken.userId;
        next();
        


    }
    catch(e){
        return res.status(403).json({"msg":"token is not valid"})

    }

}

module.exports = {authrization}