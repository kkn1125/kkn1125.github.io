export default (function NewsAlert () {
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
        let alert = function({title, content, session}){
            this.id = 0;
            this.title = title;
            this.content = content;
            this.show = true;
            this.autoIndex = function(){
                this.id = alertList.indexOf(this);
            }
            this.session = session||'on';
        }

        this.init = function (view) {
            moduleView = view;
        }

        this.setStorage = function(){
            sessionStorage['alertList'] = JSON.stringify(alertList);
        }

        this.getStorage = function(){
            if(sessionStorage['alertList']) {
                let alerts = JSON.parse(sessionStorage['alertList']);
                alerts.forEach(x=>{
                    this.addAlertList(new alert(x));
                });
            } else {
                this.setStorage();
            }
        }

        this.makeAlert = function (ev, ui, options) {
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
                if(alertList[valid] && (options.alertlist[valid].content.trim() != alertList[valid].content?.trim() || options.alertlist[valid].title.trim() != alertList[valid].title?.trim())) return true;
            }
            return options.alertlist.length != alertList.length?true:false;
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
                view.innerHTML += `<div data-news-alert-tag="${alert.id}">
                <div class="news-title">
                    <span>📌 ${alert.title}</span>
                    <span class="news-close">&times;</span>
                </div>
                <div class="news-body">
                    <span class="alert-text">${alert.content}</span>
                </div>
                </div>
                `;
            });
        }

        this.clearView = function(view){
            if(view) view.innerHTML = '';
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