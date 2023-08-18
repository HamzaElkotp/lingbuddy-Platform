(async function(){
    const currentUrl = window.location.pathname;
    if(currentUrl.includes('teacher') || currentUrl.includes('student')){
        const userLogin = await JSON.parse(window.localStorage.getItem('userLogin'));
        if(userLogin == null){
            location.href= `${window.location.origin}/login`;
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
        if(isUserLogin.logged == false){
            location.href= `${window.location.origin}/login`;
        }
    }
}())





const linksMenu = document.querySelector('.linksMenu');
const burger = document.querySelector('.burger');
burger?.addEventListener('click',()=>{
    linksMenu.classList.toggle('active');
    burger.classList.toggle('fa-minus');
    burger.classList.toggle('fa-bars');
});


const pageTitle = document.querySelector('#pageTitle');
(function(){
    let elements = [...document.querySelectorAll(`[whtpg="${pageTitle?.textContent}"]`)];
    for(i of elements){
        i.classList.add("active")
    }
}());


(function(){
    const leasonBoxes = document.querySelectorAll(".leasonBox");
    leasonBoxes.forEach((ele)=>{
        ele.addEventListener('click',()=>{
            ele.nextElementSibling.classList.toggle('active')
        })
    })
}());



(function(){
    let dashpage = [...document.querySelectorAll('[dashpage]')];
    let dashSect = [...document.querySelectorAll('[dashSect]')]
    dashpage.forEach((ele)=>{
        ele.addEventListener('click',()=>{
            dashSect.forEach((sect)=>{
                sect.classList.remove("active");
            })
            dashpage.forEach((child)=>{
                child.classList.remove("active")
            })
            ele.classList.add('active')
            let val = ele.getAttribute('dashpage');
            document.querySelector(`[dashSect=${val}]`).classList.add("active");
        })
    })
}());










const composerPrivate = function(...funcs) {
    return function(value) {
        return funcs.reduce((acc, func) => func(acc), value);
    }
}







const specifyReportSection = function(getted){
    let parent = document.querySelector(`[showerData=${getted}]`).closest(".lessonsPage");
    let searchInput = parent.querySelector("[searchPlace]");
    searchInput.setAttribute("searchPlace", getted);

    let loadcardsBtn = parent.querySelector("[loadPlace]");
    loadcardsBtn.setAttribute("loadPlace", getted);
    return getted
}
const showSectonReports = function(getted){
    let box = document.querySelector(`[toShowData=${getted}]`);
    let parent = box.parentElement;
    let boxes = parent.querySelectorAll(`[toShowData]`);
    boxes.forEach((ele)=>{
        ele.classList.remove("show")
    });
    box.classList.add('show');
    return getted
}
const chaingeReportSection = composerPrivate(showSectonReports, specifyReportSection);

const typeSelectors = document.querySelectorAll(".type-selector");
typeSelectors.forEach((prnt)=>{
    let childrens = prnt.querySelectorAll(".tag")
    childrens.forEach((chld)=>{
        chld.addEventListener('click', ()=>{
            childrens.forEach((ele)=>{
                ele.classList.add("is-light");
                chld.classList.remove("is-light");

                chaingeReportSection(chld.getAttribute("showerData"));
            })
        })
    })
})
const searchbtn = document.querySelectorAll("[searchbtn]");
searchbtn.forEach((searchbtn)=>{
    searchbtn.addEventListener('click', (e)=>{
        let searchbar = e.target.previousElementSibling;
        let searchingValue = searchbar.value;
        let searchingPlaceName = searchbar.getAttribute("searchPlace");
        let searchingPlace = document.querySelector(`[toShowData="${searchingPlaceName}"]`)

        searchInReports(searchingValue, searchingPlace)
    })
})

// function chooseParent
const searchInReports = function(searchTerm, parentSelector) {
    searchTerm = searchTerm.toLowerCase();
    
    $(parentSelector).find('.reportData').each(function() {
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
loadPlaceBtn.forEach((searchbtn)=>{
    searchbtn.addEventListener('click', (e)=>{
        let loadingPlaceName = e.target.getAttribute("loadPlace");
        let loadingPlace = document.querySelector(`[toShowData="${loadingPlaceName}"]`) || e.target.closest(".lessonsPage")

        loadReportsRoadmaps(loadingPlace)
    })
})
const loadReportsRoadmaps = function(parentSelector){
    $(parentSelector).find('.reportData').each(function() {
        let $div = $(this);        
        $div.show(); // Show the div
    });
}





// // Function to show details of every reportSection

















const hidePopUp = function(e){
    let parent = e.target.closest(".dataPop")
    parent.classList.remove('active');
    setTimeout(() => {
        parent.style.display = "none"
    }, 310);
}
const showPopUp = function(e){
    let parent = document.getElementById(e.target.getAttribute("targeted"))
    parent.style.display = "flex";
    setTimeout(() => {
        parent.classList.add("opacityAni", "active")
    }, 0);
}
const hidePopUpBtns = document.querySelectorAll("[workrole=hidePopup]");
hidePopUpBtns?.forEach((ele)=>{
    ele.addEventListener('click', (e)=>{
        hidePopUp(e)
    })
}) 
const showPopUpBtns = document.querySelectorAll("[workrole=showPopup]");
showPopUpBtns?.forEach((ele)=>{
    ele.addEventListener("click", (e)=>{
        showPopUp(e)
    })
})





let reportData = [...document.querySelectorAll(".reportData")]
reportData.forEach((ele)=>{
    ele.addEventListener('click', ()=>{
        showReportDataPopup()
    })
})
function showReportDataPopup(){
    let popData = document.querySelector(".dataPop");
    popData.style.display = "flex";
    setTimeout(() => {
        popData.classList.add('active');
    }, 10);   
}
function hideReportDataPopup(){
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

// let exportReportData = document.querySelector("#exportSheet");
// exportReportData?.addEventListener('click', ()=>{
//     const element = document.getElementById("popHtml");
//     const html = element.outerHTML;

//     const stylesheets = Array.from(document.styleSheets);
//     let css = '';

//     stylesheets.forEach((stylesheet) => {
//         const rules = Array.from(stylesheet.cssRules);
//         rules.forEach((rule) => {
//             css += rule.cssText;
//         });
//     });

//     const combinedHTML = `
//         <html>
//         <head>
//         <meta name='viewport' content='width=device-width, initial-scale=1'>
//         <style>
//             ${css}
//             .popup-container{
//                 bottom: 0;
//                 width: 100%;
//                 min-width: 100%;
//                 height: 100vh;
//             }
//             button{
//                 display: none !important;
//             }
//             i{
//                 display: none !important;
//             }
//             .writings:last-of-type {
//                 margin-bottom: 60px;
//             }
//         </style>
//         </head>
//         <body>
//         ${html}
//         </body>
//         </html>
//     `;

//     let fileName = `${document.querySelector("[fileName]").getAttribute("fileName")}${document.querySelector("[fildeid]").textContent}`

//     const link = document.createElement('a');
//     link.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(combinedHTML));
//     link.setAttribute('download', fileName);
//     link.style.display = 'none';

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// })





















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
        if(data.exists == false){
            info.textContent = 'Account Not Exists, Enter email correctly'
        } else if(data.pass == false){
            info.textContent = 'Wrong Password!'
        } else{
            window.localStorage.setItem('userLogin', JSON.stringify({
                email,
                password
            }))

            if(data.user.accountType == "student"){
                location.href= `${window.location.origin}/student/`;
            }else{
                location.href= `${window.location.origin}/teacher/`;
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
        if(data.exists == true){
            info.textContent = 'Email is used in another account'
        } else{
            window.localStorage.setItem('userLogin', JSON.stringify({
                email,
                password
            }))

            document.querySelector('.rocket').classList.add('active');

            setTimeout(() => {
                if(type == "student"){
                    location.href= `${window.location.origin}/student/`;
                }else{
                    location.href= `${window.location.origin}/teacher/`;
                }
            }, 1500);
        }
    } 
    else {
        console.error('Request failed:', response.status, response.statusText);
    }
});

