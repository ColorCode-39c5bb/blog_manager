<template>
<div class="main">

<h1 id="about">玩家档案</h1>

<AboutCard 
    v-for="(item, index) in aboutme"
    :key="item.idCopy"
    :item="item"
    :index="index" 
    :buttonDelete_="buttonDelete"
    :buttonSave_="buttonSave"
/>

<div id="buttonCreate"><button @click="buttonCreate">新建</button></div>

</div>
</template>

<script>
import site_configs from '@/configs/site_configs';
import AboutCard from './components/AboutCard.vue';

export default{
components: { AboutCard },
data(){return{
    aboutme: [],
    virtualID: 0,//用于:key
}},
methods:{
    buttonCreate(){
        this.aboutme.push({
            id: -this.virtualID, 
            idCopy: -this.virtualID++, 
            title: "title", 
            content: [{
                id: this.virtualID++, 
                text: "new text", 
                node: []
            }]
        });
    },
    buttonDelete(aboutCard){
        if(aboutCard.item.id>0){//id<=0则为新建未保存，删除时不请求服务器
            fetch(`${site_configs.server}/aboutme?id=${aboutCard.item.id}`,{
                method: "DELETE"
            })
            .then(response=>response.json())
            .then(body=>{
                alert(body.message)
            });
        }
        this.$delete(this.aboutme, aboutCard.index);
    },
    buttonSave(aboutCard, item){
        console.log(item);
        aboutCard.canDelete = false;
        const id=aboutCard.item.id;
        item.id=item.id<=0?null:item.id,
        fetch(`${site_configs.server}/aboutme`, {
            method: id<=0?'POST':'PUT',//id<0->新建->POST
            headers: {
                'Content-Type': 'application/json' // 必须设置请求头
            },
            body: JSON.stringify(item)
        })
        .then(response=>response.json())
        .then(body=>{
            if(id<=0) aboutCard.item.id = body.data;//如果是后端赋予id则覆盖临时id
            aboutCard.canDelete = true;
            // alert(body.message);
        });
    },
},
created(){
    fetch(`${site_configs.server}/aboutme`)
    .then(response => response.json())
    .then(body => {
        let data = body.data;
        for(let i=0; data[i]; i++){
            data[i].content = JSON.parse(data[i].content);
            data[i].idCopy = data[i].id;
            for(let j=0;data[i].content[j];j++)
                data[i].content[j].id = this.virtualID++;
        }
        this.aboutme = data;
        console.log(this.aboutme); 
    });
    console.log("AboutMeCreated");
},
}
</script>

<style scoped>

.main{
    position: relative;
}

h1 {
    font-size: 2.6rem;
    border-bottom: 2px solid var(--border_color);
    margin-bottom: 40px;
    text-align: center;
}
h1 i {
    margin-right: 15px;
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

#buttonCreate{
    text-align: center;

    position: sticky;
    bottom: 7.5%;
}

</style>