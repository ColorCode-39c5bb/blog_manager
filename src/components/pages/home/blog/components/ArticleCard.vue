<template>
<article 
    ref="article" 
    :style="{ opacity, transform }" 
    @click="toDetail"
>

    <div id="cover"><img :src="IMG" alt="cover"></div>
    

    <!-- 标题 -->
    <h2>{{ article.title }}</h2>

    <!-- 内容预览 -->
    <div class="preview">{{ article.preview }}</div>

    <div id="info">
        <!-- 标签 -->
         <div class="tags_box" v-if="article.tags">
            <span v-for="tag in article.tags.split(' ')" :key="tag">{{ tag }}</span>
        </div>

        <!-- 总字数 -->
        <span class="word_count">{{ wordCount }} 字</span>

        <!-- 日期 -->
        <span class="date">发布于：{{ article.create_date.split(" ")[0] }}</span>
    </div>
</article>
</template>



<script>
import site_configs from '@/configs/site_configs';

export default {
name: "ArticleCard",
props:[ "article", "deleteArticle_", "indexArticle" ],
data() { return {
    wordCount: 1200,
    opacity: 0, // 控制元素的透明度
    transform: "scale(0.2)",
}},
computed:{
    tags(){ return this.article.tags.spilt(' ') },
    create_date(){ return this.article.create_date.split(" ")[0] },
    IMG(){ 
        if(this.article.cover) return site_configs.server+"/"+this.article.cover
        else return require('@/assets/cover.jpg')
    }   
},
mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll(); // 初始化时检查一次
},
beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
},
methods: {
    handleScroll() {
        const rect = this.$refs.article.getBoundingClientRect();
        const innerHeight = window.innerHeight;

        // 当元素位于视口内时，计算透明度
        if (rect.top <= innerHeight) {
            this.opacity = Math.min(2 - (rect.top / (innerHeight / 2)), 1);
            this.transform = `scale(${Math.min(0.2+this.opacity, 1)})`;
        }
    },

    toDetail() {
        this.$router.push({
            path: "text",
            query: { 
                article_id: this.article.id,
            }
        });
    },
}
}
</script>



<style scoped>
article {
    --scale_img: 1.0;
    --bgc: rgb(250, 250, 250, 0.25);

    width: 100%;
    border-radius: 10px;

    background-color: var(--bgc);
    box-shadow: var(--box_shadow_middle);
}
article:hover{
  box-shadow: var(--box_shadow_small);
  --scale_img: 1.05;
  --bgc:  rgb(250, 250, 250, 0.75);
}

img{
    width: 100%;
    scale: var(--scale_img);
}
#cover{
    max-height: 255px;
    border-radius: 8px 8px 0 0;

    display: flex;
    align-items: center;
    overflow: hidden;
}

h2{
    padding: 10px;
}

#info {
    margin: 0 10px;
    padding: 10px 0;
    border-top: 1px solid var(--border_color);

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    font-size: 50%;
}
  
.tags_box{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.tags_box span {
    padding: 5px 12px;
    border-radius: 20px;

    text-align: center;
    background-color: #e0f7fa;
}
.tags span:last-child{
  margin-right: 0;
}
</style>