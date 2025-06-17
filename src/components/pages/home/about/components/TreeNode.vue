<template>
<div class="node"> 
    
<span 
    v-html="nodeEditable.name"
    ref="nodeName"
    draggable="true"
    contenteditable="false"
    :style="{ left: node.x + 'px', top: node.y + 'px' }"
    @dragend.stop="relayout($event)"
    @dblclick="dblclick"
    @blur="blur"
></span>

<div v-if="nodeEditable.childrenNode[0]">
    <TreeNode 
        v-for="(childrenNode, index) in nodeEditable.childrenNode"
        :key="childrenNode.id"
        :indexNode="childrenNode.indexNode=index"
        :node="childrenNode"
        :nodeChange="nodeChange"
        :repaintLine_="repaintLine"
        :deleteNode_="deleteNode"
    />

    <svg> 
        <path 
            v-for="childrenNode in nodeEditable.childrenNode"
            :key="childrenNode.id"
            stroke="#000" 
            stroke-width="2" 
            fill="none"
            ref="line"
        />
    </svg>
</div>

</div>
</template>

<script>

export default{
name: "TreeNode",
props: ["node", "nodeChange", "repaintLine_", "deleteNode_", "indexContent"],
data(){return{
    nodeEditable: this.node,//浅拷贝
    nodeID: 1
}},
computed:{
},
methods: {
    relayout(event){
        this.nodeEditable.x += event.offsetX;
        this.nodeEditable.y += event.offsetY;
        if(this.repaintLine_) this.repaintLine_([this.nodeEditable]);//先进入父组件重绘一条线，如果是根节点则不进入父组件
        this.repaintLine(this.nodeEditable.childrenNode);//再重绘自身所有子组件所有线
        this.nodeChange();
    },
    repaintLine(childrenNode){
        for(let i=0; childrenNode[i]; i++){
            this.$refs.line[childrenNode[i].indexNode].setAttribute('d', 
                `M${this.node.x+this.node.width/2},${this.node.y+this.node.height} 
                L${childrenNode[i].x+childrenNode[i].width/2},${childrenNode[i].y}`
            );            
        }
    },
    setSize(){
        const rect = this.$refs.nodeName.getBoundingClientRect();
        this.nodeEditable.width = rect.width;
        this.nodeEditable.height = rect.height;
    },
    dblclick(event){
        event.target.contentEditable=true;
        event.target.focus();
    },
    blur(event){
        event.target.contentEditable=false;
        if(this.node.name == event.target.innerHTML) return;//如果内容没变
// console.log("node.name:", JSON.stringify(this.node.name));
// console.log("innerHTML:", JSON.stringify(event.target.innerHTML));
// console.log("node.name length:", this.node.name.length);
// console.log("innerHTML length:", event.target.innerHTML.length);
        // console.log(this.node.name, event.target.innerHTML);
        this.nodeEditable.name = event.target.innerHTML;
        this.setSize();
        this.repaintLine_([this.node]);
        this.repaintLine(this.node.childrenNode);
        this.nodeChange();
    },
    
    
    addNode(){
        this.nodeEditable.childrenNode.push( {
            id: this.nodeID++,
            name: "新节点", 
            x: 0, y: 0,
            childrenNode: []
        } );
        this.nodeChange();
    },
    deleteNode(subNode){
        this.$delete(this.nodeEditable.childrenNode, subNode.indexNode);
        this.nodeChange();
    }
},
created(){
    for(let i=0;this.nodeEditable.childrenNode[i];i++)
        this.nodeEditable.childrenNode[i].id = this.nodeID++;
    console.log("TreeNodeCreated");
    console.log(this.nodeEditable);
},
mounted(){
    // if(this.node.width) this.$refs.nodeName.style.width = this.node.width+"px";
    // if(this.node.height) this.$refs.nodeName.style.height = this.node.height+"px";
    this.setSize();//初始化Size
    this.repaintLine_([this.node]);
}
}
</script>

<style scoped>

/* 以下属性可以放在node上，效果为拖动父节点会连带所有子节点，放在span则可以独立拖动，且不受父节点边界影响 */
span {
    width: max-content;
    padding: 2px;
    border-radius: 2px;

    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: var(--box_shadow_small);
}

svg {
    height: 100%;
    width: 100%;

    position: absolute;
    top: 0;
    left: 0;

    overflow: visible;
    z-index: -1;
}

/* @media(max-width: 768px){
    .node {
        font-size: 50%;
    }
} */
</style>