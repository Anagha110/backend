const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrpt= require("bcrypt");
const BodyParser=require("body-parser");
const jwt = require('jsonwebtoken');


const app = new express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

//import model file
const EmpData = require("./model/EmpData");
const userModel=require("./model/users");
const path = require("path");
app.use(express.static(path.join(__dirname + "/build")));
// Task2: create mongoDB connection

mongoose.connect(
  "mongodb+srv://Anagha:anagha110@cluster0.p9jvv4r.mongodb.net/EmployeeData?retryWrites=true&w=majority"
);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below




//signin api


app.post("/api/signin",(req,res)=>{
  var getEmail=req.body.email
    var password=req.body.password

    let result=userModel.find({email:getEmail},(err,data)=>{

        if(data.length>0){
            const passwordValidator=bcrpt.compareSync(password,data[0].password)
            if(passwordValidator){

                jwt.sign({email:getEmail,id:data[0]._id},"ictacademy",{expiresIn:"1d"},
                
                (err,token)=>{
                    if (err) {
                        res.json({"status":"error","error":err})

                    } else {
                        res.json({"status":"success","data":data,"token":token})
                        
                    }

                })

                

            }
            else{
                res.json({"status":"failed","data":"invalid password"})

            }

        }

        else{
            res.json({"status":"failed","data":"invalid email id"})

        }

    })


})

//signup api
app.post("/api/signup",async(req,res)=>{

  console.log(req.body)
  let data = new userModel({ name: req.body.name, 
      email: req.body.email,
       password: bcrpt.hashSync(req.body.password,10) })
  console.log(data)
  await data.save()


  res.json({"status":"success","data":data})

})



app.post("/signup",(req,res)=>{
  res.send("Signup working");
})




//TODO: get data from db  using api '/api/employeelist'
app.get("/api/employeelist", async (req, res) => {
  try {
    const data = await EmpData.find();
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//TODO: get single data from db  using api '/api/employeelist/:id'

app.get("/api/employeelist/:id", async (req, res) => {
  try {
    const datas = await EmpData.findById(req.params.id);
    res.send(datas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post("/api/employeelist", async (req, res) => {
  const data = new EmpData({
    name: req.body.name,
    location: req.body.location,
    position: req.body.position,
    salary: req.body.salary,
  });
  try {
    const Data = await data.save();
    res.status(200).json(Data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete("/api/employeelist/:id", async (req, res) => {
  try {
    var id = req.params.id;
    var data = req.body;
    const result = await EmpData.findOneAndDelete({ _id: id }, data);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put("/api/employeelist", (req, res) => {
  var name = req.body.name;
  var data = req.body;
  EmpData.findOneAndUpdate({ name: name }, data, (err, data) => {
    if (err) {
      res.json({ status: "error", error: err });
    } else {
      res.json({ status: "updated", data: data });
    }
  });
});
//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(3004, () => {
  console.log("server listening to port 3004");
});
