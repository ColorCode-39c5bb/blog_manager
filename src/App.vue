<template><body>

<nav> <Nav_ /> </nav>

<main> <Home /> </main>

<footer> </footer>

</body></template>

<script>
import Nav_ from './components/Nav_.vue';
import Home from './components/pages/home/Home.vue';

export default {
components: { Nav_, Home },
data() { return {
}},
};
</script>

<style>
:root{
    --border_color: violet;
    --font_color: #be0fbe;
    --font_color_hover: #2e86de;
    --BGC_hover: #f9f9f9;
    --box_shadow_small:  0 0 6px rgba(0, 0, 0, 0.4);
    --box_shadow_middle:  0 0 10px rgba(0, 0, 0, 0.3);
}

*{
    box-sizing: border-box;
    border: none;
    margin: 0;
    padding: 0;

    color: var(--font_color);
    background-color: transparent;
    text-decoration: none;
    transition: all 0.2s ease;
}

body {
    display: flex;
    justify-content: space-between;
    
    background-color: antiquewhite;
}

nav {
    width: 20%;
    height: 100vh;

    position: sticky;
    top: 0;
    left: 0;
}

main{
    width: 79%;
}
</style>
