'use strict';


window.addEventListener('DOMContentLoaded',function(){
    let title = document.querySelectorAll(".load-item");
    let i=0;
    // if(getCookie('user')!=undefined){
    //     document.querySelector("#loadWrap").remove();
    // } else {
        title.forEach(el=>{
            let e = el;
            setTimeout(()=>{
                e.style.animation = "lt 1.5s ease both";
            }, 700*i);
            i++;
        });

        setTimeout(()=>{
            let hc = document.querySelector("#hiddenCover");
            hc.style.animation = "hc 5s cubic-bezier(1,0,0,0.75) both";
        }, 500);

        setTimeout(()=>{
            let wrap = document.querySelector("#loadWrap");
            wrap.style.left = "-100%";
            wrap.style.opacity = 0;
        }, 6000);

        setTimeout(()=>{
            let hellow = document.querySelector(".load-hellow");
            hellow.style.animation = "lh 0.5s ease both";
        }, 5200);

        setTimeout(()=>{
            let wrap = document.querySelector("#loadWrap");
            wrap.remove();
        },6700);
    // }
});
