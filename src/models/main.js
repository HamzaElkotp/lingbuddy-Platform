(async function () {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('teacher') || currentUrl.includes('student')) {
        const userLogin = await JSON.parse(window.localStorage.getItem('userLogin'));
        if (userLogin == null) {
            location.href = `${window.location.origin}/login`;
            return
        }
        let isUserLogin = await fetch('/checkUser', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userLogin)
        });

        isUserLogin = await isUserLogin.json();
        if (isUserLogin.logged == false) {
            location.href = `${window.location.origin}/login`;
        } else {
            if (userLogin.accountType == "student" && currentUrl.includes('teacher')) {
                location.href = `${window.location.origin}/student`;
            } else if (userLogin.accountType == "teacher" && currentUrl.includes('student')) {
                location.href = `${window.location.origin}/teacher`;
            }
        }
    }
}());





const linksMenu = document.querySelector('.linksMenu');
const burger = document.querySelector('.burger');
burger?.addEventListener('click', () => {
    linksMenu.classList.toggle('active');
    burger.classList.toggle('fa-minus');
    burger.classList.toggle('fa-bars');
});


let reportsNavLinks = document.querySelectorAll("[href='/student/reports']")
reportsNavLinks?.forEach((link)=>{
    let x = JSON.parse(window.localStorage.getItem('userLogin'));
    x = x.email;
    link.href = `/student/reports/${x}`;
})


const pageTitle = document.querySelector('#pageTitle');
(function () {
    let elements = [...document.querySelectorAll(`[whtpg="${pageTitle?.textContent}"]`)];
    for (i of elements) {
        i.classList.add("active")
    }
}());


(function () {
    const leasonBoxes = document.querySelectorAll(".leasonBox");
    leasonBoxes.forEach((ele) => {
        ele.addEventListener('click', () => {
            ele.nextElementSibling.classList.toggle('active')
        })
    })
}());



(function () {
    let dashpage = [...document.querySelectorAll('[dashpage]')];
    let dashSect = [...document.querySelectorAll('[dashSect]')]
    dashpage.forEach((ele) => {
        ele.addEventListener('click', () => {
            dashSect.forEach((sect) => {
                sect.classList.remove("active");
            })
            dashpage.forEach((child) => {
                child.classList.remove("active")
            })
            ele.classList.add('active')
            let val = ele.getAttribute('dashpage');
            document.querySelector(`[dashSect=${val}]`).classList.add("active");
        })
    })
}());










const composerPrivate = function (...funcs) {
    return function (value) {
        return funcs.reduce((acc, func) => func(acc), value);
    }
}







const specifyReportSection = function (getted) {
    let parent = document.querySelector(`[showerData=${getted}]`).closest(".lessonsPage");
    let searchInput = parent.querySelector("[searchPlace]");
    searchInput.setAttribute("searchPlace", getted);

    let loadcardsBtn = parent.querySelector("[loadPlace]");
    loadcardsBtn.setAttribute("loadPlace", getted);
    return getted
}
const showSectonReports = function (getted) {
    let box = document.querySelector(`[toShowData=${getted}]`);
    let parent = box.parentElement;
    let boxes = parent.querySelectorAll(`[toShowData]`);
    boxes.forEach((ele) => {
        ele.classList.remove("show")
    });
    box.classList.add('show');
    return getted
}
const chaingeReportSection = composerPrivate(showSectonReports, specifyReportSection);

const typeSelectors = document.querySelectorAll(".type-selector");
typeSelectors.forEach((prnt) => {
    let childrens = prnt.querySelectorAll(".tag")
    childrens.forEach((chld) => {
        chld.addEventListener('click', () => {
            childrens.forEach((ele) => {
                ele.classList.add("is-light");
                chld.classList.remove("is-light");

                chaingeReportSection(chld.getAttribute("showerData"));
            })
        })
    })
})
const searchbtn = document.querySelectorAll("[searchbtn]");
searchbtn.forEach((searchbtn) => {
    searchbtn.addEventListener('click', (e) => {
        let searchbar = e.target.previousElementSibling;
        let searchingValue = searchbar.value;
        let searchingPlaceName = searchbar.getAttribute("searchPlace");
        let searchingPlace = document.querySelector(`[toShowData="${searchingPlaceName}"]`)

        searchInReports(searchingValue, searchingPlace)
    })
})

// function chooseParent
const searchInReports = function (searchTerm, parentSelector) {
    searchTerm = searchTerm.toLowerCase();

    $(parentSelector).find('.reportData').each(function () {
        let $div = $(this);
        let divText = $div.text().toLowerCase();

        if (searchTerm === '' || divText.indexOf(searchTerm) !== -1) {
            $div.show(); // Show the div
        } else {
            $div.hide(); // Hide the div
        }
    });
}


const loadPlaceBtn = document.querySelectorAll("[loadPlace]");
loadPlaceBtn.forEach((searchbtn) => {
    searchbtn.addEventListener('click', (e) => {
        let loadingPlaceName = e.target.getAttribute("loadPlace");
        let loadingPlace = document.querySelector(`[toShowData="${loadingPlaceName}"]`) || e.target.closest(".lessonsPage")

        loadReportsRoadmaps(loadingPlace)
    })
})
const loadReportsRoadmaps = function (parentSelector) {
    $(parentSelector).find('.reportData').each(function () {
        let $div = $(this);
        $div.show(); // Show the div
    });
}





// // Function to show details of every reportSection

















const hidePopUp = function (e) {
    let parent = e.target.closest(".dataPop")
    parent.classList.remove('active');
    setTimeout(() => {
        parent.style.display = "none"
    }, 310);
}
const showPopUp = function (e) {
    let parent = document.getElementById(e.target.getAttribute("targeted") || e.target.parentElement.getAttribute("targeted"))
    parent.style.display = "flex";
    setTimeout(() => {
        parent.classList.add("opacityAni", "active")
    }, 0);
}
const hidePopUpBtns = document.querySelectorAll("[workrole=hidePopup]");
hidePopUpBtns?.forEach((ele) => {
    ele.addEventListener('click', (e) => {
        hidePopUp(e)
    })
})
const showPopUpBtns = document.querySelectorAll("[workrole=showPopup]");
showPopUpBtns?.forEach((ele) => {
    ele.addEventListener("click", (e) => {
        showPopUp(e)
    }, true)
})





let reportData = [...document.querySelectorAll(".reportData")]
reportData.forEach((ele) => {
    ele.addEventListener('click', () => {
        showReportDataPopup()
    })
})
function showReportDataPopup() {
    let popData = document.querySelector(".dataPop");
    popData.style.display = "flex";
    setTimeout(() => {
        popData.classList.add('active');
    }, 10);
}
function hideReportDataPopup() {
    let popData = document.querySelector(".dataPop");
    popData.classList.remove('active');
    setTimeout(() => {
        popData.style.display = "none";
    }, 700);
}






// let exportDataTable = [...document.querySelectorAll("[exporter=exportDataTable]")];
// exportDataTable.forEach((ele)=>{
//     ele?.addEventListener('click', ()=>{
//         let doc = new jsPDF();
//         const fileName = ele.getAttribute("fileName");
//         const table = ele.parentElement.querySelector('table')
//         doc.autoTable({ html: table });
//         doc.save(`${fileName}.pdf`);
//     })
// }) 

let exportReportData = document.querySelector("#exportSheet");
exportReportData?.addEventListener('click', ()=>{
    const element = document.getElementById("popHtml");
    const elementClone = element.cloneNode(true);
    elementClone.querySelectorAll('.is-hidden').forEach((ele)=>{
        ele.remove()
    })
    const html = elementClone.outerHTML;

    const stylesheets = Array.from(document.styleSheets);
    let css = '';

    stylesheets.forEach((stylesheet) => {
        const rules = Array.from(stylesheet.cssRules);
        rules.forEach((rule) => {
            css += rule.cssText;
        });
    });

    const combinedHTML = `
        <html>
        <head>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <style>
            ${css}
            .popup-container{
                bottom: 0;
                width: 100%;
                min-width: 100%;
                height: 100vh;
            }
            button{
                display: none !important;
            }
            i{
                display: none !important;
            }
            .writings:last-of-type {
                margin-bottom: 60px;
            }
        </style>
        </head>
        <body>
        ${html}
        </body>
        </html>
    `;

    let fileName = `${document.querySelector("[fileName]").getAttribute("fileName")}`

    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(combinedHTML));
    link.setAttribute('download', fileName);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})





















const loginForm = document.querySelector('#loginForm');
loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const info = document.querySelector('#info')

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const requestData = {
        email: email,
        password: password
    };

    const response = await fetch('/api/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (response.ok) {
        const data = await response.json();
        if (data.exists == false) {
            info.textContent = 'Account Not Exists, Enter email correctly'
        } else if (data.pass == false) {
            info.textContent = 'Wrong Password!'
        } else {
            window.localStorage.setItem('userLogin', JSON.stringify({
                email,
                password,
                accountType: data.user.accountType
            }))

            if (data.user.accountType == "student") {
                location.href = `${window.location.origin}/student/`;
            } else {
                location.href = `${window.location.origin}/teacher/`;
            }
        }
    }
    else {
        console.error('Request failed:', response.status, response.statusText);
    }
});





const registerForm = document.querySelector('#registerForm');
registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const info = document.querySelector('#info')

    const fname = registerForm.querySelector('#fname').value;
    const lname = registerForm.querySelector('#lname').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('#password').value;
    const type = registerForm.querySelector('#type').value;

    const requestData = {
        firstName: fname,
        lastName: lname,
        email: email,
        password: password,
        accountType: type
    };

    const response = await fetch('/api/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (response.ok) {
        const data = await response.json();
        if (data.exists == true) {
            info.textContent = 'Email is used in another account'
        } else {
            window.localStorage.setItem('userLogin', JSON.stringify({
                email,
                password,
                accountType: type
            }))

            document.querySelector('.rocket').classList.add('active');

            setTimeout(() => {
                if (type == "student") {
                    location.href = `${window.location.origin}/student/`;
                } else {
                    location.href = `${window.location.origin}/teacher/`;
                }
            }, 1500);
        }
    }
    else {
        console.error('Request failed:', response.status, response.statusText);
    }
});



const logoutBtn = document.querySelector('#logout');
logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    logout()
})
function logout() {
    window.localStorage.removeItem('userLogin');
    location.href = `${window.location.origin}/login/`;
}








async function postEndPoint(ep, bodyData) {
    let resp = await fetch(ep, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyData
    });
    return resp
}






















let allStudentsList = []

function pushStudent(data){
    let stu = data;
    let stringed = JSON.stringify({email: stu.email, firstName: stu.firstName, lastName: stu.lastName});
    allStudentsList.push(stringed)

    const table = document.querySelector("#allStudents");

    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = `${stu.firstName} ${stu.lastName}`;
    row.appendChild(nameCell);

    const emailCell = document.createElement('td');
    emailCell.textContent = stu.email;
    row.appendChild(emailCell);

    const actionsCell = document.createElement('td');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('button', 'is-small', 'is-danger');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener('click', (e)=>{
        removeStudent(stu.email, e)
    })
    actionsCell.appendChild(deleteButton);
    
    const controlLink = document.createElement('a');
    controlLink.classList.add('button', 'is-small', 'cus60');
    controlLink.href = `/teacher/control/${stu.email}`;
    controlLink.textContent = 'Control';
    actionsCell.appendChild(controlLink);

    row.appendChild(actionsCell);

    table?.querySelector('tbody').appendChild(row);
}

const getAllStudent = async function (){
    let userEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    userEmail = userEmail.email;

    const response = await postEndPoint('/teacher/getStudents', JSON.stringify({ email: userEmail }));
    if (response.ok) {
        const data = await response.json();
        data.students.forEach(async(student)=>{
            let stu = await JSON.parse(student);
            pushStudent(stu)
        })
    }
}

async function removeStudent(studentEmail, event){
    let teacherEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    teacherEmail = teacherEmail.email;

    const response = await postEndPoint('/teacher/removeStudent', JSON.stringify({ semail: studentEmail,  temail: teacherEmail, allStudentsList}));
    let data = await response.json();
    let jsonSt = JSON.stringify(data);
    allStudentsList.splice(allStudentsList.indexOf(jsonSt), 1);

    event.target.closest('tr').remove()
}

const addNewUser = document.getElementById('addNewUser')
addNewUser?.addEventListener('click', async()=>{
    let studentEmail = document.querySelector('[type="email"]').value;

    let teacherEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    teacherEmail = teacherEmail.email;

    const response = await postEndPoint('/teacher/addStudent', JSON.stringify({ semail: studentEmail,  temail: teacherEmail, allStudentsList}));
    if (response.ok) {
        const data = await response.json();
        if(data.not){
            document.getElementById('info').textContent = "Account not found"
        }else{
            pushStudent(data)
        }
    }
})




function pushMeeting(response) {
    const meetingsColmns = document.getElementById('meetingsColmns');

    const column = document.createElement("div");
    column.className = "column is-one-quarter-desktop is-half-tablet";

    const reportBox = document.createElement("div");
    reportBox.className = "reportBox";

    const topic = document.createElement("p");
    topic.className = "is-size-55 cus60 has-text-centered";
    topic.textContent = response.topic;

    const date = document.createElement("p");
    date.className = "is-size-65";
    date.textContent = `Meeting At: ${response.date}`;

    const link = document.createElement("a");
    link.href = response.link;
    link.className = "button cus60 is-fullwidth is-small meeting";
    link.innerHTML = '<i class="fa-solid fa-video"></i> Join meeting!';

    reportBox.appendChild(topic);
    reportBox.appendChild(date);
    reportBox.appendChild(link);

    column.appendChild(reportBox);
    column.appendChild(reportBox);
    meetingsColmns?.append(column)
}

async function getStudentMeetings(){
    let studentEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    studentEmail = studentEmail.email;

    const response = await postEndPoint('/student/getmeetings', JSON.stringify({ semail: studentEmail }));
    let data = await response.json();
    data.forEach((ele)=>{
        pushMeeting(ele)
    })
}



function pushviTask(response) {

    let time = response.createdAt;
    let date = new Date(time);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    date = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`

    const ncolumnParent = document.getElementById('nviTask');
    const columnParent = document.getElementById('viTask');

    const column = document.createElement("div");
    column.className = "column is-one-quarter-desktop is-half-tablet";

    const taskBox = document.createElement("a");
    taskBox.className = "reportBox";
    taskBox.href = `/student/mytasks/vi/${response._id}`;

    const dateP = document.createElement("p");
    dateP.className = "is-size-65";
    dateP.textContent = `Created At: ${date}`;

    const taskName = document.createElement("p");
    taskName.className = "is-size-6";
    taskName.textContent = response.taskname;

    taskBox.appendChild(taskName);
    taskBox.appendChild(dateP);

    column.appendChild(taskBox);

    if(response.answered != "false"){
        columnParent.append(column);
    }else{
        ncolumnParent.append(column);
    }
}

async function getStudentVItasks(){
    let studentEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    studentEmail = studentEmail.email;

    const response = await postEndPoint('/student/vocabs-idioms-task', JSON.stringify({ semail: studentEmail }));
    let data = await response.json();
    data.forEach((ele)=>{
        pushviTask(ele)
    })
}



function pushRecomendTask(response) {

    let time = response.createdAt;
    let date = new Date(time);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    date = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`

    const ncolumnParent = document.getElementById('nrecomendations');
    const columnParent = document.getElementById('recomendations');

    const column = document.createElement("div");
    column.className = "column is-one-quarter-desktop is-half-tablet";

    const taskBox = document.createElement("a");
    taskBox.className = "reportBox";
    taskBox.href = `/student/mytasks/re/${response._id}`;

    const dateP = document.createElement("p");
    dateP.className = "is-size-65";
    dateP.textContent = `Created At: ${date}`;

    const taskName = document.createElement("p");
    taskName.className = "is-size-6";
    taskName.textContent = response.taskname;

    taskBox.appendChild(taskName);
    taskBox.appendChild(dateP);

    column.appendChild(taskBox);

    if(response.answered != "false"){
        columnParent.append(column);
    }else{
        ncolumnParent.append(column);
    }
}

async function getStudentResourcesTasks(){
    let studentEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    studentEmail = studentEmail.email;

    const response = await postEndPoint('/student/resources-task', JSON.stringify({ semail: studentEmail }));
    let data = await response.json();
    data.forEach((ele)=>{
        pushRecomendTask(ele)
    })
}


// color vocabs
// function colorVocabs(){
//     const paragraph = document.querySelector(".aiTxtBox #taskContent");

//     const pattern = /(\d+)?\.?\-? ?\w+( \w+){0,20}?:/g;

//     const originalText = paragraph.textContent;

//     const styledText = originalText.replaceAll(
//         pattern,
//         (match) => `<span class="cus60">${match}</span>`
//     );

//     paragraph.innerHTML = styledText;
// }
function colorUrlsSources(){
    const paragraph = document.querySelector(".aiTxtBox #taskContent");
    const originalText = paragraph.textContent;

    const sourceName = /\d+(\.|\-) \w+( \w+){0,20}?:/g;
    let styledText = originalText.replaceAll(
        sourceName,
        (match) => `<span class="cus60 has-text-weight-medium">${match}</span>`
    );

    const sourceTitle = /\- (\w+ ?(&? ?)){1,20}?:/g;
    styledText = styledText.replaceAll(
        sourceTitle,
        (match) => `<span class="cus80 has-text-weight-semi-bold">${match}</span>`
    )

    const sourceLink = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    styledText = styledText.replaceAll(
        sourceLink,
        (match) => `<a class="cus20 is-underlined" href="${match}">${match}</a>`
    )

    paragraph.innerHTML = styledText;
}
function completeTask(){
    const checkBox = document.getElementById("taskChecked");

    checkBox?.addEventListener("change", async () => {
      if (checkBox.checked) {
        let fetchUrl = checkBox.getAttribute("fethcplace");
        let id = checkBox.getAttribute("saveID");

        const response = await fetch(`${fetchUrl}${id}/save`);
        let data = await response.json();
        if(data.success){
            window.location.href = '/student'
        }
      }
    });
}




async function getTeacherMeetings(){
    let teacherEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    teacherEmail = teacherEmail.email;

    const response = await postEndPoint('/teacher/getmeetings', JSON.stringify({ temail: teacherEmail }));
    let data = await response.json();
    data.forEach((ele)=>{
        pushMeeting(ele)
    })
}

const newMeetingForm = document.getElementById('newMeetingForm');
newMeetingForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    let teacherEmail = await JSON.parse(window.localStorage.getItem("userLogin"));

    const info = document.querySelector('#info');

    const topic = newMeetingForm.querySelector('input[type="text"]').value;
    const meetDate = newMeetingForm.querySelector('input[type="date"]').value;
    const link = newMeetingForm.querySelector('input[type="url"]').value;
    const student = newMeetingForm.querySelector('#students').value;
    const tEmail = teacherEmail.email;

    const meetData = {
        topic,
        date: meetDate,
        teacherEmail: tEmail,
        studentEmail: student,
        link
    }

    const response = await postEndPoint('/teacher/newMeeting', JSON.stringify(meetData));
    let data = await response.json();
    if(data.success){
        pushMeeting(meetData)
    }
})







const saveWritingTfeedback = async function(id, fb){
    const response = await postEndPoint('/teacher/control/saveWriteReport', JSON.stringify({id, teacherfeedback: fb}));
    if(response.ok){
        let success = await response.json();
        if(success.success){window.location.reload()}
    }
}
const getWriteReportsReady = function(){
    let allWritingReports = [...document.querySelectorAll('#w1 .reportData'), ...document.querySelectorAll('#w2 .reportData')];
    let contBoxer = document.querySelector('#writing');
    let saveTFeedbackBtn = contBoxer.querySelector('button');
    const showWritingReportDetails = function(e){
        showReportDataPopup()
        // reset
        let contBoxers = document.querySelectorAll('.contBoxer');
        contBoxers.forEach((ele)=>{
            ele.classList.add('is-hidden')
        })

        // Push data
        document.getElementById('repoDate').textContent = e.querySelector('.dt').textContent;
        document.getElementById('scoreNum').textContent = e.querySelector('.sc').textContent;

        contBoxer.querySelector('[job="question"]').textContent = e.querySelector('.qu').textContent;
        contBoxer.querySelector('[job="submition"]').textContent = e.querySelector('.stf').textContent;
        contBoxer.querySelector('[job="feedback"]').textContent = e.querySelector('.aif').textContent;

        if(window.location.pathname.includes('teacher')){
            contBoxer.querySelector('[job="teacherNotes"]').value = "";
            if(e.querySelector('.tef').textContent.length > 1){
                contBoxer.querySelector('[job="teacherNotes"]').value = e.querySelector('.tef').textContent;
            }
        }else{
            contBoxer.querySelector('[job="teacherNotes"]').textContent = e.querySelector('.tef').textContent;
        }

        contBoxer.classList.remove('is-hidden');

        saveTFeedbackBtn?.setAttribute('repoIdT', e.getAttribute('repoId'));
    }
    allWritingReports.forEach((repo)=>{
        repo.addEventListener('click', ()=>{showWritingReportDetails(repo)})
    })

    saveTFeedbackBtn?.addEventListener('click', ()=>{
        let fb = contBoxer.querySelector('[job="teacherNotes"]').value;
        saveWritingTfeedback(saveTFeedbackBtn.getAttribute('repoIdT'), fb)
    })
}

const saveWritingMockTfeedback = async function(id, fb){
    const response = await postEndPoint('/teacher/control/saveWriteMockReport', JSON.stringify({id, teacherfeedback: fb}));
    if(response.ok){
        let success = await response.json();
        if(success.success){window.location.reload()}
    }
}
const getWriteMocksReportsReady = function(){
    let allWritingMockReports = document.querySelectorAll('#wm .reportData');
    let contBoxer = document.querySelector('#writeMock');
    let saveTFeedbackBtn = contBoxer.querySelector('button');
    const showWritingMockReportDetails = function(e){
        showReportDataPopup()
        // reset
        let contBoxers = document.querySelectorAll('.contBoxer');
        contBoxers.forEach((ele)=>{
            ele.classList.add('is-hidden')
        })

        // Push data
        document.getElementById('repoDate').textContent = e.querySelector('.dt').textContent;
        document.getElementById('scoreNum').textContent = e.querySelector('.sc').textContent;

        contBoxer.querySelector('[job="question1"]').textContent = e.querySelector('.qu1').textContent;
        contBoxer.querySelector('[job="submition1"]').textContent = e.querySelector('.ans1').textContent;
        contBoxer.querySelector('[job="feedback1"]').textContent = e.querySelector('.aif1').textContent;

        contBoxer.querySelector('[job="question2"]').textContent = e.querySelector('.qu2').textContent;
        contBoxer.querySelector('[job="submition2"]').textContent = e.querySelector('.ans2').textContent;
        contBoxer.querySelector('[job="feedback2"]').textContent = e.querySelector('.aif2').textContent;

        if(window.location.pathname.includes('teacher')){
            contBoxer.querySelector('[job="teacherNotes"]').value = "";
            if(e.querySelector('.tef').textContent.length > 1){
                contBoxer.querySelector('[job="teacherNotes"]').value = e.querySelector('.tef').textContent;
            }
        }else{
            contBoxer.querySelector('[job="teacherNotes"]').textContent = e.querySelector('.tef').textContent;
        }

        contBoxer.classList.remove('is-hidden');

        saveTFeedbackBtn?.setAttribute('repoIdT', e.getAttribute('repoId'));
    }
    allWritingMockReports.forEach((repo)=>{
        repo.addEventListener('click', ()=>{showWritingMockReportDetails(repo)})
    })
    saveTFeedbackBtn?.addEventListener('click', ()=>{
        let fb = contBoxer.querySelector('[job="teacherNotes"]').value;
        saveWritingMockTfeedback(saveTFeedbackBtn.getAttribute('repoIdT'), fb)
    })
}




function pushOverviewToTables(ele, tid){
    let missedTable = document.getElementById(tid).querySelector("tbody");

    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = ele.name || ele.worngWord;


    const td2 = document.createElement("td");
    td2.textContent = ele.number || ele.missedWord;

    tr.appendChild(td1);
    tr.appendChild(td2);

    missedTable.appendChild(tr);
}


const getStudentStudyOverview = async function(){
    let userEmail = null;
    if(document.getElementById("userMail")?.textContent){
        userEmail = document.getElementById("userMail").textContent
    } else{
        let studentEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
        userEmail = studentEmail.email;
    }
    const response = await fetch(`/get-new-overflow-study-data/${userEmail}`, {method: "GET"});
    if (response.ok) {
        const data = await response.json();
        if(data.success == false ){
            let info = document.getElementById('info');
            info.textContent = "No reports were found!"
            return 
        }

        let time = data.updatedAt;
        let date = new Date(time);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        date = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`

        let lastUpdate = document.getElementById("lastUpdate");
        lastUpdate.textContent = date

        data.grammer.forEach((ele)=>{
            pushOverviewToTables(ele, "grammarTable");
        })
        data.misspelling.forEach((ele)=>{
            pushOverviewToTables(ele, "missedTable");
        })
    }
} 





function pushStudentasOption(stuobj){
    const selectStudent = document.getElementById('selectStudent');
    const optionElement = document.createElement('option');
    optionElement.value = stuobj.email;
    optionElement.textContent = stuobj.email;
    selectStudent.appendChild(optionElement);
}

async function callTeacherStudentsEmail(){
    let userEmail = await JSON.parse(window.localStorage.getItem("userLogin"));
    userEmail = userEmail.email;

    const response = await postEndPoint('/teacher/getStudents', JSON.stringify({ email: userEmail }));
    if (response.ok) {
        const data = await response.json();
        data.students.forEach(async(student)=>{
            let stu = await JSON.parse(student);
            pushStudentasOption(stu)
        })
    }
}


const interfaceIds = document.querySelectorAll('[interfaceId]');
try{
    document.querySelector('#fstep').textContent = interfaceIds.length;
} catch(e){

}

const showaTask = document.querySelector('#showTask');
showaTask?.addEventListener('click', ()=>{
    const selectedRadio = document.querySelector('input[name="task"]:checked').value;
    document.querySelector(`[taskis="${selectedRadio}"]`).classList.remove('is-hidden');
})

const hideButtons = document.querySelectorAll('[hideInterface]');
hideButtons?.forEach((btn)=>{
    btn.addEventListener('click', () => {
        const currentInterfaceId = btn.getAttribute('hideInterface');
        const targetInterfaceId = btn.getAttribute('showInterface');
        
        document.querySelector('#cstep').textContent = targetInterfaceId;

        const currentInterface = document.querySelector(`[interfaceId="${currentInterfaceId}"]`);
        const targetInterface = document.querySelector(`[interfaceId="${targetInterfaceId}"]`);

        if (currentInterface && targetInterface) {
            currentInterface.classList.remove('active');
            setTimeout(() => {
                currentInterface.classList.add('is-hidden');
                targetInterface.classList.remove('is-hidden');
            }, 300);
            setTimeout(() => {
                targetInterface.classList.add('active');
            }, 700);
        }
    })
});


// Vocabs & Idioms Task
const vocGenerateBtn = document.getElementById('vocGenerateBtn');
vocGenerateBtn?.addEventListener('click', async ()=>{
    let currectWindow = document.querySelector('[taskis="vocabIdioms"]');
    currectWindow.querySelector('[info]').textContent = "Wait some seconds to complete generating";

    vocGenerateBtn.disabled = true

    let workdsNum = currectWindow.querySelector('[type="number"]').value;
    let topic = currectWindow.querySelector('[name="topicoptions"]').value;
    let type = currectWindow.querySelector('[name="type"]').value.replace("$NuM", workdsNum);
    
    const response = await postEndPoint("/callChatGPT", JSON.stringify({command: `Generate ${workdsNum} ${type} about ${topic}, with there meanings to study it for IELTS. At max 5 resources.`}))
    const data = await response.json();

    let textarea = currectWindow.querySelector('textarea')

    textarea.value += data.choices[0].message.content;
    vocGenerateBtn.disabled = false;
    currectWindow.querySelector('[info]').textContent = "";
})

let sendVoIds = document.querySelector('#sendVoIds');
sendVoIds?.addEventListener('click', async()=>{
    let temail = await JSON.parse(window.localStorage.getItem('userLogin'));
    temail = temail.email;

    let vodsIdoms = document.querySelector('#vitasktextarea').value;
    let targetUser = document.querySelector("#selectStudent").value;
    let taskname = document.querySelector("#vitaskName").value;
    
    let number = document.querySelector("[taskis='vocabIdioms']").querySelector('[type="number"]').value;
    const response = await postEndPoint("/teacher/newtask/new-vocabs-idioms-task", JSON.stringify({taskContent: vodsIdoms, target: targetUser, taskname, number, temail}))
    const data = await response.json();
    if(data.success){
        window.location.href = "./"
    }
})


// Resource Task
const resGenerateBtn = document.getElementById('resGenerateBtn');
resGenerateBtn?.addEventListener('click', async ()=>{
    let currectWindow = document.querySelector('[taskis="resource"]');
    currectWindow.querySelector('[info]').textContent = "Wait some seconds to complete generating";

    resGenerateBtn.disabled = true

    let about = currectWindow.querySelector('[name="about"]').value;
    let resource = currectWindow.querySelector('[name="resource"]').value;
    let focus = currectWindow.querySelector('[name="focus"]').value;
    
    const response = await postEndPoint("/callChatGPT", JSON.stringify({command: `Recommend some resources for IELTS that ${focus} ${about}. I want these resources from ${resource}. I prefere to put the resources link.`}))
    const data = await response.json();

    let textarea = currectWindow.querySelector('textarea')

    textarea.value += data.choices[0].message.content;
    resGenerateBtn.disabled = false;
    currectWindow.querySelector('[info]').textContent = "";
})

let sendResource = document.querySelector('#sendResource');
sendResource?.addEventListener('click', async()=>{
    let temail = await JSON.parse(window.localStorage.getItem('userLogin'));
    temail = temail.email;

    let resources = document.querySelector('#resTasktextarea').value;
    let targetUser = document.querySelector("#selectStudent").value;
    let taskname = document.querySelector("#restaskName").value;
    
    const response = await postEndPoint("/teacher/newtask/new-resource-task", JSON.stringify({taskContent: resources, target: targetUser, taskname, temail}))
    const data = await response.json();
    if(data.success){
        window.location.href = "./"
    }
})














if (window.location.pathname.includes('student/reports')) {
    getWriteReportsReady();
    getWriteMocksReportsReady();
}
else if(window.location.pathname.includes('student/mytasks/vi')){
    colorUrlsSources()
    completeTask()
}
else if(window.location.pathname.includes('student/mytasks/re')){
    colorUrlsSources()
    completeTask()
}
else if(window.location.pathname.includes('student/learn')){
    
}
else if(window.location.pathname.includes('student/roadmap')){
    
}
else if(window.location.pathname.includes('student')){
    getStudentMeetings();
    getStudentVItasks();
    getStudentResourcesTasks();
    getStudentStudyOverview();
}
else if(window.location.pathname.includes('teacher/meetings')){
    getTeacherMeetings()
}
else if(window.location.pathname.includes('teacher/control')){
    getWriteReportsReady();
    getWriteMocksReportsReady();
    getStudentStudyOverview();
}
else if(window.location.pathname.includes('teacher/tasks/newtask')){
    callTeacherStudentsEmail()
}
else if(window.location.pathname.includes('teacher')){
    getAllStudent()
}




window.alert = function(){
    return {}
}