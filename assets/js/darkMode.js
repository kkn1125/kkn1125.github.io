let darkMode = localStorage.getItem("darkMode");

const enableDarkMode = () => {
    document.body.classList.add('dark');
    document.querySelector('#modeToggle').innerHTML = `<i class="far fa-sun fa-2x"></i>`;
    localStorage.setItem('darkMode', 'Y');

    document.querySelector('#modeToggle').classList.remove("btn-secondary");
    document.querySelector('#modeToggle').classList.add("btn-light");
};

const disableDarkMode = () => {
    document.body.classList.remove('dark');
    document.querySelector('#modeToggle').innerHTML = `<i class="fas fa-moon fa-2x"></i>`;
    localStorage.setItem('darkMode', 'N');

    document.querySelector('#modeToggle').classList.remove("btn-light");
    document.querySelector('#modeToggle').classList.add("btn-secondary");
};

window.onload = function(){
    const darkModeToggle = document.querySelector("#modeToggle");
    darkMode = localStorage.getItem("darkMode");
    
    darkModeToggle.addEventListener('click', () => {
        darkMode = localStorage.getItem("darkMode");
        if(darkMode !== "Y"){
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });
}

window.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#modeToggle').innerHTML = darkMode==="Y"?`<i class="far fa-sun fa-2x"></i>`:`<i class="fas fa-moon fa-2x"></i>`;
    if(darkMode==="Y"){
        document.querySelector('#modeToggle').classList.remove("btn-secondary");
        document.querySelector('#modeToggle').classList.add("btn-light");
    } else {
        document.querySelector('#modeToggle').classList.remove("btn-light");
        document.querySelector('#modeToggle').classList.add("btn-secondary");
    }
})

if(darkMode === "Y"){
    document.body.classList.add('dark');
    localStorage.setItem('darkMode', 'Y');
} else {
    document.body.classList.remove('dark');
    localStorage.setItem('darkMode', 'N');
}

//System.register
// github 방식
// localStorage를 사용하지만 body가 아닌 html태그에 클래스를 적용