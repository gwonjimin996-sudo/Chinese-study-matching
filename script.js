let users = JSON.parse(localStorage.getItem("users")) || [];
let studies = JSON.parse(localStorage.getItem("studies")) || [];
let applications = JSON.parse(localStorage.getItem("applications")) || [];

function saveData(){
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("studies", JSON.stringify(studies));
    localStorage.setItem("applications", JSON.stringify(applications));
}

function showMessage(text){
    const msg = document.getElementById("message");
    msg.innerText = text;
    msg.style.display = "block";

    setTimeout(()=>{
        msg.style.display = "none";
    },2000);
}

function showPage(pageId){

    document.querySelectorAll(".page").forEach(page=>{
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");

    if(pageId==="mypage"){
        loadMyPage();
    }
}

function signup(){

    const name=document.getElementById("name").value.trim();
    const studentId=document.getElementById("studentId").value.trim();
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value.trim();

    if(!name||!studentId||!email||!password){
        showMessage("모든 항목을 입력하세요.");
        return;
    }

    const exists=users.find(
        user=>user.studentId===studentId
    );

    if(exists){
        showMessage("이미 존재하는 학번입니다.");
        return;
    }

    users.push({
        name,
        studentId,
        email,
        password
    });

    saveData();

    showMessage("회원가입 완료!");
}

function login(){

    const studentId=
    document.getElementById("loginStudentId").value;

    const password=
    document.getElementById("loginPassword").value;

    const user=users.find(
        user=>
        user.studentId===studentId &&
        user.password===password
    );

    if(!user){
        showMessage("로그인 실패");
        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    showMessage("로그인 성공");
}

function logout(){

    localStorage.removeItem("currentUser");

    showMessage("로그아웃 완료");
}

function getCurrentUser(){

    return JSON.parse(
        localStorage.getItem("currentUser")
    );
}

function createStudy(){

    const user=getCurrentUser();

    if(!user){
        showMessage("로그인 후 이용하세요.");
        return;
    }

    const title=
    document.getElementById("studyTitle").value;

    const capacity=
    document.getElementById("studyCapacity").value;

    const type=
    document.getElementById("studyType").value;

    const time=
    document.getElementById("studyTime").value;

    if(!title||!capacity||!time){
        showMessage("빈칸을 입력하세요.");
        return;
    }

    studies.unshift({
        id:Date.now(),
        title,
        capacity,
        type,
        time,
        author:user.name
    });

    saveData();

    renderStudies();

    showMessage("스터디 등록 완료");
}

function applyStudy(id){

    const user=getCurrentUser();

    if(!user){
        showMessage("로그인 필요");
        return;
    }

    const exists=applications.find(
        app=>
        app.studyId===id &&
        app.studentId===user.studentId
    );

    if(exists){
        showMessage("이미 신청했습니다.");
        return;
    }

    applications.push({
        studyId:id,
        studentId:user.studentId
    });

    saveData();

    showMessage("신청 완료");
}

function renderStudies(){

    const keyword=
    document.getElementById("searchInput")?.value
    .toLowerCase() || "";

    const filter=
    document.getElementById("filterType")?.value || "";

    const studyList=
    document.getElementById("studyList");

    if(!studyList) return;

    studyList.innerHTML="";

    const filtered=studies.filter(study=>{

        const titleMatch=
        study.title.toLowerCase().includes(keyword);

        const typeMatch=
        filter==="" ||
        study.type===filter;

        return titleMatch && typeMatch;
    });

    filtered.forEach(study=>{

        studyList.innerHTML += `
        <div class="study-card">
            <h3>${study.title}</h3>
            <p>유형 : ${study.type}</p>
            <p>인원 : ${study.capacity}명</p>
            <p>시간 : ${study.time}</p>
            <p>작성자 : ${study.author}</p>

            <button onclick="applyStudy(${study.id})">
                신청하기
            </button>
        </div>
        `;
    });
}

function loadMyPage(){

    const user=getCurrentUser();

    const info=
    document.getElementById("myInfo");

    const myStudies=
    document.getElementById("myStudies");

    const myApplications=
    document.getElementById("myApplications");

    if(!user){

        info.innerHTML=
        "<p>로그인이 필요합니다.</p>";

        return;
    }

    info.innerHTML=`
        <p>이름 : ${user.name}</p>
        <p>학번 : ${user.studentId}</p>
        <p>이메일 : ${user.email}</p>
    `;

    const writtenStudies=
    studies.filter(
        study=>study.author===user.name
    );

    myStudies.innerHTML=
    writtenStudies.length===0
    ? "작성한 스터디 없음"
    : writtenStudies.map(study=>
        `<p>${study.title}</p>`
    ).join("");

    const applied=
    applications.filter(
        app=>app.studentId===user.studentId
    );

    myApplications.innerHTML=
    applied.length===0
    ? "신청한 스터디 없음"
    : applied.map(app=>{

        const study=
        studies.find(
            s=>s.id===app.studyId
        );

        return `<p>${study?.title}</p>`;

    }).join("");
}

if(studies.length===0){

    studies=[
        {
            id:1,
            title:"중국어 회화 초급",
            capacity:5,
            type:"회화",
            time:"화요일 18시",
            author:"관리자"
        },
        {
            id:2,
            title:"HSK 5급 준비",
            capacity:6,
            type:"HSK",
            time:"목요일 19시",
            author:"관리자"
        }
    ];

    saveData();
}

renderStudies();