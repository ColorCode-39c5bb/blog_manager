import VueRouter from "vue-router";

import Login from "@/components/pages/Login.vue";
import Home from "@/components/pages/home/Home.vue";
    import Setting from "@/components/pages/home/setting/Setting.vue";
    import About from "@/components/pages/home/about/About.vue";
    import Blog from "@/components/pages/home/blog/Blog.vue";
import Article_ from "@/components/pages/home/blog/components/Article_.vue";

const router = new VueRouter({
    routes:[
        {path: "/login",    component: Login},
        {
            path: "/",     
            component: Home,
            meta: {currentPage: "Home"},
            children: [
                {path: "",              component: Setting, meta: {currentPage: "Setting"}},
                {path: "about",         component: About, meta: {currentPage: "About"}},
                {path: "blog",          component: Blog,  meta: {currentPage: "Blog"}},
            ]
        },
        {path: "/text",     component: Article_,             meta: {currentPage: "Article"}}
    ]
});

export default router; 