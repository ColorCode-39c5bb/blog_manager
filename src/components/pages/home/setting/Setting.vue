<template>
<div class="main">

    <div class="setting-item setting-item-character">
        每页大小:
        <input type="text" class="operation" v-model.number="configBlog.pagesize">
    </div>
    <div class="setting-item setting-item-check">
        <div style="display: flex;justify-content: space-between;" @click="unfold=!unfold">
            个性签名:
            <i :class="['fas', unfold?'fa-angle-down':'fa-angle-right', 'operation']"></i>
        </div>
        <article v-show="unfold">
            <div
                v-for="signature in configBlog.signatures" :key="signature.id"
                class="signature"
                contenteditable="true"
                @blur="($event)=>blur($event, signature.id)"
                style="position: relative;"
            >
                {{signature.signature}}
                <i id="X" class="fas fa-times" @click="signatureRemove(signature.id)"></i>
            </div>
            <button class="signature" style="width: 100%; cursor: pointer;" @click="signatureAdd()">+++添加+++</button>
        </article>
    </div>

    <div style="
        text-align: center;
        position: sticky;
        bottom: 7.5%;
    "><button id="buttonSave" @click="save()">保存</button></div>
</div>
</template>

<script>
import site_configs from '@/configs/site_configs';
export default{
data(){ return {
    keyIndex: 0,
    unfold: false,

    configBlog: {},
}},
methods:{
    save(){
        console.log(this.configBlog);
        fetch(`${site_configs.server}/blog/config`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' // 必须设置请求头
            },
            body: JSON.stringify({
                id: this.configBlog.id,
                pagesize: this.configBlog.pagesize,
                signatures: JSON.stringify(this.configBlog.signatures)
            })
        })
        .then( response=>response.json() )
        .then( body => console.log(body) );
    },
    signatureRemove(id){
        console.log(id);
        const index = this.configBlog.signatures.findIndex(s => s.id === id);
        if (index !== -1) this.$delete(this.configBlog.signatures, index);
    },
    signatureAdd(){
        this.configBlog.signatures.push({id: this.keyIndex++, signature: "点击编辑"});
    },
    blur(event, id){
        const target = this.configBlog.signatures.find(s => s.id === id);
        if (target) target.signature = event.target.innerText;
    },
    
    deleteTag(id){
        fetch(`${site_configs.server}/tags?id=${id}`,{
            method: 'DELETE',//id<0->新建->POST
        })
        .then( response=>response.json() )
        .then( () => {
            const index = this.tags.findIndex(s => s.id == id);
            if (index != -1) this.$delete(this.tags, index);
        }); 
    },
},
created(){
    fetch(`${site_configs.server}/blog/config`)
    .then( response=>response.json() )
    .then( body => {
        this.configBlog = body.data;
        this.configBlog.signatures = JSON.parse(this.configBlog.signatures);
        for(let i=0; this.configBlog.signatures[i]; i++)
            this.configBlog.signatures[i].id = this.keyIndex++;
        console.log(this.configBlog)
    });
}
}
</script>

<style scoped>
.main{
    padding: 0 10px;
}

.setting-item{
    padding: 10px;
    border-radius: 2px;
}
.setting-item:hover{
    box-shadow: var(--box_shadow_middle);
    color: var(--font_color_hover);
}
.setting-item input{
    border-radius: 2px;
    box-shadow: var(--box_shadow_small);
}
.setting-item .operation{
    margin: auto 0;
}

.setting-item-character{
    display: flex;
    justify-content: space-between;
}
.setting-item-character input{
    width: 50px;
}

.signature {
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    --isShowX: none;
}
.signature:hover {
    color: var(--font_color_hover);
    box-shadow: var(--box_shadow_small);
    
    --isShowX: flex;
}
#X{
    margin-right: 10px;
    display: var(--isShowX);
    align-items: center;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    cursor: pointer;
}


#buttonSave {
    min-width: 75px;
    padding: 8px 16px;
    border-radius: 20px;
    margin-top: 20px;

    cursor: pointer;
    box-shadow: var(--box_shadow_small);
}
#buttonSave:hover {
    background-color: var(--BGC_hover);
    color: var(--font_color_hover);
}
</style>