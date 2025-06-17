<template>
<section>

<div class="title">
    <h2 
        v-html="itemCopy.title"
        contenteditable="true" 
        ref="title" 
        @focus="focus($event)" 
        @blur="blur($event)"
    ></h2>

    <div class="article-actions">
        <button @click="addContent()">添加项</button>
        <button v-show="canDelete" @click="buttonDelete()">删除</button>
        <button v-show="didChange" @click="buttonCancle()">取消</button>
        <button v-show="didChange" @click="buttonSave()">保存</button>
    </div>          
</div>

<div v-for="contentItem,indexContent in itemCopy.content" :key="contentItem.id">
    <div 
        v-show="contentItem.text"
        v-html="contentItem.text"
        :data-indexContent="indexContent" 
        class="content"
        contenteditable="true" 
        ref="content" 
        @focus="focus($event)"
        @blur="blur($event)"
    ></div>

    <div class="tree" ref="tree" v-show="contentItem.node" :data-indexContent="indexContent">
        <TreeNode
            v-for="(node,index) in contentItem.node"
            :key="node.id"
            :indexNode="node.indexNode=index"
            :indexContent="indexContent"
            :node="node"
            :nodeChange="()=>didChange=true"
            :repaintLine_="()=>{}"
            :deleteNode_="deleteNode"
        />
    </div>
</div>

</section>
</template>

<script>
import TreeNode from './TreeNode.vue';

export default{
name: "AboutCard",
components: { TreeNode },
props:["item", "index", "buttonDelete_","buttonSave_",],
data(){return {
    didChange: false,
    canDelete: true,
    itemCopy: this.item,
    virtualID: 1,
}},
computed:{
    
},
methods:{
    focus(event){
        const element = event.target;
        console.log(element);
        element.innerText = element.innerHTML;
    },
    blur(event){
        this.didChange = true;
        const element = event.target;
        element.innerHTML = element.innerText;
    },

    buttonSave(){
        this.didChange = false;
        let content = [];
        for(let i=0;this.$refs.content[i];i++)
            content.push({
                text: this.$refs.content[i].innerHTML,
                node: this.itemCopy.content[i].node
            });
        this.buttonSave_(this, {
            id: this.itemCopy.id,
            title: this.$refs.title.innerHTML,
            content: JSON.stringify(content)
        });
    },
    buttonCancle(){
        this.didChange = false;
        this.itemCopy = this.item;
    },
    buttonDelete(){
        this.buttonDelete_(this);
    },
    

    
    addContent(){
        this.itemCopy.content.push( {id: -this.virtualID++, text: "text", node:[]} );
        this.$nextTick(() => {
            this.addListener(this.itemCopy.content.length - 1);
        });
    },
    addText(indexContent){
        if(this.itemCopy.content[indexContent].text) return;
        this.itemCopy.content[indexContent].text = "text";
        this.didChange = true;
    },
    deleteText(indexContent){
        if(!this.itemCopy.content[indexContent].node) {
            this.$delete(this.itemCopy.content, indexContent);
            return;
        }
        this.itemCopy.content[indexContent].text = null;
        this.didChange = true;
    },
    addTree(indexContent){
        if(this.itemCopy.content[indexContent].node) return;
        this.itemCopy.content[indexContent].node = [];
        this.didChange = true;
    },
    deleteTree(indexContent){
        if(!this.itemCopy.content[indexContent].text) {
            this.$delete(this.itemCopy.content, indexContent);
            return;
        }
        this.itemCopy.content[indexContent].node = null;
        this.didChange = true;
    },

    addNode(indexContent){
        this.itemCopy.content[indexContent].node.push( {
            name: "新节点", 
            x: 0, y: 0,
            childrenNode: []
        });
        this.didChange = true;
    },
    deleteNode(subNode, indexContent){
        this.$delete(this.itemCopy.content[indexContent].node, subNode.indexNode);
        this.didChange = true;
    },
},
created(){
    console.log("AboutCardCreated");
    console.log(this);
    for(let i=0,j=0;this.itemCopy.content[i];i++,j=0)
        for(;this.itemCopy.content[i].node&&this.itemCopy.content[i].node[j];j++)
            this.itemCopy.content[i].node[j].id = this.virtualID++;
}
}
</script>

<style scoped>
section{
    margin-bottom: 50px;
    padding: 25px;
    border-radius: 8px;
    box-shadow: var(--box_shadow_middle);
    position: relative;
}

.content >>> ul{
    padding: 25px;
}
.content >>> li {
    margin-bottom: 10px;
    font-size: 125%;
}

.title {
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border_color);
    display: flex;
    justify-content: space-between;
}
h2 i {
    margin-right: 10px;
}

.article-actions {
    display: flex;
    gap: 5px;
}
button {
    min-width: 75px;
    padding: 8px 16px;
    border-radius: 20px;

    cursor: pointer;
    box-shadow: var(--box_shadow_small);
}
button:hover {
    background-color: var(--BGC_hover);
    color: var(--font_color_hover);
}

.tree {
    width: 100%; height: 500px; 
    position: relative; 
    border: 1px dashed var(--border_color); 
}

@media(max-width: 768px){
    li {
        font-size: 75%
    }
    .tree{
        overflow: auto;  
    }
}
</style>