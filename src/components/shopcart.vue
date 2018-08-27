<template>
<div id="shopcart">
    <div class="shopMsg">
        <div class="goods-pitch-on" @click="listShow">
            <div class="cart" :class="{active:flag}">
                <span class="icon-shopping_cart"></span>
            </div>
            <div v-if="allCount > 0 ? true : false" class="quantity">{{allCount}}</div>
        </div>
        <div class="goods-price" >
            <span class="total" :class="{active: total > 0}">￥{{total}}</span>
            <span class="deliver-fee">另需配送费￥{{deliveryPrice}}元</span>
        </div>
        <div class="goods-place" :class="{active: total >= 20}">{{pay}}</div>
    </div>
    <div class="shopList" v-show="flag">
        <div class="bg"></div>
        <div class="list" >
            <div class="list-header">
                <span class="text">购物车</span>
                <span class="clear" @click="clear">清空</span>
            </div>
            <div class="foodsList" ref="contentList">
                <ul>
                    <li class="item" v-for="(item,index) in foodsList" v-if="item.count === 0? false : true">
                        <div class="foodName">{{item.name}}</div>
                        <div class="price-count">
                            <div class="price">￥{{item.price*item.count}}</div>
                            <quantity :foods="item" @allCountChange="allCountChange"></quantity>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</div>
    

</template>

<script>
import quantity from './quantity'
import BScroll from 'better-scroll'
import Vue from 'vue'
export default {
    props: {
        deliveryPrice: {
            type: Number
        },
        foodsList: {
            type: Array
        },
        allCount: {
            type: Number
        },
    },
    data() {
        return {
            flag: false,
            data: '123',
            total: 0,
        }
    },
    methods: {
        allCountChange(data) {
            //allCount发生改变时执行自定义事件往goods内的allCountChange回调传值
            this.$emit("allCountChange", data)
        },
        listShow() {
            //操作购物车按钮对下单列表的展示
            if (this.allCount !== 0) {
                this.flag = !this.flag
            }
        },
        clear() {
            //当按下清空按钮时应该把所有事物对象内的count置0
            if (this.allCount !== 0) {
                this.foodsList.forEach((item) => {
                    item.count = 0
                })
            }
            this.flag = false
            this.$emit("allCountChange", 0)
        }
    },
    components: {
        quantity
    },
    created() {
        //对购物车列表的滚动绑定
        Vue.nextTick(() => {
            this.foodScroll = new BScroll(this.$refs.contentList, {
                probeType: 3,
                click: true
            })
        })
    },
    computed: {
        pay() {
            if (this.total >= 20) {
                return '去结算'
            } else {
                return `还差￥${20 - this.total}元起送`
            }
        }
    },
    watch: {
        flag() {
            Vue.nextTick(() => {
                //在购物列表的展示与不展示切换中dom结构的高度会发生变化，所以应该对foodScroll进行refresh更新
                this.foodScroll.refresh()
            })
        },
        allCount() {
            //当allCount发生变化时 从新遍历foodList求得总价格
            if (this.allCount === 0) {
                this.flag = false
            }
            let total = 0;
            this.foodsList.forEach(item => {
                total += item.price * item.count
            })
            this.total = total
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' ref='stylesheet/stylus'>
@import '../../static/style.css';
@import '../assets/stylus/index.styl';

#shopcart {
    width: 100%;
    height: 48px;
    position: fixed;
    bottom: 0;
    background: #141d27;
    display: block;

    .shopMsg {
        z-index: 300;
        height: 48px;

        .goods-pitch-on {
            width: 58px;
            height: 58px;
            background: #141d27;
            border-radius: 50%;
            bottom: 2px;
            position: absolute;
            margin-left: 12px;

            .cart {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                text-align: center;

                &.active {
                    background: rgb(0, 160, 220);
                }

                .icon-shopping_cart {
                    font-size: 24px;
                    line-height: 44px;
                    color: #fff;
                }
            }

            .quantity {
                width: 24px;
                height: 16px;
                background: rgb(240, 20, 20);
                position: absolute;
                border-radius: 6px;
                right: 0;
                box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4);
                font-size: 9px;
                color: #fff;
                font-weight: 700;
                line-height: 16px;
                text-align: center;
            }
        }

        .goods-price {
            margin-left: 80px;
            margin-top: 15px;
            font-size: 0;

            .total {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.4);
                font-weight: 700;
                padding-right: 12px;
                height: 24px;
                border-1px-right(rgba(255, 255, 255, 0.1));

                &.active {
                    color: #fff;
                }
            }

            .deliver-fee {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
                margin-left: 12px;
            }
        }

        .goods-place {
            width: 120px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            position: absolute;
            right: 0;
            top: 0;
            font-size: 12px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.4);
            text-align: center;
            line-height: 48px;

            &.active {
                background: #008000;
                color: #fff;
            }
        }
    }

    .shopList {
        position: fixed;
        bottom: 48px;
        top: 0;
        width: 100%;
        z-index: -1;

        .bg {
            background: rgba(7, 17, 27, 0.6);
            width: 100%;
            height: 100%;
        }

        .list {
            width: 100%;
            // height: 200px; // 待定
            background: #fff;
            position: fixed;
            bottom: 48px;
            overflow: hidden;
            max-height: 260px;

            .list-header {
                height: 40px;
                width: 100%;
                background: #f3f5f7;
                display: flex;
                justify-content: space-between;
                border-1px: rgba(7, 17, 27, 0.1);

                span {
                    line-height: 40px;
                }

                .text {
                    margin-left: 18px;
                    font-size: 14px;
                    font-weight: 200;
                    color: rgb(7, 17, 27);
                }

                .clear {
                    padding: 0 18px;
                    font-size: 12px;
                    color: rgb(0, 160, 220);
                }
            }

            .foodsList {
                margin: 0 18px;
                overflow: hidden;
                max-height: 220px;

                .noCount {
                    height: 100px;
                    width: 100%;
                    text-align: center;
                    line-height: 100px;
                }

                .item {
                    width: 100%;
                    height: 48px;
                    display: flex;
                    justify-content: space-between;
                    border-1px(rgba(7, 17, 27, 0.1));

                    .foodName {
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                        line-height: 48px;
                    }

                    .price-count {
                        display: flex;
                        height: 48px;
                        line-height: 48px;

                        .price {
                            font-size: 14px;
                            font-weight: 700;
                            color: rgb(240, 20, 20);
                        }
                    }
                }
            }
        }
    }
}
</style>
