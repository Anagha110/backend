const Mongoose=require('mongoose')



const userSchema=Mongoose.Schema(

    {

        name:String,

        email:String,

        password:String

    }
)
var userModel=Mongoose.model("users",userSchema)

module.exports=userModel