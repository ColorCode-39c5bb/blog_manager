export default{
    AboutCard: [
        {   ref: "tree",
            isNativeEvent: true, 
            isManual: false,
            event: "contextmenu", 
            hander: function(event) { contextmenu.bind(this)(event, [
                {   text: '添加节点', 
                    action: ()=>{
                        this.addNode(event.target.dataset.indexcontent); 
                    } 
                },
                {   text: '添加段落', 
                    action: ()=>{
                        this.addText(event.target.dataset.indexcontent); 
                    } 
                },
                {   text: '删除画板', 
                    action: ()=>{
                        this.deleteTree(event.target.dataset.indexcontent);
                        // this.addNode(); 
                    } 
                },
            ]) }
        },
        {   ref: "content",
            isNativeEvent: true, 
            isManual: false,
            event: "contextmenu", 
            hander: function(event) { contextmenu.bind(this)(event, [
                {   text: '添加画板', 
                    action: ()=>{
                        this.addTree(event.target.dataset.indexcontent);
                        // this.addNode(); 
                    } 
                },
                {   text: '删除段落', 
                    action: ()=>{
                        this.deleteText(event.target.dataset.indexcontent);
                        // this.addNode(); 
                    } 
                },
            ]) }
        },
    ],
    
    TreeNode: [
        {   ref: "nodeName",
            isNativeEvent: true, 
            isManual: false,
            event: "contextmenu", 
            hander: function(event) { contextmenu.bind(this)(event, [
                {   text: '添加节点', 
                    action: ()=>{
                        this.addNode();
                    } 
                },
                {   text: '删除节点', 
                    action: ()=>{
                        this.deleteNode_(this.node, this.indexContent);
                    } 
                },
            ]) }
        },
    ],

    ArticleCard: [
        {   ref: "article",
            isNativeEvent: true,
            isManual: false,
            event: "contextmenu",
            hander: function(event) { contextmenu.bind(this)(event, [
                {   text: '删除文章', 
                    action: ()=>{
                        this.deleteArticle_(this.indexArticle);
                    } 
                }
            ]) }
        }
    ],
}

function contextmenu(event, items){
    event.preventDefault(); // 阻止默认右键菜单
    event.stopPropagation();
    event.target.blur();
    // 创建菜单容器
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    menu.style.boxShadow = 'var(--box_shadow_small)';
    menu.style.zIndex = '1';
    menu.style.padding = '5px 0';

    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.textContent = item.text;
        itemEl.style.padding = '5px 15px';
        itemEl.style.cursor = 'pointer';
        itemEl.onmouseenter = () => {itemEl.style.background = 'var(--BGC_hover)';itemEl.style.color='var(--font_color_hover)'};
        itemEl.onmouseleave = () => {itemEl.style.background = 'transparent'; itemEl.style.color='var(--font_color)'}
        itemEl.onclick = (e) => {
            item.action();
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
            e.stopPropagation();
        };
        menu.appendChild(itemEl);
    });

    // 添加到 body 并绑定全局点击关闭
    document.body.appendChild(menu);
    const closeMenu = (e) => {
        // 如果点击的不是菜单本身
        if (!menu.contains(e.target)) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        }
    };
    document.addEventListener('click', closeMenu);
}