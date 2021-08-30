'use strict';
if(window.location.pathname == "/"){
    document.body.style = 'overflow:hidden';
    window.addEventListener('DOMContentLoaded',function(event){
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
                hc.style.animation = "hc 2s cubic-bezier(1,0,0,0.75) both";
            }, 500);

            setTimeout(()=>{
                let hellow = document.querySelector(".load-hellow");
                hellow.style.animation = "lh 0.5s ease both";
            }, 1500);

            setTimeout(()=>{ // fadeout
                let wrap = document.querySelector("#loadWrap");
                wrap.style.left = "-100%";
                wrap.style.opacity = 0;
                document.body.style = 'overflow:none';
            }, 2500);

            setTimeout(()=>{ // remove fade
                let wrap = document.querySelector("#loadWrap");
                wrap.remove();
            },3500);
        // }
    });
}