const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const fetch = require('node-fetch');

// DB models
const User = require('./dbmodels/usermodel');
const Writings = require('./dbmodels/writingmodel');
const Speakings = require('./dbmodels/speakingmodel');
const WritingMock = require('./dbmodels/writingMockmodel');
const SpeakingMock = require('./dbmodels/speakingMockmodel');
const Meetings = require('./dbmodels/meetingsmodel');
const Vitasks = require('./dbmodels/vitaskmodel');
const Resourcetasks = require('./dbmodels/resourcetasksmodel');

const app = express();

const dbURI = process.env.DB_HOST;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});


app.set('view engine', 'ejs');
app.listen(5500);


app.use(express.static('assets'));
app.use(express.static('src'));
app.use(express.static('ieltsApi'));
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

app.get("/student", (req,res)=>{ 
    res.render(`student/`);
})
app.get("/student/learn", (req,res)=>{ 
    res.render(`student/learn`);
})
app.get("/student/learn/writing-part-one", (req,res)=>{ 
    res.render(`student/learn/writingPart1`);
})
app.get("/student/learn/writing-part-two", (req,res)=>{ 
    res.render(`student/learn/writingPart2`);
})
app.post("/student/getmeetings", async(req,res)=>{
    let studentEmail = await req.body;

    const allMeetings = await Meetings.find({studentEmail: studentEmail.semail});
    res.json(allMeetings)
})
app.post("/student/vocabs-idioms-task", async(req,res)=>{
    let studentEmail = await req.body;

    const allviTasks = await Vitasks.find({target: studentEmail.semail});
    res.json(allviTasks)
})
app.post("/student/resources-task", async(req,res)=>{
    let studentEmail = await req.body;

    const allresourcetasks = await Resourcetasks.find({target: studentEmail.semail});
    res.json(allresourcetasks)
})

app.get("/student/mytasks/vi/:id/save", async(req,res)=>{
    const id = req.params.id;
    let updateObj = { answered: "true" };

    let doc = await Vitasks.findOneAndUpdate({_id: id}, updateObj);
    res.json({success: true})
})
app.get("/student/mytasks/vi/:id", async(req,res)=>{
    const id = req.params.id;
    
    const responseData = await Vitasks.findOne({_id: id});
    res.render('student/mytasks/vitask', { responseData })
})

app.get("/student/mytasks/re/:id/save", async(req,res)=>{
    const id = req.params.id;
    let updateObj = { answered: "true" };

    let doc = await Resourcetasks.findOneAndUpdate({_id: id}, updateObj);
    res.json({success: true})
})
app.get("/student/mytasks/re/:id", async(req,res)=>{
    const id = req.params.id;
    
    const responseData = await Resourcetasks.findOne({_id: id});
    res.render('student/mytasks/resourcetask', { responseData })
})






app.get("/student/reports/:email", async(req,res)=>{ 
    const email = req.params.email;
    const userData = await User.findOne({email});
    if(userData){
        const writingReports = await Writings.find({email})
        const writingMockReports = await WritingMock.find({email})

        const jsonResponse = {
            writingReports,
            writingMockReports
        };
        res.render(`student/reports`, { jsonResponse });
    } else{
        res.redirect('../')
    }
})

app.post("/student/reports/new-writing-report", async(req,res)=>{ 
    let reportData = await req.body;

    let newReport = new Writings(reportData)
    newReport.save()
})




app.get("/student/roadmap", (req,res)=>{ 
    res.render(`student/roadmap`);
})











app.get("/teacher", (req,res)=>{ 
    res.render(`teacher/`);
})
app.get("/teacher/meetings", (req,res)=>{ 
    res.render(`teacher/meetings`);
})


app.post("/teacher/getStudents", async(req,res)=>{ 
    let userLogin = await req.body;
    const teacher = await User.findOne({ email: userLogin.email });

    res.json(teacher);
})


app.post("/teacher/getmeetings", async(req,res)=>{
    let teacherEmail = await req.body;

    const allMeetings = await Meetings.find({teacherEmail: teacherEmail.temail});
    res.json(allMeetings)
})
app.post("/teacher/newMeeting", async(req,res)=>{
    let meetingData = await req.body;

    const newMeeting = new Meetings(meetingData)
    newMeeting.save()
    res.json({success: true})
})

app.post("/teacher/addStudent", async(req,res)=>{ 
    let data = await req.body;
    const student = await User.findOne({ email: data.semail });
    if (student) {
        let newList = data.allStudentsList;
        newList.push(`{"email": "${student.email}", "firstName": "${student.firstName}", "lastName": "${student.lastName}"}`)

        let updateObj = { students: newList };
        let filterObj = { email: data.temail };

        let doc = await User.findOneAndUpdate(filterObj, updateObj);

        res.json(student);
    }
    else {
        res.json({not: true});
    }
})
app.post("/teacher/removeStudent", async(req,res)=>{ 
    let data = await req.body;
    const student = await User.findOne({ email: data.semail });
    let newList = data.allStudentsList;
    let student2Rmv = {
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName
    }
    let jsonSt = JSON.stringify(student2Rmv);
    newList.splice(newList.indexOf(jsonSt), 1)
    let updateObj = { students: newList };
    let filterObj = { email: data.temail };

    let doc = await User.findOneAndUpdate(filterObj, updateObj);

    res.json(student2Rmv);
})













app.get("/teacher/control", async(req,res)=>{
    res.render(`teacher/control`);
})
app.get("/teacher/control/:email", async(req,res)=>{ 
    const email = req.params.email;
    const userData = await User.findOne({email});
    if(userData){
        const writingReports = await Writings.find({email})
        const writingMockReports = await WritingMock.find({email})

        const jsonResponse = {
            userData,
            writingReports,
            writingMockReports
        };
        res.render(`teacher/control`, { jsonResponse });
    } else{
        res.redirect('../')
    }
})
app.post("/teacher/control/saveWriteReport", async(req,res)=>{
    let data = await req.body;
    let updateObj = { teacherfeedback: data.teacherfeedback };
    let filterObj = { _id: data.id };

    let doc = await Writings.findOneAndUpdate(filterObj, updateObj);
    res.json({success: true})
})
app.post("/teacher/control/saveWriteMockReport", async(req,res)=>{
    let data = await req.body;
    let updateObj = { teacherfeedback: data.teacherfeedback };
    let filterObj = { _id: data.id };

    let doc = await WritingMock.findOneAndUpdate(filterObj, updateObj);
    res.json({success: true})
})


app.get("/teacher/tasks/newtask", async(req,res)=>{
    res.render(`teacher/newtask`);
})
app.post("/teacher/newtask/new-vocabs-idioms-task", async(req,res)=>{ 
    const data = await req.body;
    const newTask = new Vitasks({
        temail: data.temail,
        number: data.number,
        taskname: data.taskname,
        target: data.target,
        content: data.taskContent,
        answered: false
    })
    await newTask.save();
    res.json({success: true})
})
app.post("/teacher/newtask/new-resource-task", async(req,res)=>{ 
    const data = await req.body;
    const newTask = new Resourcetasks({
        temail: data.temail,
        taskname: data.taskname,
        target: data.target,
        content: data.taskContent,
        answered: false
    })
    await newTask.save();
    res.json({success: true})
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





app.post("/callChatGPT", async(req,res)=>{ 
    const command = await req.body;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "system", content: `${command.command}`}],
        }),
    });

    const responseData = await response.json();
    res.json(responseData)
})
