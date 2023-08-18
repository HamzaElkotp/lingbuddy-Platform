/////////////////////////////////////////// Main Functions
const date = new Date();
const currentDateFormated = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,0)}-${String(date.getDate() - 1).padStart(2,0)}`

// Function to call ChatGPT API
const getChatGPT = async function(fun, fullMsg){
    async function fetchAPI(){
        const response = await fetch("https://api.openai.com/v1/chat/completions",{
            method: "POST",
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "system", content: `${fullMsg}`}],
            }),
        });

        if(!response.ok){ return false}
        return await response.json();
    }
    fetchAPI()
    .then((response)=>{
        if(response != false){
            fun(response)
        }
    })
}


// Check Min words numbers for textbox & countiong them
const checkMinLimit = function(input){
    if(input.value.trim().split("\n").join(" ").replaceAll(/\s{2,}/g," ").split(" ").length >= Number(wordsnum.getAttribute('miner'))){
        return true
    }
}
const countWords = function(e){
    let words = e.target.value.trim().split("\n").join(" ").replaceAll(/\s{2,}/g," ").split(" ").length;
    wordsnum.textContent = words;
    if(words < wordsnum.getAttribute('miner')){
        wordsnum.classList.remove('has-text-success')
        wordsnum.classList.add('has-text-danger');
    }else{
        wordsnum.classList.remove('has-text-danger');
        wordsnum.classList.add('has-text-success');
    }
}


// Get microphone ready to record and record or stop
const getMicrophoneReady = function(parent, fn){
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream =>{
            parent.records.mediaRecorder = new MediaRecorder(stream);

            parent.records.mediaRecorder.ondataavailable = (e) => {
                parent.records.chunks = [e.data];
            }

            parent.records.mediaRecorder.onstop = ()=>{
                let audioFile = new Blob(parent.records.chunks, {'type': 'audio/mp3; codecs=opus'});
                audioURL = URL.createObjectURL(audioFile);
                parent.components.audio.src = audioURL;
            }
            fn()
        })
        .catch(err =>{
            window.open('/learn','_self')
            // Error msg
        })
    }
}
const record = (parent)=>{
    parent.records.mediaRecorder.start();
}
const stop = (parent)=>{
    parent.records.mediaRecorder.stop()
}


// Gunction to get random topic from our API
const getRandomTopic = function(fun, jsonContext){
    async function caller(){
        const data = await fetch(`/assets/api/${jsonContext}.json`);
        if(!data.ok){ return false}
        return await data.json();
    }
    caller()
    .then((ques) => {
        if(ques){
            let selectedTopic = ques[Math.floor(Math.random()*(ques.length - 1))].questions;
            fun(selectedTopic)
        }
    })
}


// Composing functions
const composer = function(...funcs) {
    return function(value) {
        return funcs.reduce((acc, func) => func(acc), value);
    }
}



// Function to call unsplash API
let accessKey = "6k1u0Kl_rKhtpE1NLWy0m_MXp-PNaHfmBJz23w4RVE4";
let width = 1080;
let height = 720
const getUnsplashImg = async function(fun){
    async function fetchAPI(){
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}&w=1080&h=720`);

        if(!response.ok){ return false}
        return await response.json();
    }
    fetchAPI()
    .then((response)=>{
        if(response != false){
            fun(response)
        }
    })
}










// #######################################################################################################################################################
// #######################################################################################################################################################
// #######################################################################################################################################################




const cancelBtn = document.querySelector('#cancelBtn');
const popuper = document.querySelector('.popuper');

// Writing Feilds
const chat = document.querySelector('#chat');

// writing BTNs
const storyWrite = document.querySelector('#storyWrite');

// select topic
// const goTopic = document.querySelector('#goTopic');

// Words Counter
const wordsnum = document.querySelector('#wordsnum'); // ***********


const IeltsWriting1Command = "Rate this essay depending on IELTS exam test as writing task 1, give Band number, and give Grammar and spelling mistakes if found, and give suggestions to everything:"
const IeltsWriting2Command = "Rate this essay depending on IELTS exam test as writing task 2, give Band number, and give Grammar and spelling mistakes if found, and give suggestions to everything:"
const GeneralWriteCommand = "Rate this essay by giving number of 10. Give Grammar and spelling mistakes if found, and give suggestions to everything:"
const StoryWritingCommand = ["Check the grammar and vocabulary mistakes of this statement of a story:","Then send to me a new statement as a completion to the story (at maximum use 20 words)."]
const ImageWritingCommand = "This essay is a description for an image, Check the grammar and vocabulary mistakes of this essay:"
const EasyIELTSIntroCommand = "Rate this intro for IELTS essay task 1, give Grammar and spelling mistakes if found, and give suggestions:"
const EasyIELTSBodyCommand = "Rate this body for IELTS essay, give Grammar and spelling mistakes if found, and give suggestions:"
const EasyIELTSconcCommand = "Rate this conclusion for IELTS essay, give Grammar and spelling mistakes if found, and give suggestions:"


class writingClass{
    static #interfaces = {
        "answerpopup": document.querySelector('#answerpopup'),
        "popuper": document.querySelector('.popuper'),  // **
        "boxShadowbg": document.querySelector('.boxShadowbg')
    }
    static #components = {
        "userWriteing": document.querySelector('#userWriteing'), // **
        "aiWriting": document.querySelector('#aiWriting'), // **
        "wordsnum": document.querySelector('#wordsnum'),
        "imageToCraft": document.querySelector('#imageToCraft')
    }
    static #controles = {
        "goTopic": document.querySelector('#goTopic'),
        "options": [...document.querySelectorAll('.optioner')],
        "gnrateTopic": document.querySelector('#gnrateTopic'),
        "submitWrite": document.querySelector('#submitWrite'),
    }
    static #inputs = {
        "getWriting": document.querySelector('#getWriting') 
    }

    static #getImg = function(imgData){
        return imgData.urls.regular;
    }
    static #pushImg = function(imgData){
        writingClass.#components.imageToCraft.src = imgData;
    }
    static #getTopic = function(topic){
        let title = document.createElement("p");
        title.classList.add('is-size-6');
        title.textContent = topic;
        let span = document.createElement("span");
        span.classList.add('is-size-6', "has-text-success", "has-text-weight-medium");
        span.textContent = "Write About: ";
        title.prepend(span);
        writingClass.#interfaces.popuper.prepend(title);
    }
    static #hideOptions = function(){
        writingClass.#controles.options.forEach((ele)=>{
            ele.parentElement.remove()
        })
    }
    static #generateCommand = function(command, writing){
        return `${command} ${writing}`
    }
    static #showPopuper = function(){ // **
        writingClass.#interfaces.popuper.style.display = 'block'
    }
    static #hidpopup = function(){ // ##
        writingClass.#interfaces.boxShadowbg.classList.add('trans');
        writingClass.#interfaces.answerpopup.classList.add('trans');
        setTimeout(() => {
            writingClass.#interfaces.boxShadowbg.remove();
            writingClass.#interfaces.answerpopup.remove();
        }, 1000);
    }
    static #getUsrWrite = function(){
        let value =  writingClass.#inputs.getWriting.value;
        return value
    } 
    static #usrWritePush = function(writing){ // ##
        let paragraph = document.createElement("p");
        paragraph.textContent = writing;
        writingClass.#components.userWriteing.appendChild(paragraph);
        return writing
    }
    static #aiWritePush = function(response){ // ##
        let paragraph = document.createElement("p");
        paragraph.textContent = response;
        paragraph.textContent = response.choices[0].message.content;
        writingClass.#components.aiWriting.appendChild(paragraph);
    }

    constructor(command, json) {
        const parent = this.constructor;
        this.command = command;
        this.json = json;
        this.composers = {
            haveTopic: composer(parent.#hideOptions,  parent.#showPopuper),
            afterGettingRandomTopic: composer(parent.#getTopic, parent.#showPopuper, parent.#hideOptions), // ## 
            newTopicAdd: ()=>{
                getRandomTopic(this.composers.afterGettingRandomTopic, this.json)
            },

            getImgPush: composer(parent.#getImg, parent.#pushImg),
            generateImg: ()=>{
                getUnsplashImg(this.composers.getImgPush)
            },

            pushShow: composer(parent.#aiWritePush), 
            sumbitWriting: composer(
                parent.#getUsrWrite,
                parent.#usrWritePush, 
                (response)=>{return parent.#generateCommand(this.command, response)}, 
                (fullCommand)=>{getChatGPT(this.composers.pushShow, fullCommand)}, 
                parent.#hidpopup
            )

        };
        this.init = function(){
            this.addListeners()
        }
        this.addListeners = function(){
            parent.#controles.goTopic?.addEventListener('click', this.composers.haveTopic);
            parent.#controles.gnrateTopic?.addEventListener('click', this.composers.newTopicAdd);

            parent.#components.imageToCraft ? this.composers.generateImg() : "";

            parent.#inputs.getWriting.addEventListener('keyup', countWords);
            parent.#controles.submitWrite.addEventListener('click', ()=>{
                if(checkMinLimit(parent.#inputs.getWriting)){
                    this.composers.sumbitWriting()
                }
            });

        }
    }
}

class storyWritingClass{
    static #interfaces = {
        "answerpopup": document.querySelector('#answerpopup'),
        "boxShadowbg": document.querySelector('.boxShadowbg'),
        "chat": document.querySelector('#chat')
    }
    static #components = {
        "wordsnum": document.querySelector('#wordsnum')
    }
    static #controles = {
        "goTopic": document.querySelector('#goTopic'),
        "gnrateTopic": document.querySelector('#gnrateTopic'),
        "submitWrite": document.querySelector('#submitWrite'),
    }
    static #inputs = {
        "getWriting": document.querySelector('#getWriting') 
    }

    static #getTopic = function(topic){
        let title = document.createElement("p");
        title.classList.add('is-size-6');
        title.textContent = topic;
        let span = document.createElement("span");
        span.classList.add('is-size-6', "has-text-purple", "has-text-weight-medium");
        span.textContent = "Write About: ";
        title.prepend(span);
        storyWritingClass.#interfaces.chat.prepend(title);
    }
    static #generateCommand = function(command, writing){
        return `${command[0]} '${writing}'. ${command[1]}`
    }
    static #hidpopup = function(){
        storyWritingClass.#interfaces.boxShadowbg.classList.add('trans');
        storyWritingClass.#interfaces.answerpopup.classList.add('trans');
        setTimeout(() => {
            storyWritingClass.#interfaces.boxShadowbg.remove();
            storyWritingClass.#interfaces.answerpopup.remove();
        }, 1000);
    }
    static #getUsrWrite = function(){
        let value =  storyWritingClass.#inputs.getWriting.value;
        return value
    } 
    static #getAiStoryMsg = function(resp){
        return resp.choices[0].message.content;
    }
    static #usrWritePush = function(writing){
        let msgItem = document.createElement('div'); 
        storyWritingClass.#interfaces.chat.appendChild(msgItem);
        msgItem.classList.add('msgboxContR');
    
        let msgBoxChild = document.createElement('div');
        msgBoxChild.textContent = writing;
        msgBoxChild.classList.add('usr',"msg");
        msgItem.appendChild(msgBoxChild);
        return writing
    }
    static #aiWritePush = function(response){ // ##
        let msgItem = document.createElement('div'); 
        storyWritingClass.#interfaces.chat.appendChild(msgItem);
        msgItem.classList.add('msgboxCont');
    
        let msgBoxChild = document.createElement('div');
        msgBoxChild.textContent = response;
        console.log(response)
        msgBoxChild.classList.add('ai',"msg");
        msgItem.appendChild(msgBoxChild);
    }

    constructor(command, json) {
        const parent = this.constructor;
        this.command = command;
        this.json = json;
        this.composers = {
            haveTopic: composer(parent.#hidpopup),
            afterGettingRandomTopic: composer(parent.#getTopic, parent.#hidpopup), // ## 
            newTopicAdd: ()=>{
                getRandomTopic(this.composers.afterGettingRandomTopic, this.json)
            },
            
            pushShow: composer(parent.#getAiStoryMsg, parent.#aiWritePush), 
            sumbit: composer(
                parent.#getUsrWrite,
                parent.#usrWritePush, 
                (response)=>{return parent.#generateCommand(this.command, response)}, 
                (fullCommand)=>{getChatGPT(this.composers.pushShow, fullCommand)}, 
            )

        };
        this.init = function(){
            this.addListeners()
        }
        this.addListeners = function(){
            parent.#controles.goTopic.addEventListener('click', this.composers.haveTopic);
            parent.#controles.gnrateTopic.addEventListener('click', this.composers.newTopicAdd);
            parent.#inputs.getWriting.addEventListener('keyup', countWords);
            parent.#controles.submitWrite.addEventListener('click', ()=>{
                if(checkMinLimit(parent.#inputs.getWriting)){
                    this.composers.sumbit()
                }
            });

        }
    }
}


let IeltsWriting1 = new writingClass(IeltsWriting1Command, "ieltsSpeaking1");
let IeltsWriting2 = new writingClass(IeltsWriting2Command, "ieltsSpeaking1");
let generalWriting = new writingClass(GeneralWriteCommand, "ieltsSpeaking1");
let easyIELTSIntro = new writingClass(EasyIELTSIntroCommand, "ieltsSpeaking1");
let easyIELTSBody = new writingClass(EasyIELTSBodyCommand, "ieltsSpeaking1");
let easyIELTSConc = new writingClass(EasyIELTSconcCommand, "ieltsSpeaking1");

let craftImage = new writingClass(ImageWritingCommand, "ieltsSpeaking1");
let writeStory = new storyWritingClass(StoryWritingCommand, "ieltsSpeaking1");


// Check JUST the grammar and vocabulary mistakes of this statement of a story. Then send to me a new statement as a completion to the story (at maximum use 20 words). This is the story I have mention: `She was walking in the road, till suddenly she hit a car`




const APPIELTSSpeak1 = {
    interfaces: {
        "instructions": document.querySelector('#instructions'),
        "questions": document.querySelector('#questions'),
        "correctRate": document.querySelector('#correctRate')
    },
    components: {
        "question": document.querySelector('#question'),
        "generateSpeakQ": document.querySelector('#generateSpeak1'),
        "timer": document.querySelector('#timer'),
        "afterRecord": document.querySelector('#afterRecord'),
        "aiWriting": document.querySelector('#aiWriting'),
        "audio": document.querySelector("audio")
    },
    controles: {
        "recordBtn": document.querySelector('#recordBtn'),
        "stopBtn": document.querySelector('#stopBtn'),
        "newRecord": document.querySelector('#newRecord'),
        "submit": document.querySelector('#submit'),
    },
    variables: {
        "questions": null,
        "answers": [],
        "questionIndex": 0
    },
    states:{
        recording: false
    },
    records: {
        mediaRecorder: null,
        chunks: [],
        audioURL: '',
        answers: []
    },

    hideInstructions: function(){
        APPIELTSSpeak1.interfaces.instructions.classList.add('trans');
        setTimeout(() => {APPIELTSSpeak1.interfaces.instructions.remove()}, 500);
    },
    showQuestions: function(){
        APPIELTSSpeak1.interfaces.questions.classList.remove('trans');
    },
    hideQuestions: function(){
        APPIELTSSpeak1.interfaces.questions.classList.add('trans');
        setTimeout(() => {APPIELTSSpeak1.interfaces.questions.remove()}, 500);
    },
    showCorrectRate: function(){
        APPIELTSSpeak1.interfaces.correctRate.classList.remove('trans');
    },
    showCorrectRate: function(){
        APPIELTSSpeak1.interfaces.correctRate.classList.add('trans');
        setTimeout(() => {APPIELTSSpeak1.interfaces.correctRate.remove()}, 500);
    },
    countDown(){
        let x = setInterval(() => {
            time = APPIELTSSpeak1.components.timer.textContent.split(":");
            if(+time[1] == 0 && +time[0] > 0 && APPIELTSSpeak1.states.recording){
                time[1] = "59"; time[0] = (+time[0] - 1).toString();
            }else if(+time[1] > 0 && APPIELTSSpeak1.states.recording){
                time[1] = (+time[1] - 1).toString();
            }else{
                APPIELTSSpeak1.composers.stop();
                APPIELTSSpeak1.showHideAfterRecord();
                APPIELTSSpeak1.hideShowStopBtn();
                clearInterval(x)
            }
            APPIELTSSpeak1.components.timer.textContent = `${time[0].padStart(2, "0")}:${time[1].padStart(2, "0")}`
        }, 950);
    },
    resetTimer: function(){
        APPIELTSSpeak1.components.timer.textContent = "01:00"
    },
    showHideAfterRecord: function(){
        APPIELTSSpeak1.components.afterRecord.classList.toggle('trans')
    },
    hideShowRecordBtn: function(){
        APPIELTSSpeak1.controles.recordBtn.classList.toggle("hide");
    },
    hideShowStopBtn: function(){
        APPIELTSSpeak1.controles.stopBtn.classList.toggle("hide");
    },
    changeRecordingState: function(){
        APPIELTSSpeak1.states.recording ? APPIELTSSpeak1.states.recording = false : APPIELTSSpeak1.states.recording = true 
    },



    generateTopic: function(fun){
        async function caller(){
            const data = await fetch("/assets/api/ieltsSpeaking1.json");
            if(!data.ok){ return false}
            return await data.json();
        }
        caller()
        .then((ques) => {
            if(ques){
                let selectedTopic = ques[Math.floor(Math.random()*(ques.length - 1))].questions;
                APPIELTSSpeak1.variables.questions = selectedTopic;
                fun()
                return selectedTopic
            }
        })
    },
    nextQuestion: function(){
        APPIELTSSpeak1.components.question.querySelectorAll('span')[1].textContent = APPIELTSSpeak1.variables.questions[APPIELTSSpeak1.variables.questionIndex];
        APPIELTSSpeak1.components.question.querySelector('span').textContent = `Q${++APPIELTSSpeak1.variables.questionIndex}:`;
    },
    questionReader: function(){
        if('speechSynthesis' in window){
            let speakData = new SpeechSynthesisUtterance();
            speakData.volume = 1; speakData.rate = 0.7; speakData.pitch = 0.1; speakData.lang = 'en';
            speakData.text = APPIELTSSpeak1.components.question.textContent.replace('Q', "Question");
            speakData.voice = speechSynthesis.getVoices()[0];
    
            speechSynthesis.speak(speakData);
        }
    },


    questionsAnswers: function(){
        let fullmessage = ``;
        this.sendQuestionsAnswers.forEach((ans,index)=>{
            fullmessage += `${ques[index]}: \n The Answwer: ${ans} \n`;
        })
        return fullmessage
    },
    generateCommand: function(fullMsg){
        return `This Message contains some questions with their answers for IELTS Speaking Part 1. Give Band Number, Grammer and Vocabulary mistakes \n ${fullMsg}`
    },


    
    composers: {
        generateSample(){
            let composed = composer(APPIELTSSpeak1.hideInstructions, APPIELTSSpeak1.nextQuestion, APPIELTSSpeak1.showQuestions, APPIELTSSpeak1.questionReader);
            getMicrophoneReady(APPIELTSSpeak1, ()=>{APPIELTSSpeak1.generateTopic(composed)})
        },
        record(){composer(
                APPIELTSSpeak1.hideShowRecordBtn, 
                APPIELTSSpeak1.hideShowStopBtn, 
                ()=>{record(APPIELTSSpeak1)}, 
                APPIELTSSpeak1.changeRecordingState, 
                APPIELTSSpeak1.countDown
            )()
        },
        stop(){composer(()=>{stop(APPIELTSSpeak1)}, APPIELTSSpeak1.changeRecordingState)()},
        re_record(){
            composer(
                APPIELTSSpeak1.showHideAfterRecord,
                APPIELTSSpeak1.hideShowRecordBtn,
                APPIELTSSpeak1.changeRecordingState,
                APPIELTSSpeak1.resetTimer
            )()
        }

    },
    init: () => {
        APPIELTSSpeak1.addListeners();
    },
    addListeners: () => {
        APPIELTSSpeak1.components.generateSpeakQ.addEventListener('click', APPIELTSSpeak1.composers.generateSample);
        APPIELTSSpeak1.controles.recordBtn.addEventListener('click', APPIELTSSpeak1.composers.record);
        APPIELTSSpeak1.controles.stopBtn.addEventListener('click', APPIELTSSpeak1.composers.stop);
        APPIELTSSpeak1.controles.newRecord.addEventListener('click', APPIELTSSpeak1.composers.re_record);
        
        // APPIELTSSpeak1.controles.submit.addEventListener('click', APPIELTSSpeak1.getNextQuestion)
    }
}






const generateRMbtn = document.querySelector("#generateRMbtn");
const activateRMbtn = document.querySelector("#activateRMbtn");
const regenerateRMbtn = document.querySelector("#regenerateRMbtn");
const interfacesId = document.querySelectorAll("[interfaceId]");
const rmDateSelect = document.querySelector("#rmDateSelect");
const roadmapDetails = document.querySelector("#roadmapDetails")


const checkDate = function(fns){
    if(rmDateSelect.value > currentDateFormated){
        fns()
    }
}
const hideInterface = function(e){
    let parent = e.target.closest(`[interfaceId="${e.target.getAttribute("hideInterfBtn")}"]`);
    parent.classList.remove("active");
    setTimeout(() => {
        parent.style.display = "none"
    }, 0);
    return e
}
const activeInterface = function(e){
    let parent = document.querySelector(`[interfaceId="${e.target.getAttribute("targetInterf")}"]`);
    parent.classList.add("active");
    return e
}
const generateRmCommand = function(){
    let days = Math.floor((new Date(rmDateSelect.value) - date) / (24 * 60 * 60 * 1000))
    return `I've ${days} days before my IETLS exam, generate studying roadmap then suggest YouTube channels to prepare from.`
}
const pushRoadmap = function(rm){
    roadmapDetails.textContent = rm.choices[0].message.content
}
const hide2ndInterface = function(e){
    let parent = document.querySelector(`[interfaceId="2"]`);
    parent.classList.remove("active");
    setTimeout(() => {
        parent.style.display = "none"
    }, 0);
}
const show3rdInterface = function(e){
    let parent = document.querySelector(`[interfaceId="3"]`);
    parent.classList.add("active");
}
const callRMgenerator = composer(hideInterface, activeInterface);
const proccessRm = composer(pushRoadmap, hide2ndInterface, show3rdInterface)
const callRmGeneration = composer(generateRmCommand, (command)=>{getChatGPT(proccessRm, command)});
const roadmapGeneration = composer(callRMgenerator, callRmGeneration);

generateRMbtn?.addEventListener('click', (e)=>{
    checkDate(()=>{roadmapGeneration(e)})
});
regenerateRMbtn?.addEventListener('click', (e)=>{
    roadmapGeneration(e)
});





