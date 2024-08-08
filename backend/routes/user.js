const express = require('express');
const router = express.Router();
const zod = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db'); // Ensure the correct path to your db module
const {authrization} = require("../middleware")
const { JWT_SECRET } = require("../config");




// console.log("user routes mehu")

const validUserDetail = zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()


})


router.get('/isSignedIn', (req, res) => {
    const authHeader = req.headers.authorization; // Corrected the way to access the header

    // console.log(authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ msg: "Not an authorized user" });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    try {
        const decodedUserToken = jwt.verify(token, JWT_SECRET);
        // console.log("isSigned");
        // console.log(decodedUserToken);
        return res.status(200).json({ msg: "Authorized" }); // Send a JSON response
       
    } catch (e) {
        console.error(e);
        return res.status(403).json({ msg: "Not an authorized user" });
    }
});



router.post("/signup", async (req, res) => {
    try {
        const { success, error } = validUserDetail.safeParse(req.body);

        if (!success) {
            return res.status(400).json({ msg: "Invalid details", error });
        }

        const userExist = await User.findOne({ username: req.body.username });

        if (userExist) {
            return res.status(409).json({ msg: "Email already taken" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        const userId = newUser._id;

        await Account.create({
            userId: userId,
            balance: 1 + Math.random() * 10000
        });

        const token = jwt.sign({ userId: userId }, JWT_SECRET);

        // console.log("token during signup");
        // console.log(token);


        return res.status(201).json({
            msg: "Signup successful",
            token: token
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: "Internal server error",
            error: e.message
        });
    }
});

module.exports = router;


const signinDataValidator = zod.object({
    username:zod.string().email(),
    password:zod.string()

})


router.post("/signin", async(req,res)=>{


    const {success} = signinDataValidator.safeParse(req.body);

    if(!success)
        return res.status(411).json({msg:"wrong input"});

    const hashedPassword = await bcrypt.hash(req.body.password, 10);


      const user = User.findOne({username:req.body.username,
        password:hashedPassword})

    if(!user)
    {
        return res.status(411).json({msg:"invalid username or password"});
    }

    if( user)
    {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        // console.log("token during signin");
        // console.log(token);


        return res.status(200).json({token:token,
            msg:"signin sucessfull"
        })
    }
    


    return res.status(411).json({msg:"signin unsucessfull"});



    
})



const updatedetailvalidator = zod.object({
    password:zod.string.optional,
    firstName:zod.string.optional,
    lastName:zod.string.optional,

})


//update profile

router.put("/update", authrization ,async(req,res)=>{

    const {sucess} = updatedetailvalidator.safeParse(req.body);

    if(!sucess)
    {
         res.status(411).json({msg:"error while updating info"});
    }

    await User.updateOne(req.body,{id : req.userId})

    res.json({
        msg:"data update sucessfully"
    })
    
})



// serching in db

router.get("/bulk",authrization,async(req,res)=>{

    const filter = req.query.filter||"";

    const user = await User.find({
        $or:[
            {
                firstName:{
                    "$regex":filter
                }

            },
            {
                lastName:{
                    "$regex":filter
                }

            }
        ]
    })
    // console.log(req.userId)

    const filtereduser = user.filter((u)=>{
         return u._id.toString()!==req.userId.toString();
    })

    // console.log(filtereduser.toString());
    // console.log("filtereduser.toString()");

    res.json({
        user:filtereduser.map((user)=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })



})



module.exports = router;