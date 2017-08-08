<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterTop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click="setPriceFilter('all')"><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}">All</a></dd>
              <dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index)">
                <a href="javascript:void(0)" :class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodslist">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                <!-- <img src="../assets/loading-spinning-bubbles.svg" v-show="loading"/> -->
                加载中。。。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overlayFlag" @click="closePop"></div>
    <modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车！
      </p>
      <div slot="btnGroup">
        <a href="javascript:void(0)" class="btn btn-m" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
        <span>加入购车车成功！</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:void(0)" class="btn btn-m" @click="mdShowCart=false">继续购物</a>
        <router-link href="javascript:void(0)" class="btn btn-m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import NavHeader from '../components/header.vue'
import NavFooter from '../components/footer.vue'
import navBread from '../components/navBread.vue'
import modal from '../components/modal.vue'
export default {
  data() {
    return {
      goodslist: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false,
      loading: false,
      mdShowCart:false,//加入购物车 成功
      mdShow: false, //弹框显示与否--加入失败
      priceFilter: [{
        startPrice: '0.00',
        endPrice: '100.00'
      }, {
        startPrice: '100.00',
        endPrice: '500.00'
      }, {
        startPrice: '500.00',
        endPrice: '1000.00'
      }, {
        startPrice: '1000.00',
        endPrice: '2000.00'
      }],
      priceChecked: 'all', //选中的价格
      filterBy: false, //价格是否显示
      overlayFlag: false, //这次是否显示
    }
  },
  components: {
    NavHeader,
    NavFooter,
    navBread,
    modal
  },
  mounted: function() {
    this.getGoodList();
  },
  methods: {
    getGoodList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      this.loading = true;
      this.axios.get('/goods/list', {
        params: param
      }).then((result) => {
        this.loading = false;
        var res = result.data;
        if (res.status == '0') {
          if (flag) {
            this.goodslist = this.goodslist.concat(res.result.list);
            if (res.result.count == 0) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodslist = res.result.list;
            this.busy = false;
          }
        } else {
          this.goodslist = [];
        }
      });
    },
    //排序
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodList();
    },
    //价格列表点击事件
    setPriceFilter(index) {
      this.priceChecked = index;
      this.filterBy = false;
      this.overlayFlag = false;

      this.page = 1;
      this.getGoodList();
    },
    //滚动加载--分页
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodList(true);
      }, 1000);
    },
    //加入购物车
    addCart(id) {
      this.axios.post('/goods/addCart', {
        productId: id
      }).then((res) => {
        //console.log(res);
        if (res.data.status == 0) {
          //alert('成功');
          this.mdShowCart=true;
          this.$store.commit('updateCartCount',1);
        } else {
          this.mdShow = true;
          //alert(res.data.msg);
        }
      });
    },
    showFilterTop() {
      this.filterBy = true;
      this.overlayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overlayFlag = false;
    },
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    },
  }
}

</script>
<style>
.icon-arrow-short {
  transiton: all .3s ease-out;
}

.sort-up {
  transform: rotate(180deg);
}

.btn:hover {
  background-color: #ffe5e6;
  transiton: all .3s ease-out;
}

</style>
