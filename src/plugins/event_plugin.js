const EventConfigPlugin = {
    install(Vue) {
        // 存储所有组件的事件配置
        // const event_config = {};
        // 全局混入，处理事件绑定
        Vue.mixin({
            data(){return{
                eventConfig: null
            }},
            methods: {
                addListener(){//菜单项
                    if(!this.eventConfig) return;
                    for(let i=0,j=0; this.eventConfig[i]; i++,j=0){
                        if (this.eventConfig[i].isNativeEvent) {//如果是原生事件则addEventListener
                            if(!this.$refs[this.eventConfig[i].ref].length) {//如果只有一个元素，则不是数组，j无效
                                this.$refs[this.eventConfig[i].ref].addEventListener(this.eventConfig[i].event, this.eventConfig[i].hander.bind(this));
                                return;
                            }
                            for(; this.$refs[this.eventConfig[i].ref][j]; j++){
                                this.$refs[this.eventConfig[i].ref][j].addEventListener(this.eventConfig[i].event, this.eventConfig[i].hander.bind(this));
                            }
                            // 也可以将handler作为方法注入组件实例
                            // this[`handle_${config.event}`] = config.handler;
                        }
                        else{
                            this.$bus.$on(this.eventConeventConfig.event,this.eventConfig.hander.bind(this));
                        }
                    }
                    console.log(this.$options.name+"：添加监听器成功");
                }
            },
            mounted(){
                const componentName = this.$options.name;//获取当前组件名字
                const config = this.$root.$options.event_config[componentName];
                if (!config) return;//如果 当前组件（名字） 没有配置则直接返回
                    this.eventConfig = config;
                this.addListener();
            },
            // beforeDestroy() {
            //     const componentName = this.$options.name;
            //     const config = this.$root.$options.event_config[componentName];
            //     if (!config) return;//如果 当前组件（名字） 没有配置则直接返回
                
            //     for(let i=0; this.eventConfig[i]; i++)
            //         if (this.eventConfig[i].isNativeEvent) {
            //             // 解绑事件
            //             for(let j=0; this.$refs[this.eventConfig[i].ref][j]; j++)
            //                 this.$refs[this.eventConfig[i].ref].removeEventListener(this.eventConfig[i].event, this.eventConfig[i].hander);
            //         }
            //         else{
            //             this.$bus.$off(config.event);
            //         }
            // }
        });
        
        // 添加配置方法
        Vue.addEventConfig = function(component, config) {
            if (!component.name) {
                console.warn('Component must have name property for event configuration');
                return;
            }
            
            this.$root.$options.event_config[component.name] = config;
            
            // 返回组件以便链式调用
            return component;
        };
    }
};
export default EventConfigPlugin;