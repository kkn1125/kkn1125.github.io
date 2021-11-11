const imgs = document.querySelectorAll('.article-post img:not(.donaricano)');
let clicked = false;
let zoomLayer = 100;
let moved;
let moving = false;
let click_position_X = 0;
let click_position_Y = 0;
let originX = 0;
let originY = 0;

let downListener = (ev)=>{
    moved = true;
    moving = false;
    originX = parseInt(getComputedStyle(ev.target)['left'].slice(0,-2));
    originY = parseInt(getComputedStyle(ev.target)['top'].slice(0,-2));
    click_position_X = ev.clientX;
    click_position_Y = ev.clientY;
}

let upListener = () => {
    moved = false;
}

imgs.forEach(img=>{
    img.draggable = false;
    img.addEventListener('click', (ev)=>{
        document.body.classList.add("noScroll");
        if(!clicked){
            let copy = img.cloneNode();
            let pop = document.createElement('div');
            let zoom = document.createElement('div');
            let btn = document.createElement('button');
            copy.classList.add("zoomIn");
            pop.id = "pop";
            pop.classList.add("popup");
            pop.prepend(zoom);
            zoom.classList.add('zoom');
            zoom.prepend(copy);
            zoom.prepend(btn);
            btn.innerHTML = "&times;";
            btn.classList.add('btn','btn-danger', 'position-absolute');
            btn.style.right = '2em';
            btn.addEventListener('click', ()=>{
                pop.classList.remove("show");
                setTimeout(()=>{
                    pop.remove();
                    clicked = false;
                    document.body.classList.remove("noScroll");
                }, 300);
            });

            copy.addEventListener('click', (evt)=>{
                if(!moved && !moving){
                    if(copy.classList.contains("zoomOut")){
                        copy.classList.replace("zoomOut","zoomIn");
                    }
                    let zoomIn = evt.target;
                    zoomIn.style.cssText = `
                        width: ${zoomLayer}%;
                        top: ${evt.target.style.top};
                        left: ${evt.target.style.left};
                    `;
                    if(zoomLayer == 150){
                        copy.classList.replace("zoomIn","zoomOut");
                    }
                    if(zoomLayer>150){
                        zoomLayer = 100;
                        zoomIn.style.cssText = `
                            width: ${zoomLayer}%;
                            top: 0;
                            left: 0;
                        `;
                    }
                    zoomLayer+=10;
                }
            });

            copy.addEventListener('mousedown', downListener);
            copy.addEventListener('mousemove', evt=>{
                if (moved) {
                    moving = true;
                    let oX = evt.clientX;
                    let oY = evt.clientY;
                    evt.target.style.cssText = `
                        top: ${originY + (oY-click_position_Y)}px;
                        left: ${originX + (oX-click_position_X)}px;
                        width: ${evt.target.style.width};
                    `;
                } else {
                    moving = false;
                    moved = false;
                }
            });
            window.addEventListener('mouseup', upListener);

            document.body.prepend(pop);
            setTimeout(()=>{
                pop.classList.add('show');
            }, 300);
            clicked = true;
        }
    });
});