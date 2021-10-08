$('.scrolldown').on('click', (self) => {
    var heights = $(self.currentTarget).parents().find('.section[id]').has($(self.currentTarget));
    var indexing = $(self.currentTarget).parents().find('.section[id]').index(heights);
    var target = $(self.currentTarget).parents().find('.section[id]')[indexing + 1];
    $('html, body').animate({
        scrollTop: $(target).offset().top
    }, 300);
});

/* data-bar 퍼센트반응 기능 */
$(document).ready(function () {
    $('[data-bar]').each(function (index, item) {
        $(this).css("width", $(this).data("bar") + "%");
        $(this).html($(this).data('bar') + "%");
    });
    // 	$('[data-bar]').css("width", $('[data-bar]').data("bar")+"%");
    // 	$('[data-bar]').html($('[data-bar]').data('bar')+"%");
});

/* 스토리 진행 코드 */
var storyLine = $('#storyLine');
storyLine.html($('[data-type="story"]').html());
var count = $('[data-type="story"]').parent().children('span').length;
$('#tot').html(count);

function prevStory() {
    var i = $('[data-type="story"]').parent().find('span').index($('[data-type="story"]'));
    // 	console.log(i);
    if ($('[data-type="story"]').prev().text() == "") {
        $('[data-type="story"]').parent().children('span').last().attr("data-type", "story").prevAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html());
    } else {
        $('[data-type="story"]').prev().attr("data-type", "story").nextAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html())
            .css("display", "none").slideDown(300);
    }
    $('#cur').html(i == 0 ? count : i);
    $('[data-page]').css("width", i == 0 ? "100%" : (i / count * 100) + "%"); // rangebar
}

function nextStory() {
    var i = $('[data-type="story"]').parent().find('span').index($('[data-type="story"]')) + 2;
    // 	console.log(i);
    if ($('[data-type="story"]').next().text() == "") {
        $('[data-type="story"]').parent().children('span').first().attr("data-type", "story").nextAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html());
    } else {
        $('[data-type="story"]').next().attr("data-type", "story").prevAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html())
            .css("display", "none").slideDown(300);
    }
    $('#cur').html(i == count + 1 ? 1 : i);
    $('[data-page]').css("width", i == count + 1 ? (1 / count * 100) + "%" : (i / count * 100) + "%"); // rangebar
}

/* 스토리 창 최소화 */
var minimize = 1

function minimization(self) { // 최소화 기능
    var tar = $(self).parent().parent().parent().parent();
    if (minimize == 1) {
        tar.toggleClass("minimize");
        tar.toggleClass("bg-dark");
        minimize = 0;
    }
}

function maximization(self) { // 최대화 기능
    var tar = $(self).parent().parent().parent().parent();
    if (minimize == 0) {
        tar.toggleClass("minimize");
        tar.toggleClass("bg-dark");
        minimize = 1;
        location.href = "#window";
    }
}
var exitnum = 1;

function exit(self) { // exit function
    var tar = $(self).parent().parent().next().find('#storyLine');
    var tops = $('#window');
    if (exitnum == 1) {
        exitnum = 0;
        if (minimize == 1) {
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 5 + ")");
            }, 0000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 4 + ")");
            }, 1000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 3 + ")");
            }, 2000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 2 + ")");
            }, 3000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 1 + ")");
            }, 4000);
            setTimeout(() => {
                storyLine.html($('[data-type="story"]').html());
            }, 5000);
            setTimeout(() => {
                exitnum = 1;
            }, 5000);
        } else {
            console.log('here');
            var span = document.createElement('span');
            span.setAttribute("class", "position-fixed zi-50");
            span.setAttribute("id", "newSpan");
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (5)");
                tops.prepend(spans);
            }, 0);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (4)");
                tops.prepend(spans);
            }, 1000);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (3)");
                tops.prepend(spans);
            }, 2000);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (2)");
                tops.prepend(spans);
            }, 3000);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/portfolio-coffeecong/' class='btn btn-sm btn-outline-info'>바로가기</a> (1)");
                tops.prepend(spans);
            }, 4000);

            setTimeout(() => {
                tops.find("#" + $(span).attr("id")).remove("#" + $(span).attr("id"));
            }, 5000);
            setTimeout(() => {
                exitnum = 1;
            }, 5000);
        }
    }
}

/* 스토리 진행 코드 */
$('#btns>button').on('mouseenter', function () {
    if ($(this).html() == "prev") {
        $(this).html('<i class="fas fa-chevron-left"></i> ' + 'prev');
    }
    if ($(this).html() == "next") {
        $(this).html('next' + ' <i class="fas fa-chevron-right"></i>');
    }
});

$('#btns>button').on('mouseleave', function () {
    if ($(this).html().indexOf("prev") > -1)
        $(this).html('prev');
    if ($(this).html().indexOf("next") > -1)
        $(this).html('next');
});

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

// var i = 0;

// function commentSlide() {
//     if (i > 4) i = 0;
//     //	$('#commentslide>span').toggleClass("show");
//     setTimeout(() => {
//         $('#commentslide>span').toggleClass("show");
//     }, 1500);
//     if (i == 0)
//         $('#commentslide>span').html('<span>개발자가 되기 위해 공부중인 비전공자 입니다.</span>');
//     if (i == 1)
//         $('#commentslide>span').html('<span>Spring을 공부 중입니다.</span>');
//     if (i == 2)
//         $('#commentslide>span').html('<span>현재 포트폴리오를 만들며 취업을 준비하고 있습니다.</span>');
//     if (i == 3)
//         $('#commentslide>span').html('<span>다양한 취미를 가지고자 합니다. 자기계발을 중요하게 생각합니다.</span>');
//     if (i == 4)
//         $('#commentslide>span').html('<span>어제보다 더 발전 중입니다.</span>');
//     //	$('#commentslide>span').toggleClass("show");
//     setTimeout(() => {
//         $('#commentslide>span').toggleClass("show");
//     }, 8000);

//     setTimeout(commentSlide, 10000);
//     i++;
// }

// window.addEventListener('load', function () {
//     commentSlide();
// });

// tooltip builder x

// window.addEventListener('load', function(){
//     let arr = document.querySelectorAll('.article-post a');
//     arr.forEach((el)=>{
//         if(el.getAttribute("title")){
//             el.setAttribute("data-toggle","tooltip");
//             el.setAttribute("data-placement","top");
//             el.setAttribute("data-original-title",el.getAttribute("title"));
//             el.setAttribute("title","");
//         }
//     });
// })

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
                    color = "primary text-dark"
                    break;
                case 'bash':
                    color = "dark text-dark"
                    break;
                case 'jsp':
                    color = "warning text-dark"
                    break;
                case 'html':
                    color = "danger text-dark"
                    break;
                case 'css':
                    color = "info text-dark"
                    break;
                case 'javascript':
                    color = "warning text-dark"
                    break;
                case 'json':
                    color = "light text-dark"
                    break;
                case 'sql':
                    color = "secondary text-white"
                    break;
                case 'xml':
                    color = "success text-white"
                    break;
                case 'properties':
                    color = "dark text-white"
                    break;
            }

            made.innerHTML = `Devkimson`;
            made.setAttribute("class","d-block badge text-end text-light made")
            
            badge.setAttribute("class","lang-badge p-2 badge badge-"+color);
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

window.addEventListener('load',()=>{
    function httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp;
    }
    let response = httpGet(location.href);
    if(response.status==404){
        let b = document.getElementById('videoBike');
        let vl = document.getElementById('videoLimit');
        let [w, h] = [window.innerWidth, window.innerHeight];
        let max = document.body.clientHeight;
        if(window.innerWidth > b.clientWidth){
            b.style.cssText = `
                width: ${w}px;
                height: auto;
            `;
        } else {
            b.style.cssText = `
                width: auto;
                height: ${h}px;
            `;
        }
        if(window.innerWidth <= 768){
            vl.style.cssText = `
                width:${w}px;
                height: ${h}px;
                max-height: ${max}px;
            `;
        } else {
            vl.style.cssText = `
                width:${w}px;
                height: ${h-50}px;
                max-height: ${max}px;
            `;
        }
        window.addEventListener('resize', ()=>{
            w = window.innerWidth;
            h = window.innerHeight;
            if(window.innerWidth > b.clientWidth){
                b.style.cssText = `
                    width: ${w}px;
                    height: auto;
                `;
            } else {
                b.style.cssText = `
                    width: auto;
                    height: ${h}px;
                `;
            }
            if(window.innerWidth <= 768){
                vl.style.cssText = `
                    width:${w}px;
                    height: ${h}px;
                    max-height: ${max}px;
                `;
            } else {
                vl.style.cssText = `
                    width:${w}px;
                    height: ${h-50}px;
                    max-height: ${max}px;
                `;
            }
        })
    }
});

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
// h태그 앵커 보류
// window.addEventListener('load',()=>{
//     for(let i=1; i<=6; i++){
//         let h = document.querySelectorAll(`h${i}`);
//         h.forEach(x=>{
//             let id = x.getAttribute("id");
//             if(id){
//                 let a = document.createElement('a');
//                 a.style.cssText = 'position: absolute;';
//                 a.href=`#${id}`;
//                 a.classList.add('linkpop');
//                 a.style.cssText = `
//                     top: ${x.offsetTop};
//                     left: ${x.offsetLeft};
//                 `;
//                 a.innerHTML = `🔗 `;
//                 x.prepend(a);
//             }
//         });
//     }
//     if(document.querySelector('[data-value]')){
//         document.querySelectorAll('span[data-value]').forEach(x=>{
//             let per = x.dataset.value;
//             let span = document.createElement('span');
//             let span2 = document.createElement('span');
//             span.classList.add('value');
            
//             x.appendChild(span);
//             span2.classList.add("ms-2");
//             x.parentNode.appendChild(span2);
//             // span2.innerHTML = `${per}%`;
//             let i = 1;
//             let set = setInterval(()=>{
//                 let num = i.toFixed(0);
//                 span.style.cssText = `
//                     width: ${i}%;
//                 `;
//                 span2.innerHTML = `${num}%`;
//                 if(i==per){
//                     clearInterval(set);
//                 }
//                 i+=0.5;
//             }, 10);
//         })
//     }
// });

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