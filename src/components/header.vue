<template>
    <div id="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" alt="" class="set-img">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分送达
                </div>
                <!-- seller.supports获得当前是否有优惠，没有的话不渲染该dom结构 -->
                <div v-if="seller.supports" class="supports">
                    <!-- 优惠图标是变化的 创建一个数组 根据此时type值的不同挂载不同的类名 -->
                    <span class="icon bg-image" :class="classMap[seller.supports[0].type]"></span>
                    <span>{{seller.supports[0].description}}</span>
                </div>
                <div class="num-wrapper" v-if="seller.supports">
                    <span class="num">{{seller.supports.length}}个</span>
                    <span class="icon-keyboard_arrow_right more"></span>
                </div>
            </div>
        </div>
        <div class="bulletin-wrapper">
            <span class="bulletin-icon"></span>
            <span class="bulletin">{{seller.bulletin}}</span>
            <span class="icon-keyboard_arrow_right"></span>
        </div>
        <div class="background">
            <img :src="seller.avatar" alt="" >
        </div>
    </div>
</template>
<script>
export default {
    props: {
        //接收seller数据
        seller: {
            type: Object
        }
    },
    created() {
        //classMap用于渲染优惠活动图标，通过数据seller.supports[0].type获取索引值，
        //进而得出当前的优惠活动,然后通过:class动态绑定相应的活动图标

        this.classMap = ['decrease', 'discount', 'special', 'invoice_1', 'guarantee']
    }
}
</script>
<style lang='stylus' ref='stylesheet/stylus'>
@import '../../static/style.css';
@import '../assets/stylus/index.styl';

#header {
    position: relative;
    overflow: hidden;

    .content-wrapper {
        position: relative;
        padding: 24px 24px 18px;
        background: rgba(7, 17, 27, 0.5);

        .avatar {
            float: left;
        }

        img {
            border-radius: 2px;
            set-img(64px);
        }

        .content {
            margin-left: 64px;
            padding-left: 16px;
            color: rgb(255, 255, 255);

            .title {
                .brand {
                    display: inline-block;
                    bg-image('brand');
                    width: 30px;
                    height: 18px;
                    background-size: 30px 18px;
                    vertical-align: top;
                }

                .name {
                    font-size: 16px;
                    font-weight: bold;
                }
            }

            .description {
                margin-top: 8px;
                font-size: 12px;
                line-height: 12px;
            }

            .supports {
                margin-top: 10px;
                font-size: 12px;

                span {
                    display: inline-block;
                }

                .icon {
                    display: inline-block;
                    vertical-align: top;
                    width: 16px;
                    height: 16px;
                    background-size: 16px 16px;

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
                }
            }

            .num-wrapper {
                color: rgb(255, 255, 255);
                position: absolute;
                right: 12px;
                bottom: 14px;
                padding: 7px 8px;
                font-size: 10px;
                border-radius: 12px;
                background-color: rgba(0, 0, 0, 0.2);
                height: 12px;
                line-height: 12px;

                .more {
                    vertical-align: middle;
                }
            }
        }
    }

    .bulletin-wrapper {
        position: relative;
        height: 28px;
        background-color: rgba(7, 17, 27, 0.2);
        padding: 0 12px 0 12px;
        line-height: 28px;
        overflow: hidden;
        color: white;
        font-size: 10px;

        .bulletin-icon {
            display: inline-block;
            vertical-align: middle;
            width: 22px;
            height: 12px;
            bg-image('bulletin');
            background-size: 22px 12px;
        }

        .bulletin {
            display: inline-block;
            width: 90%;
            margin-left: 4px;
            white-space: nowrap;
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .background {
        position: absolute;
        top: 0;
        right: 0;
        z-index: -1;
        width: 100%;
        filter: blur(10px);

        img {
            background-size: cover;
            width: 100%;
        }
    }
}
</style>