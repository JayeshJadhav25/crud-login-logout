const express=require('express');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const path=require('path');
const mongoose=require('mongoose');

const UserRouter=require('./router/UserRouter');


const app=express();
const port=process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}))

//Handlebars setup
app.use(express.static('public'));

app.engine('handlebars',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname,'views/mainLayout')
}));
app.set('view engine','handlebars');

//Checking database is connected or not
mongoose.connect('mongodb://localhost/witsy',{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(()=>console.log("Database is connected"))
    .catch(err=>console.log("Could not connected to database"));


//User Router
app.use('/',UserRouter);

app.listen(port,()=>console.log(`server running on port ${port} `))