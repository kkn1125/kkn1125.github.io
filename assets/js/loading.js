'use strict';

! function () {
    const html = `<div data-option="loading">
    <div class="w-flex flex-column align-items-center text-uppercase">
        <div class="display-3">
            devkimson
        </div>
        <div class="loadingImg-wrap">
            <div class="loadingImg" style="background-image: url(/assets/images/logo-k-mono.png);"></div>
            <div class="loadingCover">
                <div class="loadingImg" style="background-image: url(/assets/images/logo-k-color.png);"></div>
            </div>
        </div>
        <div class="display-3">
            hello
        </div>
    </div>
    </div>`;
    const element = new DOMParser().parseFromString(html, 'text/html').body.children[0];
    document.body.append(element);
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
    document.body.setAttribute('scroll', 'disabled');
    function animationLoading(){
        setTimeout(()=>{
            if(percent>100){
                sessionStorage['loadCover'] = false;
                optionLoading.style.opacity = '0';
                setTimeout(()=>{
                    optionLoading.remove();
                    document.body.removeAttribute('scroll');
                },900);
                cancelAnimationFrame(loading);
            } else {
                requestAnimationFrame(animationLoading)
                target.style.height = `${percent}%`;
                percent+=10;
            }
        }, parseInt(Math.random()*100));
    }
}