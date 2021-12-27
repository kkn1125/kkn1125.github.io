const viewWrap = document.querySelector('#viewWrap');
const latestBtn = document.querySelector('#latestBtn');
const latestPosts = document.querySelector('.latest-posts');
const validTime = 1000*60*60*24;
let hiddenInfo;

function isHidden(){
    return getHiddenInfo().hidden;
}

function getHiddenInfo(){
    if(!localStorage['isHidden']) localStorage['isHidden'] = '{}';
    return JSON.parse(localStorage['isHidden']);
}

function setHiddenInfo(data){
    localStorage['isHidden'] = JSON.stringify(data);
}

hiddenInfo = getHiddenInfo();

if(isHidden()){
    // 히든일 때
    if(getHiddenInfo()['maxTime']<new Date().getTime()){
        // 새로 갱신
        hiddenInfo['hidden'] = false;
        setHiddenInfo(hiddenInfo);
        // 다시 최신글 보여줘야함
        latestPosts.removeAttribute('hidden');
    } else {
        // 최신 글 히든
        latestPosts.hidden = true;
    }
}

window.addEventListener('click', handleView);

function handleView(ev){
    const target = ev.target;
    if(target.id != 'latestBtn') return;
    
    if(target.dataset.btn == 'latest' && !isHidden()){
        setHiddenInfo({
            maxTime: new Date().getTime() + validTime,
            hidden: true
        });
        latestPosts.hidden = true;
    }
}