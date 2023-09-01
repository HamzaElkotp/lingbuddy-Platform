// const express = require('express');
// const dotenv = require('dotenv').config();
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


dotenvConfig();

// // DB models
import { User, Writings, Speakings, WritingMock, SpeakingMock, Meetings, Vitasks, Resourcetasks, Overview } from './dbmodels/index.js';

// const User = require('./dbmodels/usermodel');
// const Writings = require('./dbmodels/writingmodel');
// const Speakings = require('./dbmodels/speakingmodel');
// const WritingMock = require('./dbmodels/writingMockmodel');
// const SpeakingMock = require('./dbmodels/speakingMockmodel');
// const Meetings = require('./dbmodels/meetingsmodel');
// const Vitasks = require('./dbmodels/vitaskmodel');
// const Resourcetasks = require('./dbmodels/resourcetasksmodel');
// const Overview = require('./dbmodels/overviewmodel');


// langchain custom models
// import get_MissGrammared_list from '../langchainmodels/grammarStore.js'
// import find_MissGrammared_list from '../langchainmodels/grammarParsers.js'
// import find_MissWords_list from '../langchainmodels/misswordsParsers.js'


const app = express();

const dbURI = process.env.DB_HOST;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
let port = process.env.PORT || 8080


app.use(express.static(__dirname +'/assets'));
app.use(express.static(__dirname +'/src'));
app.use(express.static(__dirname +'/ieltsApi'));
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

app.get("/test", (req,res,)=>{ 
    res.json({run: true});
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



// app.get("/most-recent-report/:email", async(req,res)=>{ 

// })


async function getLastWriteReport(email){
    const mostRecentDocument = await Writings.findOne({ email })
    .sort({ createdAt: -1 })
    .exec();

    return mostRecentDocument;
}

app.get("/get-new-overflow-study-data/:email", async(req,res)=>{ 
    try{
        const email = req.params.email;
        const overview = await Overview.findOne({ email });
        let report = null;
        async function getNewUpdate(email){
            report = await getLastWriteReport(email);
            if(report == null){
                return "Error"
            }
    
            let grammarsList = await find_MissGrammared_list(report.answer); 
            let missSpilledList = await find_MissWords_list(report.answer); 
            if(Array.isArray(grammarsList) && Array.isArray(missSpilledList)){
                let updateObj = { grammer: grammarsList, misspelling: missSpilledList};
                let filterObj = { email };
                console.log(updateObj)
        
                let doc = await Overview.findOneAndUpdate(filterObj, updateObj);
            } else {
                return "Error"
            }
        }
    
        // Check If passed 7 days
        let today = new Date();
        let lastDate = new Date(overview.updatedAt);
        let numberOfdays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
        if(numberOfdays > 7){
            let updateOverview = await getNewUpdate(email);
            if(updateOverview == "Error"){
                res.json({success: false})
            } else{
                const overview = await Overview.findOne({ email });
                res.json(overview)
            }
        } else {
            if(overview.grammer.length == 0 && overview.misspelling.length == 0){
                let updateOverview = await getNewUpdate(email);
                if(updateOverview == "Error"){
                    res.json({success: false})
                } else{
                    const overview = await Overview.findOne({ email });
                    res.json(overview)
                }
            } else{
                res.json(overview)
            }
        }
    } catch(e){
        
    }

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
            if(userRegister.accountType == "student"){
                const initOverview = new Overview({
                    email: userRegister.email
                })
                initOverview.save();
                res.json({ exists: false })
            }
            else{
                res.json({ exists: false })
            }
        })
    } else {
        res.json({ exists: true })
    }
})



const apikey = process.env.OPENAI_API_KEY

app.post("/callChatGPT", async(req,res)=>{ 
    const command = await req.body;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apikey}`,
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


app.listen(port);
// export default app