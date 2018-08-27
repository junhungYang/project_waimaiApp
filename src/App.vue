<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <v-header :seller = 'seller'></v-header>
    <div class="tab">
      <div class="tab-item">
         <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
              <router-link to='/sellers'>评价</router-link>
      </div>
      <div class="tab-item">
      <router-link to='/ratings'>商家</router-link>
      </div>

    </div>
    <div class="content">
      <router-view  :deliveryPrice= 'deliveryPrice'></router-view>
    </div>
  </div>
</template>

<script>
import header from './components/header'
import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      seller: {},
      deliveryPrice: 0
    }
  },
  components: {
    'v-header': header
  },
  created() {
    //获取数据，并且分发至v-header与content组件
    axios.get('/good/seller').then(res => {
      if (res.data.code === 0) {
        this.seller = res.data.data
        this.deliveryPrice = this.seller.deliveryPrice
      }
    })
  },
}
</script>

<style lang='stylus' ref='stylesheet/stylus'>
@import 'assets/stylus/index.styl';

#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex-grow: 1;
      width: 0px;
      text-align: center;

      a {
        width: 100%;
        height: 100%;
        display: block;
        color: rgb(77, 85, 93);
      }

      a.active {
        color: rgb(240, 20, 20) !important;
      }
    }
  }
}
</style>
