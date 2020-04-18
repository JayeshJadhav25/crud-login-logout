const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const User=require('../models/User');
const Student=require('../models/Student');


router.use(cookieParser());

//middleware
const redirectLogin=(req,res,next)=>{
    if(req.cookies.cookie1){
        next();
    }
    else{
        res.render('login',{title:'login',style:'style.css'});
    }
}



//Getting the login form in handlebar template
router.get('/',(req,res)=>{
    res.render('login',{style: 'style.css' ,title: 'Login'});
});

//Getting the register form in handlebar template
router.get('/register',(req,res)=>{
    res.render('register',{style: 'style.css',title:'Registration'});
});

//route for registration
router.post('/registration',(req,res)=>{

    const userData={
        name: req.body.na,
        email:req.body.email,
        password:req.body.pw
    }
    //checking email is already register or not
    User.findOne({
        email:req.body.email
    })
    .then(user=>{
        if(!user){
                    User.create(userData)
                    .then(user=>{
                        res.render('login',{msg: "Succesfully Register",style: 'style.css'});
                    })
                    .catch(err=>{
                        res.json(err);
                    })
        } else {
            res.json({error:"User already exist"});
        }
    })
    .catch(err=>{
        res.send('cannot post user');
    })
})


//route for login
router.post('/login',(req,res)=>{

    User.findOne({
        email:req.body.email
    })
    .then(user=> {
        if(user){
            if(req.body.pw==user.password){
                const payload = {
                    _id: user._id,
                    name : user.name,
                    email: user.email
                  }
                  let token = jwt.sign(payload,'secreat', {
                    expiresIn: '1h'
                  })
                    res.cookie('cookie1',user.email);
                  res.render('navbar',{title: 'dashboard', style:'navbar.css'});
            }else{
                res.json({ error: 'User does not exist' })
            }
        }
        else{
            res.json({ error: 'User Email does not exist' })
        }
    })
    .catch(err=>{
        res.send(err);
    })

})

router.get('/student',redirectLogin,(req,res)=>{
    res.render('student',{title: 'Add Student',style: 'student.css'})
})

//api for student creation
router.post('/insertstudent',redirectLogin,(req,res)=>{
    const studentData={
        name: req.body.na,
        Qualification: req.body.quali,
        email:req.body.email,
        city:req.body.city
    }
    Student.findOne({
        email:req.body.email
    })
    .then(stud=>{
        if(!stud){
                    Student.create(studentData)
                    .then(user=>{
                        res.redirect('/viewstudent');
                    })
                    .catch(err=>{
                        res.json(err);
                    })
        } else {
            res.json({error:"Student email already exist"});
        }
    })
    .catch(err=>{
        res.send('cannot add student');
    })

})

//this api read all student from database
router.get('/viewstudent',redirectLogin,(req,res)=>{
    Student.find((err,results)=>{
        if(err){
            res.send(err);
        }
        else{
            res.render('list',{ result : results,style:'nav1.css'});
        }
    })
})

router.get('/student/:id',redirectLogin,(req,res)=>{
    Student.findById(req.params.id,(err,result)=>{
        if(!err){
            res.render('update',{student:result})
        }    
    })
})

router.post('/updatestudent',redirectLogin,(req,res)=>{
    updateStud(req,res);
})

//function for update student
async function updateStud(req,res) {
    var id=req.body._id;

    const stud=await Student.findById(id);

    if(!stud){
        return ;
    }
        
            stud.name = req.body.na;
            stud.Qualification = req.body.quali;
            stud.email = req.body.email;
            stud.city = req.body.city;
        

    const result=await stud.save();
    res.redirect('/viewstudent');

}

//api for delete
router.get('/delete/:id',redirectLogin,(req,res)=>{
    Student.findByIdAndRemove(req.params.id,(err,result)=>{
        if(!err){
            res.redirect('/viewstudent');
        }else{
            console.log("Error");
        }
    })
})

//api for logout
router.get('/logout',(req,res)=>{
    res.clearCookie('cookie1');
    res.render('login',{title:"login",style:'style.css'});
})

module.exports=router;