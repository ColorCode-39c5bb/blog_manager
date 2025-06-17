<template>
<div class="blog-nav"> <ul>
    <!-- 首页 -->
    <li :class="{ 'active': currentPage == 'Setting' }">
        <i class="fas fa-home"></i>
        <router-link to="/">设置</router-link>
    </li>

    <!-- 归档 -->
    <li :class="{ 'active': currentPage == 'Blog' }">
        <i class="fas fa-archive"></i>
        <router-link to="/blog?page=1">博客</router-link>
    </li>

    <!-- 关于 -->
    <li :class="{ 'active': currentPage == 'About' }">
        <i class="fas fa-user"></i>
        <router-link to="/about">关于</router-link>
    </li>

    <!-- 友链 -->
    <!-- <li :class="{ 'active': currentPage == 'Links' }">
        <i class="fas fa-link"></i>
        <router-link to="/">友链</router-link>
    </li> -->
</ul> </div>
</template>
    
<script>
export default {
data() { return {
}},
computed:{
    currentPage(){ return this.$route.meta.currentPage },
},
}
</script>
    
<style scoped>
ul {
    list-style: none;
}
li {
    display: flex;
    align-items: center;
}
li:hover {
    background-color: #e9ecef;
}

i {
    width: 25%;
    text-align: center;
}

a {
    flex: 1;
    padding: 12px;
    padding-left: 0;
}

.active{
    background-color: #e7f1ff !important;
}
</style>