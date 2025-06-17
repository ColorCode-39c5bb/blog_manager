<template>
<div class="pagination">
    <span style="position: absolute; left: 10%;" @click="leftmove"> &lt; </span>
    <div class="pager_box">
        <span 
            class="pager" 
            v-for="page in currentPages"
            :class="{ 'current_pager': page==currentPage }"
            :key="page"
        >
            {{ page<1||page>totolPages? '&nbsp;':page }}
        </span>
    </div>
    <span style="position: absolute; right: 10%;" @click="rightmove"> &gt; </span>
</div>
</template>

<script>
export default{
props: ["currentPage", "pagesize", "itemTotal"],
data(){ return {
    
}},
computed:{
    currentPages(){ return [this.currentPage-2, this.currentPage-1, this.currentPage, this.currentPage+1, this.currentPage+2] },
    totolPages() { return Math.max(Math.ceil(this.itemTotal/this.pagesize), 1) },
},
methods:{
    leftmove(){
        console.log("left"+this.totolPages);
        if(this.currentPage <=1 ) return;
        // this.$router.replace({ query: { ...this.$route.query, page: 2 } });
        this.$router.replace({ query: { page: this.currentPage-1 } });
    },
    rightmove(){
        console.log("right"+this.currentPage);
        if(this.currentPage >= this.totolPages) return;
        this.$router.replace({ query: { page: this.currentPage+1 } });
    }
}
}
</script>

<style scoped>
.pagination{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.pagination > span{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    box-shadow: var(--box_shadow_small);
}

.pager_box{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pager{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    transition: all 0.5s ease;
}
.current_pager{
    font-size: 140%;    
    box-shadow: var(--box_shadow_small);
}

</style>