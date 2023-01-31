const mongoose=require("mongoose");
const Schema=mongoose.Schema({
name:String,
location:String,
position:String,
salary:Number
})
const EmpData=mongoose.model("testdata",Schema);
module.exports=EmpData;