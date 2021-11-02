'use strict';

! function () {
    if(!sessionStorage['loadCover']) sessionStorage['loadCover'] = true;
    let findTarget = null;
    let isLoaded = null;
    if(sessionStorage['loadCover'] == 'true')
    findTarget = requestAnimationFrame(watchLoading.bind(findTarget, getTarget));
    else {
        isLoaded = requestAnimationFrame(watchLoaded.bind(isLoaded, detectLoad));
    }
}();

function watchLoaded(callback){
    let target = null;
    target = document.querySelector('[data-option="loading"]');
    if(target){
        callback(target);
        cancelAnimationFrame(this);
    } else requestAnimationFrame(watchLoaded.bind(this));
}

function detectLoad(target){
    if(target) target.remove();
}

function watchLoading(callback) {
    let target = null;
    target = document.querySelector('.loadingCover');
    if(target) {
        callback(target);
        cancelAnimationFrame(this); 
    } else requestAnimationFrame(watchLoading.bind(this));
}

function getTarget(target){
    let percent = 0;
    let loading = requestAnimationFrame(animationLoading);
    let optionLoading = target.closest('[data-option="loading"]');
    optionLoading.style.display = 'flex';
    target.style.transition = `.5s cubic-bezier(0.215, 0.610, 0.355, 1)`;
    function animationLoading(){
        setTimeout(()=>{
            if(percent>100){
                sessionStorage['loadCover'] = false;
                optionLoading.style.opacity = '0';
                setTimeout(()=>{
                    optionLoading.remove();
                },1200);
                cancelAnimationFrame(loading);
            } else {
                requestAnimationFrame(animationLoading)
                target.style.height = `${percent}%`;
                percent+=10;
            }
        }, parseInt(Math.random()*700));
    }
}