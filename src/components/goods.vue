<template>
<div id="goods">
    <div class="menulist" ref="menuList">
        <ul>
            <!-- 重点：click事件 -->
            <li v-for="(item,index) in goods" class="item" @click="selectIndex(index,$event)"  :class="{active : currentIndex === index}">   
                <div>
                    <span v-if="item.type > 0 ?　true : false" class="icon" :class="classMap[item.type]"></span>
                    <span class="text">{{item.name}}</span>
                </div>
            </li>
        </ul>
    </div>
    <div class="menu-content" ref="contentList">
        <ul>
            <li  v-for="(item,index) in goods" class="foodItem">
               
                <div class="title-ident">
                      <div class="set-title">
                        {{item.name}}
                    </div>
                </div>
                <ul>
                    <li v-for="(item1,index) in item.foods" class="food-content">
                    
                        <div class="food-img">
                            <img :src="item1.image" alt="">
                        </div>
                        <div class="food-introduce">
                            <div class="food-name">
                                {{item1.name}}
                            </div>
                            <div class="food-description" v-if="item1.description ? true : false">
                                {{item1.description}}
                            </div>
                            <div class="heat">
                                <span>
                                    月售{{item1.sellCount}}份
                                </span>
                                <span>
                                    好评率{{item1.rating}}%
                                </span>
                            </div>
                            <div class="price">
                                ￥<span class="now">{{item1.price}}</span>
                                <span v-if="item1.oldPrice ? true : false" class="old">￥{{item1.oldPrice}}</span>
                            </div>
                        </div>
                        <div class="countControl">
                            <quantity :foods="item1" @allCountChange="allCountChange"></quantity>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
        <shopcart :deliveryPrice="deliveryPrice" :allCount="allCount" :foodsList="foodsList"  @allCountChange="allCountChange">
        </shopcart> 
</div>

</template>
<script>
import axios from 'axios'
import BScroll from 'better-scroll'
import Vue from 'vue'
import shopcart from './shopcart'
import quantity from './quantity'
export default {
    props: {
        deliveryPrice: {
            type: Number
        }
    },
    data() {
        return {
            goods: '',
            classMap: ['decrease', 'discount', 'special', 'invoice_1', 'guarantee'],
            heightList: [],
            scrollY: 0,
            allCount: 0,  //总下单数量
            foodsList: [],
        }
    },
    created() {
        //获取goods数据
        axios('/good/goods').then(res => {
            if (res.data.code === 0) {
                this.goods = res.data.data
                Vue.nextTick(() => {
                    //食物列表及下单数量初始化
                    this.foodListInit(res.data.data)

                    //拖动事件入口
                    this._initscroll();
                    this._caculateHeight();
                })
            }
        })
    },
    components: {
        shopcart,
        quantity
    },
    computed: {
        currentIndex() {
            let len = this.heightList.length
            for (let i = 0; i < len; i++) {
                let height1 = this.heightList[i]
                let height2 = this.heightList[i + 1]
                //假设当前拖动food部分，并且使scrollY一直在 0~ 1100之间,那么根据if条件每次循环都会截断于index为0时，
                // :class="{active : currentIndex === index} 在这里index为定值，此时只有的结果为true 0 === 0 ,其他则为 0 === 1,0 === 2 ....
                // 而在惯性滑动中，scrollY一直变化 currentIndex一直触发，并且for循环根据scrollY的惯性变化，每次都截断在某一个index上
                // 所以形成了惯性滑动时，menu部分的被选中项也会一直变化的现象
                // 虽然 len为11 但i最多只可以到达9 原因在于滑动不可能超过4518，而 3790~4518 刚好是i = 9的区域，无论如何for循环会被截断于i=9时
                if ((this.scrollY >= height1 && this.scrollY < height2)) {
                    return i
                }
            }
        }
    },
    methods: {
        allCountChange(data) {
            //data为由quantity组件通过this.$emit方法传入的值
            //allCount由当前模块统一分发给 quantity组件与shopcart内的quantity组件
            if (data === 0) {
                //当data为0时证明总数量为0
                this.allCount = 0
            } else {
                //data不为0时它可以是+1或-1
                this.allCount += data
            }
        },
        foodListInit(data) {
            data.forEach(item => {
                item.foods.forEach(item => {
                    //通过Vue.set给每一项食物设置上它的下单数量属性 "count"
                    //因为下单数量是动态变化的，所以必须使用 Vue.set 
                    Vue.set(item, 'count', 0)
                    //这里的foodsList.push操作可以理解为数组去重，它将传至购物车内，用于下单列表的渲染
                    //因为在下单列表中不需要使用到实物的上一层分类，即 "热销榜" "单人套餐" 那些东西，所以会把每一个食物单独抽取出来
                    this.foodsList.push(item)
                })
            })
        },
        selectIndex($index, $event) {
            if (!$event._constructed) {  //如果不存在这个属性,则为原生点击事件，不执行下面的函数
                return
            }

            let foodList = this.$refs.contentList.getElementsByClassName('foodItem')
            this.foodScroll.scrollToElement(foodList[$index], 300)
        },
        _initscroll() {
            //实现拖动
            this.menuScroll = new BScroll(this.$refs.menuList, {
                click: true
            })
            this.foodScroll = new BScroll(this.$refs.contentList, {
                probeType: 3,
                click: true
            })
            //绑定拖动事件，获取食物列表的实时滚动距离
            this.foodScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y))
            })
        },
        _caculateHeight() {
            //制造食物列表高度范围区间，即某一类食物的列表在Y轴上的起始点与结束点
            //this.heightList用于实现菜单列表与食物列表的关联
            let foodList = this.$refs.contentList.getElementsByClassName('foodItem')
            let len = foodList.length
            let height = 0
            this.heightList.push(height)
            for (let i = 0; i < len; i++) {
                height += foodList[i].clientHeight
                this.heightList.push(height)
            }
        }
    }
}
</script>
<style lang='stylus' ref='stylesheet/stylus'>
@import '../../static/style.css';
@import '../assets/stylus/index.styl';

#goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    // position: relative;
    width: 100%;

    .menulist {
        width: 80px;
        height: 100%;
        position: absolute;
        overflow: hidden;
        background: #f3f5f7;

        .item {
            height: 54px;
            // width: 56px;
            padding: 0 12px;

            &.active {
                background: #fff;
            }

            div {
                display: table-cell;
                // 在table-cell的情况下，height一定要定具体高度
                vertical-align: middle;
                height: 54px;
                width: 100%;
                line-height: 14px;
                border-1px(rgba(7, 17, 27, 0.1));

                .text {
                    font-size: 12px;
                    font-weight: 200;
                }

                .icon {
                    display: inline-block;
                    vertical-align: top;
                    width: 15px;
                    height: 15px;
                    background-size: 15px 15px;

                    &.decrease {
                        bg-image('decrease_1');
                    }

                    &.discount {
                        bg-image('discount_1');
                    }

                    &.guarantee {
                        bg-image('guarantee_1');
                    }

                    &.invoice {
                        bg-image('invoice_1');
                    }

                    &.special {
                        bg-image('special_1');
                    }

                    &.active {
                        font-weight: 500;
                    }
                }
            }
        }
    }

    .menu-content {
        margin-left: 80px;
        height: 100%;
        flex-grow: 1;
        overflow: hidden;

        // width: 100%;
        .title-ident {
            padding-left: 2px;
            background: #d9dde1;

            .set-title {
                padding-left: 14px;
                height: 26px;
                font-size: 12px;
                background: #f3f5f7;
                line-height: 26px;
                color: rgb(147, 153, 159);
            }
        }

        .food-content {
            position: relative;
            overflow: hidden;

            .food-img {
                position: absolute;
                top: 18px;
                left: 18px;

                img {
                    width: 60px;
                    height: 60px;
                }
            }

            .food-introduce {
                margin: 0 18px 0 18px;
                padding-left: 70px;
                padding-top: 20px;
                border-1px(rgba(7, 17, 27, 0.1));

                .food-name {
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                    line-height: 14px;
                }

                .food-description, .heat {
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                    line-height: 10px;
                    margin-top: 8px;
                }

                .price {
                    margin-top: 8px;
                    padding-bottom: 18px;
                    font-size: 10px;
                    color: rgb(240, 20, 20);

                    .now {
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 24px;
                    }

                    .old {
                        font-size: 10px;
                        font-weight: 700;
                        line-height: 24px;
                        color: rgb(147, 153, 159);
                        text-decoration: line-through;
                    }
                }
            }

            .countControl {
                position: absolute;
                bottom: 15px;
                right: 18px;
            }
        }
    }
}
</style>