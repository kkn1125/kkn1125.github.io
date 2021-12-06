'use strict';

$('.scrolldown').on('click', (self) => {
    var heights = $(self.currentTarget).parents().find('.section[id]').has($(self.currentTarget));
    var indexing = $(self.currentTarget).parents().find('.section[id]').index(heights);
    var target = $(self.currentTarget).parents().find('.section[id]')[indexing + 1];
    $('html, body').animate({
        scrollTop: $(target).offset().top
    }, 300);
});

/* data-bar 퍼센트반응 기능 */
if(document.querySelector('[data-value]')){
    document.querySelectorAll('span[data-value]').forEach(x=>{
        let per = x.dataset.value;
        let span = document.createElement('span');
        let span2 = document.createElement('span');
        span.classList.add('value');
        
        x.appendChild(span);
        span2.classList.add("ms-2");
        x.parentNode.appendChild(span2);
        // span2.innerHTML = `${per}%`;
        let i = 1;
        let set = setInterval(()=>{
            let num = i.toFixed(0);
            span.style.cssText = `
                width: ${i}%;
            `;
            span2.innerHTML = `${num}%`;
            if(i==per){
                clearInterval(set);
            }
            i+=0.5;
        }, 10);
    })
}
/* data-bar 퍼센트반응 기능 */

/* 스토리 진행 코드 */

/* 스토리 진행 코드 */

$(window).scroll(function () { // 메인페이지 스크롤 반응 바
    var vw = $(window).height() / 10;
    if ($(window).scrollTop() > 100 + vw) {
        $('[data-float="who"]').addClass("floating");
        $('[data-float="origin"]').addClass("hide");
    } else if ($(window).scrollTop() <= 100 + vw) {
        $('[data-float="who"]').removeClass("floating");
        $('[data-float="origin"]').removeClass("hide");
    }
});

$('[data-folder="true"]').find('tr:nth-child(n+2)').css("display", "none");

function toggleBtn(self) {
    var tar = $(self).parent().parent().next();
    if ($('[data-folder]').attr("data-folder") == "true") {
        tar.attr("data-folder", "false");
        tar.find('tr:nth-child(n+2)').fadeIn(1000);
        $(self).html('접기');
    } else {
        tar.attr("data-folder", "true");
        tar.find('tr:nth-child(n+2)').fadeOut(1000);
        $(self).html('펼치기');
    }
}

window.addEventListener('load', function(){
    let langArr = document.querySelectorAll('.article-post [class|="language"]');
    langArr.forEach(el=>{
        if(el.getAttribute("class").indexOf("plaintext")==-1){
            let lang = el.classList[0].split("-")[1].toLowerCase();
            let color = "";
            // let br = document.createElement("br");
            let made = document.createElement("span");
            let wrap = document.createElement("span");
            let badge = document.createElement("span");
            
            switch(lang){
                case 'java':
                    color = "primary"
                    break;
                case 'bash':
                    color = "dark"
                    break;
                case 'jsp':
                    color = "warning"
                    break;
                case 'html':
                    color = "danger"
                    break;
                case 'css':
                    color = "info"
                    break;
                case 'javascript':
                    color = "warning"
                    break;
                case 'json':
                    color = "light"
                    break;
                case 'sql':
                    color = "secondary"
                    break;
                case 'xml':
                    color = "success"
                    break;
                case 'properties':
                    color = "dark"
                    break;
            }

            made.innerHTML = `Devkimson`;
            made.setAttribute("class","d-block badge text-end text-light made")
            
            badge.setAttribute("class","lang-badge p-2 badge bg-"+color);
            // 210809 mysql 설정
            badge.innerHTML = `${(lang=='sql'?"My":"")+lang.charAt(0).toUpperCase()+lang.slice(1)}`;
            wrap.setAttribute("class","wrap-badge position-absolute d-flex flex-column");

            wrap.setAttribute("data-unselect","true");
            
            el.classList.add("position-relative");
            wrap.appendChild(made);
            wrap.appendChild(badge);
            // wrap.appendChild(br);
            el.prepend(wrap);
        }
    });
});

window.addEventListener('keydown', (ev)=>{
    if((ev.ctrlKey && ev.shiftKey && ev.key == 'I') || (ev.ctrlKey && ev.shiftKey && ev.key == 'C') || ev.key === "F12"){
        ev.preventDefault();
        alert("개발자 도구가 금지된 블로그입니다.");
    }
    if(ev.ctrlKey && ev.key == 'c'){
        ev.preventDefault();
        alert("무분별한 복사를 방지하기 위함입니다. 클립보드 버튼을 이용해주세요.");
    }
});

window.addEventListener('contextmenu', (ev)=>{
    ev.preventDefault();
    alert("우클릭이 금지된 블로그입니다.")
    return false;
}, false);

// 클립보드
document.querySelectorAll(".rouge-code").forEach(x=>{
    let btn = document.createElement('button');
    btn.innerHTML = "Copy";
    btn.setAttribute("class","cpbtn btn btn-sm btn-info");
    btn.addEventListener('click', ()=>{
        let ta = document.createElement('textarea');
        document.body.appendChild(ta);
        ta.value = x.textContent+'[출처] :: devkimson 블로그';
        ta.select();
        document.execCommand("Copy");
        document.body.removeChild(ta);
        alert("복사가 완료되었습니다.");
    });
    x.parentNode.parentNode.parentNode.parentNode.parentNode.prepend(btn);
});

// 메일 유효성검사
function valid(){
    let name = document.querySelector('[name="name"]');
    let email = document.querySelector('[name="email"]');
    let phone = document.querySelector('[name="phone"]');
    let x,y,z = [false,false,false]
    let rex1 = /^[가-힣]{2,4}$/gi;
    if(rex1.test(name.value)==true){
        console.log('이름 통과');
        x=true;
    }
    let rex2 = /^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/gi
    if(rex2.test(email.value)==true){
        console.log('메일 통과');
        y=true;
    }
    let rex3 = /^[0-9]+$/gi
    if(rex3.test(phone.value)==true){
        console.log('번호 통과');
        z=true;
    }
    if(x && y && z){
        return true;
    } else {
        alert('이름, 번호, 이메일란을 다시 확인해주세요.');
        return false;
    }
}

// 메일 전송
if(document.getElementById('sendMail'))
document.getElementById('sendMail').addEventListener('click', function () {
    let name = document.querySelector('[name="name"]');
    let email = document.querySelector('[name="email"]');
    let message = document.querySelector('[name="message"]');
    let phone = document.querySelector('[name="phone"]');
    let type = document.querySelector('[name="type"]');
    
    if(valid()){

        $.ajax({
            data: {
                name: name.value,
                message: message.value,
                email: email.value,
                phone: phone.value,
                type: type.value==1?'질문':'제안'
            },
            url: 'https://script.google.com/macros/s/AKfycbzcKHV1ldNC0BmgldYDLEMGjqYdWCqkn-G85ptXK1Y9woc835I/exec',
            method: 'post',
            success: (data) => {
                console.log(data)
                parsing = JSON.parse(data.data);
                let r_name = parsing.name[0];
                let r_message = parsing.message[0];
                let r_email = parsing.email[0];
                if (data.result == 'success') {
                    alert(`${r_name}님의 메일이 발송되었습니다.`);
                }
                name.value='';
                email.value='';
                message.value='';
                phone.value='';
                type.value='';
                document.querySelector('.se-wrapper-inner.se-wrapper-wysiwyg.sun-editor-editable').innerHTML='';
            },
            error: (xhr, err) => {
                console.log(err);
            }
        });
    }

});

window.addEventListener('load', footerHandler);
window.addEventListener('resize', footerHandler);
function footerHandler(ev){
    let footer = document.querySelector('footer.footer');
    let winHeight = window.innerHeight;
    let bodyHeight = document.body.clientHeight;
    let footerHeight = footer.clientHeight;
    if(winHeight>=bodyHeight){
        if(footer.style.position!='absolute') footer.style.position = 'absolute';
        footer.style.top = `${parseFloat(winHeight-footerHeight-51)}px`;
    }
}

let NewsAlert = (function () {
    function Controller() {
        let moduleModel = null;
        let uiElem = null;
        let moduleOptions = null;

        this.init = function (model, ui, options) {
            moduleModel = model;
            uiElem = ui;
            moduleOptions = options;

            window.addEventListener('load', this.makeAlert);
            uiElem.body.addEventListener('click', this.removeAlertHandler);
            uiElem.body.addEventListener('click', this.allClose);
        }

        this.allClose = function(ev){
            let target = ev.target;
            if(target.id !== 'allClose') return;
            moduleModel.allClose(ev);
        }

        this.makeAlert = function (ev) {
            moduleModel.makeAlert(ev, uiElem, moduleOptions);
        }

        this.removeAlertHandler = function (ev) {
            moduleModel.removeAlertHandler(ev, uiElem);
        }
    }

    function Model() {
        let moduleView = null;
        let alertList = [];

        this.init = function (view) {
            moduleView = view;
        }

        this.setStorage = function(){
            sessionStorage['alertList'] = JSON.stringify(alertList);
        }

        this.getStorage = function(){
            if(sessionStorage['alertList']) {
                let alert = function(text, session){
                    this.id = 0;
                    this.text = text;
                    this.show = true;
                    this.autoIndex = function(){
                        this.id = alertList.indexOf(this);
                    }
                    this.session = session;
                }
                let alerts = JSON.parse(sessionStorage['alertList']);
                alerts.forEach(x=>{
                    this.addAlertList(new alert(x.text, x.session));
                });
            } else {
                this.setStorage();
            }
        }

        this.makeAlert = function (ev, ui, options) {
            let alert = function(text){
                this.id = 0;
                this.text = text;
                this.show = true;
                this.autoIndex = function(){
                    this.id = alertList.indexOf(this);
                }
                this.session = 'on';
            }
            this.getStorage();
            if(this.changedValid(options)) this.resetStorage();
            if(alertList.length==0 || alertList[0]==null){
                options.alertlist.forEach((news)=>{
                    this.addAlertList(new alert(news));
                });
            }
            this.setStorage();
            this.updateView();
        }

        this.resetStorage = function(){
            sessionStorage['alertList'] = '';
            alertList = [];
        }

        this.changedValid = function(options){
            for(let valid in options.alertlist){
                if(alertList[valid] && options.alertlist[valid].trim() != alertList[valid].text.trim()) return true;
            }
            if(options.alertlist.length != alertList.length) return true;
            return false;
        }

        this.allClose = function(ev){
            ev.preventDefault();
            ev.target.parentNode.remove();
            alertList = alertList.map(alert=>{
                alert.session = 'off';
                return alert;
            });
            this.setStorage();
            this.updateView();
        }

        this.removeAlertHandler = function (ev, ui) {
            let target = ev.target;
            if (target.tagName !== 'SPAN' || target.className !== 'news-close') return;
            ev.preventDefault();
            let id = target.parentNode.dataset.newsAlertTag;
            alertList = alertList.map(alert=>{
                if(alert.id==id) {
                    alert.session = 'off';
                }
                return alert;
            });
            this.setStorage();
            this.updateView();
        }

        this.addAlertList = function (alert) {
            alertList.push(alert);
            alertList.forEach(alert=>alert.autoIndex());
        }

        this.updateView = function () {
            let usableSession = alertList.filter(alert=>alert.session!=='off');
            moduleView.updateView(usableSession);
        }
    }

    function View() {
        let uiElem = null;

        this.init = function (ui) {
            uiElem = ui;
        }

        this.updateView = function (alertList) {
            let view = uiElem.body.querySelector('[news-alert]')
            this.clearView(view);
            if(alertList.length>0) view.innerHTML += `<div class="text-end">
                <button id="allClose" class="btn btn-danger btn-sm">전부 닫기</button>
            </div>`;
            alertList.forEach(alert=>{
                view.innerHTML += `<div data-news-alert-tag="${alert.id}"><span class="alert-text">${alert.text}</span>
                <span class="news-close">&times;</span>
                </div>
                    `;
            });
        }

        this.clearView = function(view){
            view.innerHTML = '';
        }
    }
    return {
        init: function (options) {

            const body = document.body;

            const ui = {
                body
            };

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(ui);
            model.init(view);
            controller.init(model, ui, options);
        }
    }
})();

NewsAlert.init({
    alertlist: [
        'Penli CSS 가 <kbd>v0.1.3</kbd>로 업데이트 되었습니다. 많은 관심 바랍니다! <a class="d-inline-block" href="https://github.com/kkn1125/penli" target="_blank">[바로가기]</a>',
        '<kbd class="bg-info">Wikimson</kbd>을 구현하고 첫 게시했습니다! 많은 관심 부탁드립니다!',
        'DocumentifyJS 업데이트가 있습니다! 현재 v1.0.0 버전 최신입니다. 자세한 내용은 아래 링크 참조바랍니다. <a class="d-inline-block" href="https://github.com/kkn1125/mkDocumentifyJS/tree/main" target="_blank">[바로가기]</a>',
        'Typer가 v1.0.0로 릴리즈 되었습니다! 새로운 기능 <kbd class="kbd">realTyping</kbd>이 추가되었습니다. 자세한 사항은 아래 링크를! <a class="d-inline-block" href="https://github.com/kkn1125/typer" target="_blank">[바로가기]</a>',
        'Tutorial js 가 <kbd>v0.1.1</kbd>로 업데이트 되었습니다. 많은 관심 바랍니다! <a class="d-inline-block" href="https://github.com/kkn1125/tutorial" target="_blank">[바로가기]</a>',
        'Jekyll Theme를 만드는 중입니다. <a class="d-inline-block" href="https://github.com/kkn1125/lessmore-jekyll-theme" target="_blank">[바로가기]</a>',
    ]
});