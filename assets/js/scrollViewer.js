const body = document.body;
const main = document.querySelector('main');
const gnb = document.querySelector('nav.gnb');
let scrolled = 'pause';
let scrollMaxPauseTime = 2;

body.addEventListener('scroll', scrollViewer);
window.addEventListener('click', handleSideBar);

function handleSideBar(ev){
    const target = ev.target;
    if(target.id != 'delBtn') return;

    document.querySelector('#lsb').classList.remove('show');
    document.querySelector('#lsb').classList.add('hide');
}

function scrollViewer(ev){
    const scrollBarVisiblePoint = document.body.scrollHeight;
    scrolled = 'scroll';
    // 스크롤 되는 비율을 나타내고자 한다.
    // 1. 전체길이와 화면길이의 차이를 구한다.
    // 2. 스크롤의 현재 위치를 구한다.
    // console.log(window.innerHeight,scrollBarVisiblePoint)
    if(window.innerHeight<scrollBarVisiblePoint){
        // 윈도우 높이가 스크롤 발생지점 값보다 작다면
        // 스크롤이 발생하기 때문에 수치화된 스크롤 비율을 나타낸다.
        
        const scrollMaximumValue = scrollBarVisiblePoint - window.innerHeight;
        const currentScrollPoint = body.scrollTop;
        const scrollPercent = (currentScrollPoint/scrollMaximumValue)*100;
        
        console.log()
        renderScrollGauge(scrollPercent.toFixed(2));
    } else {
        // 스크롤이 없기 때문에 동작 안하도록 한다.
    }
    return body.scrollTop;
}

function renderScrollGauge(gaugeValue){
    const gauge = body.querySelector('#scrollGauge');
    const validDigit = gaugeValue.toString().split('.');
    let temp = validDigit[1] == '00'
    ?validDigit[0]
    :gaugeValue;

    if(!gauge){
        const box = document.createElement('div');
        box.id = 'scrollGauge';
        box.classList.add('tag','tag-info');
        body.append(box);
        box.innerHTML = `<span></span><span> / </span><span>100</span>`;
    } else {
        gauge.children[0].textContent = `${temp}`;
    }
}

let detectPauseScrolling = setInterval(() => {
    const gauge = body.querySelector('#scrollGauge');

    if(scrolled!=='scroll'){
        setTimeout(()=>{
            scrolled = 'ready';
            if(gauge) {
                gauge.classList.add('gauge-hide');
                setTimeout(()=>{
                    gauge.remove();
                }, 300);
            }
        }, scrollMaxPauseTime);
    } else {
        scrolled = 'pause';
    }
}, 1000);