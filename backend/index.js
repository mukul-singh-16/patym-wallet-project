const express= require('express');
const app= express();
const cors= require('cors');
const mongoose  = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/myapp');



app.get('/',(req,res)=>{
    res.json({"msg":"hey there!!!"})
})



const routes= require("./routes/index");

app.use("/api/v1",routes);




app.listen(3000,(req,res)=>{
    console.log("server start");
})