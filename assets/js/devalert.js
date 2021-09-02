window.addEventListener('load',()=>{
    document.querySelectorAll('[data-alert]').forEach(x=>{
        let node = x.dataset.alert;
        node = node.replace(node[0], node[0].toUpperCase());
        x.innerHTML = `<span class="px-1 pb-1">${node}</span>`;
    });
});