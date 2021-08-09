window.addEventListener('load', function(){
    change(localStorage.getItem('dark'));
});

function change(value){
    value=='Y'?localStorage.setItem("dark","Y"):localStorage.setItem("dark","N")
    document.querySelector('[for="modeToggle"]').innerHTML = value!='N'?"Dark Mode":"Light Mode";
    document.body.setAttribute("data-mode",value!='N'?"dark":"light")
    document.querySelector('#modeToggle').checked = value!='N'?true:false;
}

document.querySelector('#modeToggle').addEventListener('change', function(event){
    if(event.target.checked){
        localStorage.setItem("dark","Y")
        change(localStorage.getItem('dark'));
    } else {
        localStorage.setItem("dark","N")
        change(localStorage.getItem('dark'));
    }
});