const mongoose=require('mongoose');

const StudentSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    Qualification:{
        type:String,
        required:true
    },
    email :{
        type: String,
        required : true
    },
    city:{
        type:String,
        required:true
    }
})

const Student=mongoose.model('students',StudentSchema);

module.exports=Student;