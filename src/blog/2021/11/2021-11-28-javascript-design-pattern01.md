---
slug: "/javascript-design-pattern01/"
layout: post
modified: 2022-03-14 00:09:35 +0000
date:   2021-11-28 14:35:56 +0000
title:  "[JAVASCRIPT] 자바스크립트 디자인 패턴 - 모듈 패턴"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ javascript, module, design pattern, til ]
description: "Module Pattern

포스팅이 뜸 했습니다. 최근에 `Typer` 한글 분해 타이핑 기능과 `Documentify` 문서화 기능을 마무리 짓느라 포스팅에 소홀했는데요. 이번에는 이제 익숙해져버린 모듈 패턴을 기록해두려합니다.

구조

몇 달 전에 참고했던 러시아 분의 `tagEditor` 라는 저장소를 방문하여 이슈를 주고 받고, 해당 코드를 공부삼아 클론한 적이 있습니다. 그 당시 이해되지 않던 복잡해보이는 패턴을 사용해보고 변경해보고 활용하다보니 이제는 이렇게 코드를 짜지 않으면 성에 안차는 정도가 되었습니다.

활용되었던 형태는 이렇습니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# Module Pattern

포스팅이 뜸 했습니다. 최근에 `Typer` 한글 분해 타이핑 기능과 `Documentify` 문서화 기능을 마무리 짓느라 포스팅에 소홀했는데요. 이번에는 이제 익숙해져버린 모듈 패턴을 기록해두려합니다.

## 구조

몇 달 전에 참고했던 러시아 분의 `tagEditor` 라는 저장소를 방문하여 이슈를 주고 받고, 해당 코드를 공부삼아 클론한 적이 있습니다. 그 당시 이해되지 않던 복잡해보이는 패턴을 사용해보고 변경해보고 활용하다보니 이제는 이렇게 코드를 짜지 않으면 성에 안차는 정도가 되었습니다.

활용되었던 형태는 이렇습니다.

```javascript
'use strict';
const Sample = (function(){
    function Controller(){
        this.init = function(){
            
        }
        // this.* :: method
    }

    function Model(){
        this.init = function(){
            
        }
        // this.* :: method
    }

    function View(){
        this.init = function(){

        }
        // this.* :: method
    }

    return {
        init: function(){
            // 정의되는 초기화 내용
        }
    }
})(); // 괄호 있습니다!
```

전체적으로 기존에 전역으로 함수를 짜던 때와 달리 클로저 내에 감싸져 내용을 확실히 알기 어렵습니다. 깃허브에 올린다면 물론 공개되어지겠지만요.

이런 부분에서는 난독화와 압축이 필요하겠지만 아직 모르기 때문에 추후에 기록을 남기려 합니다.

위 코드를 보면 단순하게 3가지로 나뉘는데 아주 익숙한 이름들입니다.

1. Controller
2. Model
3. View
4. return init {function}

### Controller

`MVC`패턴을 완전히 알고 있지 않지만 사용하는 측면에서 설명드리자면 여기서 `Controller`는 이벤트를 관리하는 것이 주 였습니다.

페이지를 주제로 한다면 페이지 경로를 처리하는 부분이 되겠습니다. 예를 들어 `todo-list`를 만든다면 `Controller`에서 삭제 버튼이나 입력버튼에 대한 이벤트를 관리해주고, 메서드를 `Model`로 넘겨 처리하게됩니다.

### Model

`Controller`에서 실행된 메서드가 모델 내에 있는 메서드를 호출합니다. 호출된 메서드는 크게 두 가지로 나뉩니다.

1. 데이터 `가공 | 처리`
2. `View` 메서드를 호출해서 `View` 내의 메서드에 `위임`

호출된 메서드는 필요에 따라 처리된 데이터를 가지고 혹은 없이 `View` 내의 메서드를 호출하며 `View`로 넘겨 처리합니다.

### View

`Model`에서 받은 데이터를 화면에 구현해주는 기능만 담당하게 됩니다. 이때 데이터를 보존해 두고 `template`형식으로 뿌려주는 것이 효과적이라는 생각이 듭니다. 여러 번 연습 할 때 자주 실수 했던 부분인데요. 데이터 원본을 변형시켜 출력하면 수정, 찾기, 삭제 등등의 이어지는 작업에 코드가 엉망이 되는 것을 많이 경험했습니다.

## 예제

설명은 읽어도 사람마다 차이가 있기 때문에 예제를 몇가지 들겠습니다.

만약 `todo-list`를 만든다는 가정을 들겠습니다.

```javascript
const TodoList = (function(){
    function Controller(){
        this.init = function(){
            // 초기화 코드
        }
        // this.* :: method
    }

    function Model(){
        this.init = function(){
            // 초기화 코드
        }
        // this.* :: method
    }

    function View(){
        this.init = function(){
            // 초기화 코드
        }
        // this.* :: method
    }

    return {
        init: function(){
            // 정의되는 초기화 내용
        }
    }
})();
```

우선 기본 틀을 같습니다. 그런데 여기 사용하는 방식 중에 두 가지 나눌 수 있는데요. `html`에 미리 컴포넌트를 만들고 그 대상으로 기능을 넣는 방식과 `TodoList`함수로 컴포넌트를 생성해서 사용하는 방식입니다.

생성하는 방식을 저는 선호하기 때문에 두 번째 방법으로 하겠습니다.

```javascript
// 컴포넌트 생성과 init 설정

const generator = {
    'todos': {
        wrapPannel: {
            render: ()=>`<div class="wrap-pannel">
                <div class="title">Todo List</div>
                <div class="list-wrap"></div>
            </div>`;
        },
        addPannel: {
            render: ()=>`<ol id="list-group"></ol>`;
        }
    },
    'list-item': {
        render: ({key, text})=>`<div data-key="${key}" class="list-item">
            <span class="text">${text}</span>
            <span><button class="del-btn">&times;</button></span>
        </div>`;
    },
};

const TodoList = (function(){
    // mvc ... 
    return {
        init: function(){
            const components = {
                generator
            }

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(components);
            model.init(view);
            controller.init(model);
        }
    }
}
```

위 코드 처럼 `generator`를 만들고 `render`메서드를 하나씩 주고 이후에 `object`를 `for ... in`으로 처리하면 데이터를 받아 `render`만 찍어주면 알아서 순서에 맞게 `html`이 들어가도록 작업 할 수 있습니다.

```javascript
// mvc 설정 예

// const generator...

const TodoList = (function(){
    // mvc ... 

    function Controller(){
        let models = null;

        this.init = function(model){
            models = model;

            models.renderList();
            window.addEventListener('click', this.listHandler);
        }

        this.listHandler = function(ev){
            let target = ev.target;
            let type = target.dataset.type;
            if(type !== 'add' && type !== 'delete' && type !== 'update') return;
            ev.preventDefault();
            
            switch(type){
                case 'add':
                    this.addList(target);
                    break;
                case 'delete':
                    this.deleteList(target);
                    break;
                case 'update':
                    this.updateList(target);
                    break;
            }
        }
        
        this.addList = function(){
            models.addList();
        }

        this.deleteList = function(){
            models.deleteList();
        }

        this.updateList = function(){
            models.updateList();
        }
    }

    function Model(){
        let views = null;
        let todos = [];

        this.init = function(view){
            views = view;

            this.getStorage();
        }

        this.setStorage = function(){
            localStorage['todos'] = JSON.stringify(todos);
        }

        this.getStorage = function(){
            todos = JSON.parse(localStorage['todos'])??'[]';
        }

        this.renderList = function(){
            views.renderList(todos);
        }

        this.addList = function(){
            // 작성해봅시다
        }

        this.deleteList = function(){
            // 작성해봅시다
        }

        this.updateList = function(){
            // 작성해봅시다
        }
    }

    function View(){
        let parts = null;
        let app = null;
        let wrap = null;
        let listPannel = null;

        this.init = function(components){
            parts = components;

            this.createApp();
        }

        this.createApp = function(){
            app = document.createElement('div');
            app.id = 'app';
            document.body.insertAdjacentElement('beforeEnd', app);
            this.generateAllParts();
        }

        this.generateAllParts = function(){
            app.insertAdjacentElement('beforeEnd', parts.generator.todos.wrapPannel.render());

            wrap = document.querySelector('list-wrap');

            wrap.insertAdjacentElement('beforeEnd', parts.generator.todos.addPannel.render());

            listPannel = document.querySelector('list-group');
        }

        this.renderList = function(todos){
            this.clearList();

            todos.forEach(todo=>{
                app.insertAdjacentHTML('beforeEnd', parts.generator['list-item'].render(todo));
            });
        }

        this.clearList = function(){
            listPannel.innerHTML = '';
        }
        // this.* :: method
    }

    return {
        init: function(){
            // init 설정 ...
        }
    }
}
```

`add`와 `delete`, `update`기능은 제외 했습니다. 눈 대중으로 작성한 코드들이라 오작동할 수도 있으니 참고바랍니다.

이벤트 연결과 뿌려지는 것까지 되었으니 이후 작업은 순조로울 듯 합니다.

`mixin` 패턴을 공부 중에 있습니다만 조합해서 어떻게 활용할지는 다음 포스팅에 다루겠습니다.

물론 기능이나 프로젝트 내용 등을 고려했을 때 적합한 패턴을 사용해야 할 것 같다는 생각이 듭니다만 체득하는 것이 우선이라는 생각에 이것저것 합니다.

이런게 하나 씩 모이면 발전 되지 않을까 하며 포스팅을 마칩니다...