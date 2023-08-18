const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const User = require('./dbmodels/usemodel');

const app = express();

const dbURI = process.env.DB_HOST;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});


app.set('view engine', 'ejs');
app.listen(5500);


app.use(express.static('assets'));
app.use(express.static('src'));
app.use(bodyParser.json());


async function checkUserData(userLoginData) {
    const userExists = await User.findOne({ email: userLoginData.email });
    if (userExists) {
        if(userExists.password == String((userLoginData.password))){
            return { user: userExists };
        } else{
            return { pass: false };
        }
    } else {
        return { exists: false };
    }
}


app.get("/", (req,res,)=>{ 
    res.render(`index`);
})

app.post('/checkUser', async (req, res) => {
    let userLogin = await req.body;
    let result = await checkUserData(userLogin);

    if(result.exists == false || result.pass == false){
        res.json({logged:false});
    }else{
        res.json({logged:true});
    }
});

app.get("/learn", (req,res)=>{ 
    res.render(`learn`);
})

app.get("/student", (req,res)=>{ 
    res.render(`student/`);
})
app.get("/teacher", (req,res)=>{ 
    res.render(`student/`);
})



app.get("/reports", (req,res,)=>{ 
    res.render(`reports`);
})
app.get("/roadmap", (req,res,)=>{ 
    res.render(`roadmap`);
})

app.get("/login", (req,res,)=>{ 
    res.render(`login`);
})
app.post("/api/login", async(req,res)=>{ 
    let userLogin = await req.body;
    let result = await checkUserData(userLogin);
    res.json(result)
})

app.get("/register", (req,res,)=>{ 
    res.render(`register`);
})
app.post("/api/register", async(req,res)=>{ 
    const userRegister = await req.body;

    const userExists = await User.findOne({ email: userRegister.email });
    if (!userExists) {
        const newUser = new User({
            firstName: userRegister.firstName,
            lastName: userRegister.lastName,
            email: userRegister.email,
            password: userRegister.password,
            accountType: userRegister.accountType
        })
        newUser.save()
        .then((result)=>{
            res.json({ exists: false })
        })
    } else {
        res.json({ exists: true })
    }
})






