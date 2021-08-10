// window.addEventListener('load', function(){
//     change(localStorage.getItem('dark'));
// });

// function change(value){
//     value=='Y'?localStorage.setItem("dark","Y"):localStorage.setItem("dark","N")
//     document.querySelector('[for="modeToggle"]').innerHTML = value!='N'?"Dark Mode":"Light Mode";
//     document.body.setAttribute("data-mode",value!='N'?"dark":"light")
//     document.querySelector('#modeToggle').checked = value!='N'?true:false;
// }

// document.querySelector('#modeToggle').addEventListener('change', function(event){
//     if(event.target.checked){
//         localStorage.setItem("dark","Y")
//         change(localStorage.getItem('dark'));
//     } else {
//         localStorage.setItem("dark","N")
//         change(localStorage.getItem('dark'));
//     }
// });

let darkMode = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector("#modeToggle");

window.addEventListener('DOMContentLoaded',()=>{
    if(darkMode === "Y"){
        document.body.classList.add("dark");
        enableDarkMode();
    } else {
        document.body.classList.remove("dark");
        disableDarkMode();
    }
});

const enableDarkMode = () => {
    document.body.classList.add('dark');
    localStorage.setItem('darkMode', 'Y');
};

const disableDarkMode = () => {
    document.body.classList.remove('dark');
    localStorage.setItem('darkMode', 'N');
};

darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem("darkMode");
    if(darkMode !== "Y"){
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});