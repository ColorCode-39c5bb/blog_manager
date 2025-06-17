<template>
<div class="main">

<ArticleCard 
    v-for="article,index in articles" 
    :key="article.id" 
    :article="article" 
    :indexArticle="index"
    :deleteArticle_="deleteArticle"
/>  

<div id="buttonCreate"><button @click="newArticle()">新建文章</button></div>      

<Pagination
    :itemTotal="blogMeta.totalArticle"
    :pagesize="configBlog.pagesize"
    :currentPage="currentPage"
/>    



</div>
</template>

<script>
import site_configs from '@/configs/site_configs';
import ArticleCard from './components/ArticleCard.vue';
import Pagination from './components/Pagination.vue';

export default{
components: {ArticleCard,Pagination},
data(){return{
    articles: [],
    configBlog: {},
    blogMeta: {},
}},
computed: {
    currentPage(){ return Number(this.$route.query.page) },
},
watch: {//watch在created后开始工作
    currentPage: { handler(){ this.handlePage() } }
},
methods:{
    handlePage(){
        // if(!this.configBlog.pagesize) return;
        fetch(`${site_configs.server}/blog/articles?page=${this.currentPage}&pagesize=${this.configBlog.pagesize}`)
        .then( response=>response.json() )
        .then( body => {
            this.articles = body.data;
        });
    },
    newArticle(){
        this.$router.push({
            path: "text",
            query: { 
                article_id: -1,
            }
        });
    },
    deleteArticle(indexArticle){
        fetch(`${site_configs.server}/blog/article?id=${this.articles[indexArticle].id}`,{
            method: "DELETE"
        })
        .then(()=>{
            console.log("delete");
            this.$delete(this.articles, indexArticle);
            this.blogMeta.totalArticle--;
        });
    },
},
created(){
    fetch(`${site_configs.server}/blog/config`)
    .then( response=>response.json() )
    .then( body => {
        this.configBlog = body.data;
        this.handlePage();
    });

    fetch(`${site_configs.server}/blog/meta`)
    .then( response=>response.json() )
    .then( body => this.blogMeta = body.data );
},
}
</script>

<style scoped>
.main > *{
    margin-bottom: 20px;
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
#buttonCreate {
    text-align: center;
    position: sticky;
    bottom: 7.5%;
}
</style>