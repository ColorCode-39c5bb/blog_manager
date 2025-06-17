<template> <div class="main">
<article v-if="article">
<h1 ref="title" contenteditable="true">{{ article.title }}</h1>

<div class="article-info">
    <span class="publish-time">发布于 {{ article.create_date }}</span>
    <span class="read-count"><i class="fas fa-eye"></i>{{ article.read }} 阅读</span>
</div>

<!-- 封面图 -->
<label class="article-cover" style="display: block;">
    <img :src="article.cover" alt="文章封面">
    <input type="file"
        id="input_file" 
        ref="cover"
        style="display: none;"
        @change="fileSelected($event)"
    />
</label>

<!-- 文章内容 -->
<div ref="content" contenteditable="true" class="article-content" v-html="article.content"></div>

<!-- 文章标签 -->
<div class="tags_box">
    <span 
        v-for="tag in article.tags.split(' ')" :key="tag" 
        class="tag"
        @click="removeTag(tag)"
    >
        {{ tag }}
    </span>
    <div class="tag" @click="clickTags($event)" style="cursor: pointer; position: relative;">
        +
        <div class="allTag_box" v-show="tagsUnfold" ref="allTagBox">
            <span 
                class="tag" 
                v-for="tag,index in tags" :key="index" 
                @click="addTag(tag)" 
                ref="tag"
                :data-tagid="tag.id"
            >{{tag.tagname}}</span>
            <span class="tag" @click="newTag()">+</span>          
        </div>
    </div>
</div>

<!-- 操作按钮 -->
<div class="article-actions">
    <button class="like-btn" :class="{ 'liked': true }">
        <i class="fas fa-heart"></i> {{ true ? '已赞' : '点赞' }} ({{ article.like }})
    </button>
    <button class="share-btn">
        <i class="fas fa-share-alt"></i> 分享
    </button>
    <!-- <button class="bookmark-btn" :class="{ 'bookmarked': true }">
        <i class="fas fa-bookmark"></i> {{ true ? '已收藏' : '收藏' }}
    </button> -->
</div>
</article>
<article v-else>
    正在加载
</article>
<div id="buttonSave">
    <button @click="buttonSave">保存</button>
    <button>取消</button>
</div>
</div> </template>


<script>
import site_configs from '@/configs/site_configs';

export default{
name: "Article_",
props: ["deleteArticle_", "indexArticle"],
data(){ return {
    article: null,
    tags: [],
    tagsUnfold: false,
}},
methods: {
    clickTags(event){
        if(this.tagsUnfold) return;
        event.stopPropagation();
        this.tagsUnfold = true;
        const closeTagsBox = (e) => {
            if (!this.$refs.allTagBox.contains(e.target)) {
                this.tagsUnfold = false;
                document.removeEventListener('click', closeTagsBox);
            }
        };
        document.addEventListener('click', closeTagsBox);
    },
    buttonSave(){  
        const articleSave = new FormData();
        // 2. 添加文本字段
        articleSave.append('id', this.article.id < 0 ? null : this.article.id);
        articleSave.append('title', this.$refs.title.innerText);
        articleSave.append('content', this.$refs.content.innerText);
        articleSave.append('tags', this.tagTransform(this.tags));
        if (this.$refs.cover.files[0]) {
            articleSave.append('coverFile', this.$refs.cover.files[0]);
        }
        // let articleSave = {
        //     id: this.article.id<0?null:this.article.id,
        //     title: this.$refs.title.innerText,
        //     content: this.$refs.content.innerText,
        //     cover: this.$refs.cover.files[0]?this.$refs.cover.files[0]:null
        // }
        console.log("save:")
        console.log(articleSave)
        fetch(`${site_configs.server}/blog/article`,{
            method: this.article.id<0?'POST':'PUT',//id<0->新建->POST
            "Content-Type": "multipart/form-data",
            body: articleSave
        })
        .then( response=>response.json() )
        .then( body => {
            if(this.article.id<0) {
                this.article.id = body.data;
                this.$router.replace({ query: { article_id: this.article.id } });
            }
        });
    },
    tagTransform(tags){
            let tags_ = "";
            for(let i=0; tags[i]; i++)
                tags_ = tags_+tags[i]+" ";
            return tags_.trimEnd();
    },
    addTag(tag){
        this.article.tags = this.article.tags + " " + tag.tagname;
    },
    removeTag(tag){
        let tags = this.article.tags.split(' ');
        console.log(tags[tags.indexOf(tag)]);
        tags.splice(tags.indexOf(tag),1);
        console.log(this.tagTransform(tags));
        this.article.tags = this.tagTransform(tags);
    },
    newTag(){
        fetch(`${site_configs.server}/tags`,{
            method: 'POST',//id<0->新建->POST
            headers: {
                'Content-Type': 'application/json' // 必须设置请求头
            },
            body: JSON.stringify({
                id: null,
                tagname: "新标签"
            })
        })
        .then( response=>response.json() )
        .then( body => {
            this.tags.push({id: body.data, tagname: "新标签", article_count: 0})
        }); 
    },
    fileSelected(event){
        console.log(event.target.files);
    },
},

created(){
    console.log("ArticleCreate");
    fetch(`${site_configs.server}/tags`)
    .then( response=>response.json() )
    .then( body => {
        this.tags = body.data;
    });

    if(this.$route.query.article_id<0) {
        this.article = {
            id: this.$route.query.article_id,
            title: "新标题",    content: "新内容",
            cover: null,        tags: null,
            read: 0,            like: 0
        }
        return;
    }
    fetch(`${site_configs.server}/blog/article?article_id=${this.$route.query.article_id}`)
    .then( response => response.json() )
    .then( body => {
        this.article = body.data;
        this.article.cover = site_configs.server +"/"+ this.article.cover;
    });
},
}
</script>

<style scoped>
article {
    padding: 20px;
    line-height: 1.6;
}
h1{
    text-align: center;
}
.article-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border_color);
    font-size: 75%
}

.article-cover {
    margin: 30px 0;
    border-radius: 8px;
    overflow: hidden;
}

.article-cover img {
    width: 100%;
    display: block;
}

.article-content {
    font-size: 1.1rem;
    padding: 40px 0;
}
.article-content >>> h2 {
    margin-top: 2em;
    margin-bottom: 1em;
}
.article-content >>> p {
    margin-bottom: 1.5em;
}
.article-content >>> code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
}
.article-content >>> pre {
    background-color: #f8f8f8;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    margin: 20px 0;
}

.tags_box{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

}
.tag {
    width: max-content;
    border-radius: 20px;
    padding: 5px 12px;
    text-align: center;
    font-size: 75%;
    box-shadow: var(--box_shadow_small);
}
.tag:hover {
    background-color: var(--BGC_hover);
    color: var(--font_color_hover);
}

.allTag_box {
    position: absolute;
    bottom: 20px;

    min-width: 200px;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    box-shadow: var(--box_shadow_middle);
}

.article-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 40px;
}

.like-btn.liked {
    color: #ff4757;
    border-color: #ff4757;
}
.bookmark-btn.bookmarked {
    color: #2e86de;
    border-color: #2e86de;
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
#buttonSave{
    text-align: center;

    position: sticky;
    bottom: 7.5%;
}
#buttonSave > *{
    margin: 0 5px;
}
@media (max-width: 768px) {
    main{
        width: 100%;
    }
}
</style>