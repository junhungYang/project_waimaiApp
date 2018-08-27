<template>
    <div id="quantity" >
        <transition name="ani">
            <div class="animateWrap" v-if="foods.count > 0 ? true : false">
                  <span class="icon-remove_circle_outline icon" @click="remove"></span>
                 <span class="text">{{foods.count}}</span>
            </div>
        </transition>
        <span class="icon-add_circle icon" @click="add"></span>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    props: {
        foods: {
            type: Object
        },
    },
    methods: {
        add(event) {
            //当点击 "+"图标时 当前食物的cont ++ 触发自定义事件，传 "1" 用于对总数量的更新
            if (event._constructed) {
                this.foods.count++
                this.$emit("allCountChange", 1)
            }
            return
        },
        remove(event) {
            if (event._constructed && this.foods.count > 0) {
                this.foods.count--
                this.$emit("allCountChange", -1)
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" ref='stylesheet/stylus'>
#quantity {
    font-size: 0;
    width: 72px;
    overflow: hidden;
    text-align: right;

    .animateWrap {
        display: inline-block;
    }

    .icon {
        color: rgb(0, 160, 220);
        font-size: 24px;
        line-height: 24px;
        vertical-align: middle;
    }

    .text {
        vertical-align: middle;
        color: rgb(147, 153, 159);
        font-size: 10px;
        display: inline-block;
        width: 24px;
        text-align: center;
    }

    .ani-enter {
        transform: translateX(100%);
        opacity: 0;
    }

    .ani-enter-to {
        transform: translateX(0);
        opacity: 1;
    }

    .ani-leave {
        transform: translateX(0);
        opacity: 1;
    }

    .ani-leave-to {
        transform: translateX(100%);
        opacity: 0;
    }

    .ani-leave-active, .ani-enter-active {
        transition: all 0.3s ease;
    }
}
</style>
